import React from 'react'
import { useAtom } from 'jotai'
import { 
  petInfoAtom, 
  PET_TYPE_OPTIONS, 
  PET_GENDER_OPTIONS, 
  PET_AGE_OPTIONS, 
  PET_PERSONALITY_OPTIONS 
} from '@/store/PetState'

export const PetInitializationConfirmation: React.FC = () => {
  const [petInfo] = useAtom(petInfoAtom)

  const getTypeInfo = () => {
    return PET_TYPE_OPTIONS.find(opt => opt.value === petInfo.type)
  }

  const getGenderInfo = () => {
    return PET_GENDER_OPTIONS.find(opt => opt.value === petInfo.gender)
  }

  const getAgeInfo = () => {
    return PET_AGE_OPTIONS.find(opt => opt.value === petInfo.age)
  }

  const getPersonalityInfo = () => {
    return petInfo.personality?.map(p => 
      PET_PERSONALITY_OPTIONS.find(opt => opt.value === p)
    ).filter(Boolean) || []
  }

  // 如果用户选择了"暂无宠物"
  if (petInfo.type === 'none') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🌟</div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          准备就绪！
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          即使暂时没有宠物，您也已经准备好开始探索WanderPaw的精彩世界了。
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🚫</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              暂无宠物
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            您可以随时在设置中添加宠物信息，我们会为您保存个性化的内容推荐。
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <span>📱</span>
            <span>探索有趣的宠物内容</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>💡</span>
            <span>为将来的宠物做准备</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>🔄</span>
            <span>随时添加宠物信息</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          确认宠物信息
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          请检查信息是否正确，您稍后可以在设置中修改
        </p>
      </div>

      {/* 宠物信息卡片 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">
            {getTypeInfo()?.emoji}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {petInfo.name || '未命名宠物'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getTypeInfo()?.label}
            </p>
          </div>
        </div>

        {/* 详细信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 基本信息 */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              基本信息
            </h5>
            
            {petInfo.gender && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getGenderInfo()?.emoji}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  性别：{getGenderInfo()?.label}
                </span>
              </div>
            )}

            {petInfo.age && (
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getAgeInfo()?.emoji}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  年龄：{getAgeInfo()?.label}
                </span>
              </div>
            )}
          </div>

          {/* 性格特征 */}
          {petInfo.personality && petInfo.personality.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                性格特征
              </h5>
              <div className="flex flex-wrap gap-2">
                {getPersonalityInfo().map((personality, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium"
                    style={{
                      borderRadius: '19.5px',
                      border: '1px solid #BBA084',
                      background: '#FDF5E8',
                      color: '#BBA084'
                    }}
                  >
                    <span className="mr-1">{personality?.emoji}</span>
                    {personality?.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 功能预览 */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🎉 完成后您将可以：
        </h5>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>获取基于宠物类型的个性化内容推荐</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🗺️</span>
            <span>探索适合您和宠物的地点和活动</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>💡</span>
            <span>接收针对性格特征的护理建议</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔄</span>
            <span>随时在设置中更新宠物信息</span>
          </div>
        </div>
      </div>

      {/* 隐私说明 */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          我们重视您的隐私，宠物信息仅用于提供个性化体验，不会与第三方分享
        </p>
      </div>
    </div>
  )
} 