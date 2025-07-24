import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 宠物类型枚举
export type PetType = 'cat' | 'dog' | 'other' | 'none'

// 宠物性别枚举  
export type PetGender = 'male' | 'female' | 'unknown'

// 宠物性格枚举
export type PetPersonality = 'active' | 'gentle' | 'independent' | 'clingy' | 'playful' | 'calm' | 'curious' | 'shy'

// 宠物年龄段枚举
export type PetAge = 'young' | 'adult' | 'senior'

// 宠物信息接口
export interface PetInfo {
  type?: PetType
  name?: string
  gender?: PetGender
  personality?: PetPersonality[]
  age?: PetAge
  avatar?: string
}

// 初始化步骤枚举
export type InitializationStep = 'type' | 'details' | 'personality' | 'confirmation'

// 初始化状态接口
export interface PetInitializationState {
  currentStep: InitializationStep
  petInfo: PetInfo
  isCompleted: boolean
  isSkipped: boolean
}

// 宠物状态管理
export const petStateAtom = atomWithStorage<PetInitializationState>('petInitialization', {
  currentStep: 'type',
  petInfo: {},
  isCompleted: false,
  isSkipped: false,
})

// 当前步骤atom
export const currentStepAtom = atom(
  (get) => get(petStateAtom).currentStep,
  (get, set, step: InitializationStep) => {
    const currentState = get(petStateAtom)
    set(petStateAtom, { ...currentState, currentStep: step })
  }
)

// 宠物信息atom
export const petInfoAtom = atom(
  (get) => get(petStateAtom).petInfo,
  (get, set, petInfo: PetInfo) => {
    const currentState = get(petStateAtom)
    set(petStateAtom, { ...currentState, petInfo })
  }
)

// 是否完成初始化atom
export const isInitializationCompletedAtom = atom(
  (get) => get(petStateAtom).isCompleted,
  (get, set, isCompleted: boolean) => {
    const currentState = get(petStateAtom)
    set(petStateAtom, { ...currentState, isCompleted })
  }
)

// 是否跳过初始化atom
export const isInitializationSkippedAtom = atom(
  (get) => get(petStateAtom).isSkipped,
  (get, set, isSkipped: boolean) => {
    const currentState = get(petStateAtom)
    set(petStateAtom, { ...currentState, isSkipped })
  }
)

// 重置初始化状态atom
export const resetPetInitializationAtom = atom(
  null,
  (get, set) => {
    set(petStateAtom, {
      currentStep: 'type',
      petInfo: {},
      isCompleted: false,
      isSkipped: false,
    })
    // 清除本地存储
    localStorage.removeItem('petInitialization')
  }
)

// 下一步操作atom
export const nextStepAtom = atom(
  null,
  (get, set) => {
    const currentState = get(petStateAtom)
    const steps: InitializationStep[] = ['type', 'details', 'personality', 'confirmation']
    const currentIndex = steps.indexOf(currentState.currentStep)
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      set(petStateAtom, { ...currentState, currentStep: nextStep })
    }
  }
)

// 上一步操作atom
export const previousStepAtom = atom(
  null,
  (get, set) => {
    const currentState = get(petStateAtom)
    const steps: InitializationStep[] = ['type', 'details', 'personality', 'confirmation']
    const currentIndex = steps.indexOf(currentState.currentStep)
    
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1]
      set(petStateAtom, { ...currentState, currentStep: previousStep })
    }
  }
)

// 宠物类型选项
export const PET_TYPE_OPTIONS = [
  { value: 'cat', label: '猫咪', emoji: '🐱' },
  { value: 'dog', label: '狗狗', emoji: '🐶' },
  { value: 'other', label: '其他宠物', emoji: '🐹' },
  { value: 'none', label: '暂无宠物', emoji: '🚫' },
] as const

// 宠物性别选项
export const PET_GENDER_OPTIONS = [
  { value: 'male', label: '公', emoji: '♂️' },
  { value: 'female', label: '母', emoji: '♀️' },
  { value: 'unknown', label: '不详', emoji: '❓' },
] as const

// 宠物性格选项
export const PET_PERSONALITY_OPTIONS = [
  { value: 'active', label: '活泼', emoji: '⚡' },
  { value: 'gentle', label: '温顺', emoji: '😊' },
  { value: 'independent', label: '独立', emoji: '🦅' },
  { value: 'clingy', label: '粘人', emoji: '🤗' },
  { value: 'playful', label: '调皮', emoji: '😜' },
  { value: 'calm', label: '安静', emoji: '😌' },
  { value: 'curious', label: '好奇', emoji: '🔍' },
  { value: 'shy', label: '害羞', emoji: '😳' },
] as const

// 宠物年龄选项
export const PET_AGE_OPTIONS = [
  { value: 'young', label: '幼年', emoji: '🍼' },
  { value: 'adult', label: '成年', emoji: '💪' },
  { value: 'senior', label: '老年', emoji: '👴' },
] as const 