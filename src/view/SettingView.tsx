import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'

import { authStateAtom, updateUserAtom, logoutAtom } from '@/store/AuthState'
import { 
  PET_TYPE_OPTIONS, 
  PET_GENDER_OPTIONS, 
  PET_AGE_OPTIONS, 
  PET_PERSONALITY_OPTIONS,
  type PetInfo 
} from '@/store/PetState'
import { PetService } from '@/services/petService'
import { getUnifiedButtonStyle, getSecondaryButtonStyle, handleButtonHover, handleSecondaryButtonHover } from '@/utils/buttonStyles'

const SettingView: React.FC = () => {
  const [authState] = useAtom(authStateAtom)
  const [, updateUser] = useAtom(updateUserAtom)
  const [, logout] = useAtom(logoutAtom)
  
  const [petInfo, setPetInfo] = useState<PetInfo>(authState.user?.petInfo || {})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'pet' | 'account' | 'about'>('pet')

  // 同步用户宠物信息到本地状态
  useEffect(() => {
    if (authState.user?.petInfo) {
      setPetInfo(authState.user.petInfo)
    }
  }, [authState.user?.petInfo])

  const handlePetInfoSave = async () => {
    if (!authState.accessToken) {
      toast.error('请先登录')
      return
    }

    setLoading(true)
    try {
      await PetService.updatePetInfo(petInfo, authState.accessToken)
      
      // 更新本地用户状态
      updateUser({
        petInfo: petInfo,
        isInitialized: true,
      })
      
      toast.success('宠物信息已更新')
    } catch (error: any) {
      toast.error(error.message || '更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('已退出登录')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">设置</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理您的账户和偏好设置</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { key: 'pet', label: '🐾 宠物信息', icon: '🐾' },
              { key: 'account', label: '👤 账户设置', icon: '👤' },
              { key: 'about', label: '📱 关于应用', icon: '📱' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === 'pet' && (
            <PetSettingsTab 
              petInfo={petInfo} 
              setPetInfo={setPetInfo} 
              onSave={handlePetInfoSave}
              loading={loading}
            />
          )}
          
          {activeTab === 'account' && (
            <AccountSettingsTab 
              user={authState.user} 
              onLogout={handleLogout}
            />
          )}
          
          {activeTab === 'about' && <AboutTab />}
        </div>
      </div>
    </div>
  )
}

// 宠物设置标签页组件
const PetSettingsTab: React.FC<{
  petInfo: PetInfo
  setPetInfo: (info: PetInfo) => void
  onSave: () => Promise<void>
  loading: boolean
}> = ({ petInfo, setPetInfo, onSave, loading }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🐾 宠物信息管理
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          在这里管理您的宠物信息，这将影响为您推荐的内容
        </p>
      </div>

      {/* 宠物类型 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          宠物类型
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PET_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPetInfo({ ...petInfo, type: option.value })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                petInfo.type === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 宠物名字 */}
      {petInfo.type && petInfo.type !== 'none' && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              宠物名字
            </label>
            <input
              type="text"
              value={petInfo.name || ''}
              onChange={(e) => setPetInfo({ ...petInfo, name: e.target.value })}
              placeholder="输入宠物的名字"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* 宠物性别 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              性别
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PET_GENDER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPetInfo({ ...petInfo, gender: option.value })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    petInfo.gender === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 宠物年龄 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              年龄段
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PET_AGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPetInfo({ ...petInfo, age: option.value })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                    petInfo.age === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xl mb-1">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 宠物性格 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              性格特征 (最多选择3个)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PET_PERSONALITY_OPTIONS.map((option) => {
                const isSelected = petInfo.personality?.includes(option.value) || false
                const selectedCount = petInfo.personality?.length || 0
                const canSelect = isSelected || selectedCount < 3

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (!canSelect && !isSelected) return

                      const current = petInfo.personality || []
                      const newPersonality = isSelected
                        ? current.filter(p => p !== option.value)
                        : [...current, option.value]
                      
                      setPetInfo({ ...petInfo, personality: newPersonality })
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : canSelect
                        ? 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                        : 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xl mb-1">{option.emoji}</div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              已选择 {petInfo.personality?.length || 0}/3 个特征
            </p>
          </div>
        </>
      )}

      {/* 保存按钮 */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={loading}
          style={getUnifiedButtonStyle(loading)}
          onMouseEnter={(e) => handleButtonHover(e, true, loading)}
          onMouseLeave={(e) => handleButtonHover(e, false, loading)}
        >
          {loading ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  )
}

// 账户设置标签页组件
const AccountSettingsTab: React.FC<{
  user: any
  onLogout: () => void
}> = ({ user, onLogout }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          👤 账户设置
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          管理您的账户信息和登录设置
        </p>
      </div>

      {/* 用户信息 */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          基本信息
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">用户名：</span>
            <span className="text-gray-900 dark:text-white">{user?.username}</span>
          </div>
          {user?.phoneNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">手机号：</span>
              <span className="text-gray-900 dark:text-white">{user.phoneNumber}</span>
            </div>
          )}
          {user?.lastLogin && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">最后登录：</span>
              <span className="text-gray-900 dark:text-white">
                {new Date(user.lastLogin).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">初始化状态：</span>
            <span className={`${user?.isInitialized ? 'text-green-600' : 'text-orange-600'}`}>
              {user?.isInitialized ? '已完成' : '未完成'}
            </span>
          </div>
        </div>
      </div>

      {/* 登出按钮 */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLogout}
          style={getSecondaryButtonStyle()}
          onMouseEnter={(e) => handleSecondaryButtonHover(e, true)}
          onMouseLeave={(e) => handleSecondaryButtonHover(e, false)}
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

// 关于应用标签页组件
const AboutTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📱 关于 <span className="wanderpaw-title">WanderPaw</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          一个专为宠物爱好者设计的生活探索应用
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 应用信息 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            应用信息
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">版本：</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">开发者：</span>
              <span className="text-gray-900 dark:text-white"><span className="wanderpaw-title">WanderPaw</span> Team</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">技术栈：</span>
              <span className="text-gray-900 dark:text-white">React + Fastify</span>
            </div>
          </div>
        </div>

        {/* 开发者社交 */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            开发者链接
          </h3>
          <div className="space-y-3">
            <a
              href="https://space.bilibili.com/32090268"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="mr-2">📹</span>
              Bilibili 视频教程
            </a>
            <a
              href="https://github.com/jrenc2002"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="mr-2">🔗</span>
              GitHub 项目
            </a>
            <a
              href="https://jrenc.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="mr-2">🌐</span>
              个人主页
            </a>
          </div>
        </div>
      </div>

      {/* 特色功能 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          ✨ 应用特色
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span>🐾</span>
            <div>
              <strong>个性化宠物设置</strong>
              <p className="text-gray-600 dark:text-gray-400">根据宠物类型和性格定制体验</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🗺️</span>
            <div>
              <strong>智能地图探索</strong>
              <p className="text-gray-600 dark:text-gray-400">发现适合您和宠物的地点</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>📱</span>
            <div>
              <strong>响应式设计</strong>
              <p className="text-gray-600 dark:text-gray-400">在任何设备上都有良好体验</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔒</span>
            <div>
              <strong>隐私保护</strong>
              <p className="text-gray-600 dark:text-gray-400">您的数据安全是我们的首要任务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingView