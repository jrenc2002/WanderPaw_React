import React from 'react'
import { useAtom } from 'jotai'
import { petInfoAtom, PET_PERSONALITY_OPTIONS, type PetPersonality } from '@/store/PetState'

export const PetPersonalitySelection: React.FC = () => {
  const [petInfo, setPetInfo] = useAtom(petInfoAtom)

  const handlePersonalityToggle = (personality: PetPersonality) => {
    const currentPersonalities = petInfo.personality || []
    let newPersonalities: PetPersonality[]

    if (currentPersonalities.includes(personality)) {
      // 如果已选择，则移除
      newPersonalities = currentPersonalities.filter(p => p !== personality)
    } else {
      // 如果未选择，则添加（最多选择3个）
      if (currentPersonalities.length < 3) {
        newPersonalities = [...currentPersonalities, personality]
      } else {
        return // 超过最大选择数量，不做任何操作
      }
    }

    setPetInfo({ ...petInfo, personality: newPersonalities })
  }

  const selectedCount = petInfo.personality?.length || 0
  const maxSelections = 3

  // 如果用户选择了"暂无宠物"，显示不同的内容
  if (petInfo.type === 'none') {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          性格很重要
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          当您有了宠物后，了解它们的性格特征将帮助您更好地照顾它们，也让我们为您推荐更合适的内容。
        </p>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            💡 不同性格的宠物需要不同的关爱方式
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {petInfo.name || '您的宠物'}是什么性格呢？
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          选择最多 {maxSelections} 个最符合的性格特征
        </p>
        <div className="mt-2">
          <span className="text-sm text-blue-600 dark:text-blue-400">
            已选择 {selectedCount}/{maxSelections}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PET_PERSONALITY_OPTIONS.map((option) => {
          const isSelected = petInfo.personality?.includes(option.value) || false
          const isDisabled = !isSelected && selectedCount >= maxSelections

          return (
            <button
              key={option.value}
              onClick={() => handlePersonalityToggle(option.value)}
              disabled={isDisabled}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : isDisabled
                  ? 'border-gray-200 dark:border-gray-600 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              {isSelected && (
                <div className="mt-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedCount > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            {petInfo.name || '您的宠物'}的性格特征：
          </h4>
          <div className="flex flex-wrap gap-2">
            {petInfo.personality?.map((personality) => {
              const option = PET_PERSONALITY_OPTIONS.find(opt => opt.value === personality)
              return (
                <span
                  key={personality}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                >
                  <span className="mr-1">{option?.emoji}</span>
                  {option?.label}
                </span>
              )
            })}
          </div>
          {selectedCount < maxSelections && (
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              还可以选择 {maxSelections - selectedCount} 个特征
            </p>
          )}
        </div>
      )}

      {selectedCount === 0 && (
        <div className="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            请至少选择一个性格特征来继续
          </p>
        </div>
      )}
    </div>
  )
} 