import React from 'react'
import { useAtom } from 'jotai'
import { petInfoAtom, PET_GENDER_OPTIONS, PET_AGE_OPTIONS, type PetGender, type PetAge } from '@/store/PetState'

export const PetDetailsForm: React.FC = () => {
  const [petInfo, setPetInfo] = useAtom(petInfoAtom)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPetInfo({ ...petInfo, name: e.target.value })
  }

  const handleGenderSelect = (gender: PetGender) => {
    setPetInfo({ ...petInfo, gender })
  }

  const handleAgeSelect = (age: PetAge) => {
    setPetInfo({ ...petInfo, age })
  }

  // 如果用户选择了"暂无宠物"，显示不同的内容
  if (petInfo.type === 'none') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          没关系！
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          即使没有宠物，您也可以在WanderPaw中探索有趣的内容，或者为将来的毛茸茸朋友做准备。
        </p>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            💡 提示：您随时可以在设置中添加宠物信息
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          告诉我们更多关于您的宠物
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          这些信息将帮助我们为您提供更个性化的内容
        </p>
      </div>

      {/* 宠物名字 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          宠物名字 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={petInfo.name || ''}
          onChange={handleNameChange}
          placeholder="输入宠物的名字"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          这将在应用中显示，您可以随时修改
        </p>
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
              onClick={() => handleGenderSelect(option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                petInfo.gender === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
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

      {/* 宠物年龄 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          年龄段
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PET_AGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAgeSelect(option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                petInfo.age === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
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

      {/* 当前选择的预览 */}
      {(petInfo.name || petInfo.gender || petInfo.age) && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            当前信息：
          </h4>
          <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
            {petInfo.name && <p>名字：{petInfo.name}</p>}
            {petInfo.gender && (
              <p>性别：{PET_GENDER_OPTIONS.find(opt => opt.value === petInfo.gender)?.label}</p>
            )}
            {petInfo.age && (
              <p>年龄：{PET_AGE_OPTIONS.find(opt => opt.value === petInfo.age)?.label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 