// 统一的状态管理导出
export * from './MapState'
export * from './PetState'
export * from './TripState'

// 导出常用的组合状态
import { useAtom } from 'jotai'
import { 
  currentTripPlanAtom, 
  tripProgressAtom, 
  petTravelStateAtom,
  currentActivityAtom 
} from './TripState'
import { petInfoAtom } from './PetState'
import { selectedLanguageAtom } from './MapState'

// 自定义 Hook：旅行状态
export const useTripState = () => {
  const [currentTripPlan] = useAtom(currentTripPlanAtom)
  const [tripProgress] = useAtom(tripProgressAtom)
  const [petTravelState] = useAtom(petTravelStateAtom)
  const [currentActivity] = useAtom(currentActivityAtom)
  const [language] = useAtom(selectedLanguageAtom)

  return {
    currentTripPlan,
    tripProgress,
    petTravelState,
    currentActivity,
    language,
    isActive: !!currentTripPlan && currentTripPlan.status === 'active'
  }
}

// 自定义 Hook：宠物状态
export const usePetState = () => {
  const [petInfo] = useAtom(petInfoAtom)
  const [petTravelState] = useAtom(petTravelStateAtom)

  return {
    petInfo,
    petTravelState,
    hasCompanion: !!petInfo.name
  }
} 