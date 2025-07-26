import React from 'react'
import { useAtom } from 'jotai'
import { petInfoAtom, PET_TYPE_OPTIONS, type PetType } from '@/store/PetState'

export const PetTypeSelection: React.FC = () => {
  const [petInfo, setPetInfo] = useAtom(petInfoAtom)

  const handleTypeSelect = (type: PetType) => {
    setPetInfo({ ...petInfo, type })
    
    // 如果选择"暂无宠物"，清空其他信息
    if (type === 'none') {
      setPetInfo({
        type,
        name: undefined,
        gender: undefined,
        personality: undefined,
        age: undefined,
        avatar: undefined,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          您有什么样的宠物伙伴？
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          选择最符合的选项，让我们为您个性化体验
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PET_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleTypeSelect(option.value)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-lg ${
              petInfo.type === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{option.emoji}</div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {option.label}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTypeDescription(option.value)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {petInfo.type && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{PET_TYPE_OPTIONS.find(opt => opt.value === petInfo.type)?.emoji}</span>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                已选择：{PET_TYPE_OPTIONS.find(opt => opt.value === petInfo.type)?.label}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {petInfo.type === 'none' ? '您可以随时在设置中添加宠物信息' : '接下来我们来了解更多关于它的信息'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getTypeDescription(type: PetType): string {
  switch (type) {
    case 'cat':
      return '好奇调皮，偏爱探索城市的角落'
    case 'dog':
      return '热血探索，总能发现最棒的冒险'
    case 'other':
      return '安静温顺，用独特视角看世界'
    case 'none':
      return '暂时还没有宠物'
    default:
      return ''
  }
} 