import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { 
  petInfoAtom, 
  isInitializationCompletedAtom, 
  isInitializationSkippedAtom,
  PRESET_PET_CHARACTERS,
  PET_PERSONALITY_OPTIONS,
  type PresetPetCharacter 
} from '@/store/PetState'
import { authStateAtom, updateUserAtom } from '@/store/AuthState'
import { PetService } from '@/services/petService'
import './PetCharacterSelection.css'

export const PetCharacterSelection: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<PresetPetCharacter | null>(null)
  
  // 状态管理
  const [, setPetInfo] = useAtom(petInfoAtom)
  const [, setCompleted] = useAtom(isInitializationCompletedAtom)
  const [, setSkipped] = useAtom(isInitializationSkippedAtom)
  
  // 认证状态
  const [authState] = useAtom(authStateAtom)
  const [, updateUser] = useAtom(updateUserAtom)

  const handleCharacterSelect = (character: PresetPetCharacter) => {
    setSelectedCharacter(character)
  }

  const handleConfirm = async () => {
    if (!selectedCharacter) {
      toast.error('请先选择一个小伙伴')
      return
    }

    if (!authState.accessToken) {
      toast.error('请先登录')
      return
    }

    setLoading(true)
    
    try {
      const petInfo = {
        type: selectedCharacter.type,
        name: selectedCharacter.name,
        gender: selectedCharacter.gender,
        personality: selectedCharacter.personality,
        age: selectedCharacter.age,
        avatar: selectedCharacter.emoji,
      }

      await PetService.initializePetInfo(petInfo, authState.accessToken)
      
      // 更新状态
      setPetInfo(petInfo)
      updateUser({
        isInitialized: true,
        petInfo: petInfo,
      })
      
      setCompleted(true)
      setSkipped(false)
      
      toast.success(`欢迎 ${selectedCharacter.name} 加入WanderPaw！`)
      navigate('/home')
    } catch (error: any) {
      toast.error(error.message || '初始化失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setSkipped(true)
    setCompleted(false)
    toast.success('已跳过宠物信息设置，您可以稍后在设置中完成')
    navigate('/home')
  }

  const getPersonalityLabel = (personalityValue: string) => {
    const option = PET_PERSONALITY_OPTIONS.find(opt => opt.value === personalityValue)
    return option ? option.label : personalityValue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 植物装饰 */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-400">
            <path d="M20,80 Q30,20 40,80 Q50,20 60,80" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="25" cy="40" r="8" fill="currentColor"/>
            <circle cx="35" cy="60" r="6" fill="currentColor"/>
            <circle cx="45" cy="35" r="7" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 opacity-15 transform rotate-45">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
            <path d="M10,50 Q30,10 50,50 Q70,10 90,50" stroke="currentColor" strokeWidth="3" fill="none"/>
            <path d="M15,60 Q25,40 35,60" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M65,60 Q75,40 85,60" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-1/4 w-36 h-36 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
            <circle cx="50" cy="80" r="15" fill="currentColor"/>
            <path d="M35,65 Q50,20 65,65" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path d="M40,70 Q45,50 50,70" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M50,70 Q55,50 60,70" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-800 dark:text-amber-200 mb-4">
            WanderPaw
          </h1>
          <p className="text-xl text-amber-700 dark:text-amber-300 font-medium">
            请选择您的小伙伴
          </p>
        </div>

        {/* 角色选择区域 */}
        <div className="flex-1 max-w-6xl mx-auto w-full">
          <div className="character-cards-grid mb-8">
            {PRESET_PET_CHARACTERS.map((character) => {
              return (
                <div
                  key={character.id}
                  onClick={() => handleCharacterSelect(character)}
                  tabIndex={0}
                  className={`character-card ${
                    selectedCharacter?.id === character.id ? 'selected' : ''
                  }`}
                >
                  <div className="character-card-content">
                    {/* 角色头像 */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-3">{character.emoji}</div>
                      <div className="bg-white/80 rounded-full px-4 py-2 inline-block">
                        <h3 className="font-bold text-gray-800 text-lg">{character.name}</h3>
                      </div>
                    </div>

                    {/* 性格描述 */}
                    <div className="flex-1">
                      <div className="bg-white/60 rounded-lg p-4 mb-4 relative">
                        <div className="text-xl text-gray-400 absolute -top-1 -left-1">"</div>
                        <p className="text-sm text-gray-700 leading-relaxed italic px-3">
                          {character.description}
                        </p>
                        <div className="text-xl text-gray-400 absolute -bottom-1 -right-1">"</div>
                      </div>

                      {/* 性格标签 */}
                      {character.personality.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3 justify-center">
                          {character.personality.slice(0, 3).map((personality) => (
                            <span
                              key={personality}
                              className="px-2 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-700 border border-gray-200"
                            >
                              {getPersonalityLabel(personality)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 座右铭 */}
                    <div className="text-center mt-auto">
                      <p className="text-sm font-medium text-gray-600 bg-white/50 rounded-lg px-3 py-2">
                        {character.quote}
                      </p>
                    </div>

                                        {/* 选中指示器 - 爪印图标 */}
                    {selectedCharacter?.id === character.id && (
                      <div className="absolute top-2 right-2">
                        <svg 
                          xmlns='http://www.w3.org/2000/svg' 
                          width='36' 
                          height='36' 
                          viewBox='0 0 24 24'
                          className="text-emerald-600 opacity-70 transform rotate-12 drop-shadow-lg animate-pulse"
                        >
                          <title>paw_fill</title>
                          <g id="paw_fill" fill='none' fillRule='evenodd'>
                            <path fill='currentColor' d='M12 3a1 1 0 0 1 1 1v.19c1.257.504 2 1.93 2 3.31 0 1.713-1.146 3.5-3 3.5S9 9.213 9 7.5c0-1.38.743-2.806 2-3.31V4a1 1 0 0 1 1-1m6.6 3.543a2.56 2.56 0 0 0-1.093.307c-.608.325-1.115.878-1.431 1.556-.316.677-.414 1.421-.272 2.095.142.675.545 1.342 1.27 1.68.724.338 1.495.218 2.103-.107.607-.325 1.114-.878 1.43-1.555.316-.678.414-1.422.272-2.096a2.562 2.562 0 0 0-.467-1.035 1 1 0 0 0-1.812-.845m-15.012.849c-.238.31-.39.67-.467 1.035-.142.674-.044 1.418.272 2.095.316.678.823 1.23 1.43 1.556.608.325 1.379.445 2.103.107.725-.338 1.128-1.006 1.27-1.68.142-.674.044-1.418-.272-2.096-.316-.677-.823-1.23-1.43-1.555A2.561 2.561 0 0 0 5.4 6.547a1 1 0 0 0-1.813.845Zm3.563 6.227A8.068 8.068 0 0 1 12 12c1.89 0 3.6.666 4.849 1.619 1.213.925 2.151 2.255 2.151 3.659 0 1.407-1.184 2.335-2.349 2.857C15.406 20.692 13.76 21 12 21c-1.76 0-3.406-.308-4.651-.865C6.184 19.613 5 18.685 5 17.278c0-1.404.938-2.734 2.151-3.66Z'/>
                          </g>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors font-medium"
            >
              暂时跳过
            </button>

            <button
              onClick={handleConfirm}
              disabled={!selectedCharacter || loading}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? '设置中...' : selectedCharacter ? `就选${selectedCharacter.name}了！` : '就选它了！'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 