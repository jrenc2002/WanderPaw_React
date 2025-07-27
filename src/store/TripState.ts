import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { RegionData } from './MapState'
import type { PetInfo } from './PetState'
import { generateActivityCoordinatesForCity } from '@/utils/tripDataGenerator'

// 旅行主题类型
export interface TripTheme {
  id: string
  name: string
  nameEn: string
  icon: string
  description: string
  descriptionEn: string
  gradient: string
  popularity: number
}

// 旅行活动接口
export interface TripActivity {
  id: string
  time: string
  title: string
  titleEn: string
  location: string
  locationEn: string
  coordinates: [number, number] // [lng, lat]
  theme: string
  duration: number // 分钟
  description: string
  descriptionEn: string
  status: 'pending' | 'current' | 'completed' | 'skipped'
  tips?: string[] // 活动标签/提示
  photos?: string[]
  notes?: string
}

// 旅行路线点
export interface TripWaypoint {
  id: string
  name: string
  nameEn: string
  coordinates: [number, number]
  type: 'start' | 'activity' | 'rest' | 'end'
  activityId?: string
  estimatedTime?: string
  description?: string
}

// 旅行路线
export interface TripRoute {
  id: string
  waypoints: TripWaypoint[]
  totalDistance: number // 公里
  estimatedDuration: number // 分钟
  transportModes: ('walking' | 'driving' | 'transit')[]
  style: {
    color: string
    weight: number
    opacity: number
    pattern?: 'solid' | 'dashed' | 'dotted'
  }
}

// 完整的旅行计划
export interface TripPlan {
  id: string
  cityId: string
  cityName: string
  cityNameEn: string
  cityCoordinates: [number, number]
  selectedThemes: string[]
  selectedThemeNames: string[]
  activities: TripActivity[]
  route: TripRoute
  petCompanion: PetInfo
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// 旅行进度状态
export interface TripProgress {
  currentActivityIndex: number
  completedActivities: string[]
  totalActivities: number
  startTime?: string
  currentTime?: string
  elapsedTime: number // 分钟
  estimatedRemainingTime: number // 分钟
}

// 宠物旅行状态
export interface PetTravelState {
  mood: 'happy' | 'excited' | 'tired' | 'curious' | 'relaxed'
  energy: number // 0-100
  experience: number // 累计经验值
  location: [number, number] // 当前位置
  isVisible: boolean
  lastMoodUpdate: string
  moodMessage?: string
  dressUpItem?: {
    id: string
    name: string
    nameEn: string
    image: string
    type: 'hat' | 'accessory' | 'background'
  } | null
}

// 主要状态 atoms
export const currentTripPlanAtom = atomWithStorage<TripPlan | null>('currentTripPlan', null)

export const tripProgressAtom = atomWithStorage<TripProgress>('tripProgress', {
  currentActivityIndex: 0,
  completedActivities: [],
  totalActivities: 0,
  elapsedTime: 0,
  estimatedRemainingTime: 0
})

export const petTravelStateAtom = atomWithStorage<PetTravelState>('petTravelState', {
  mood: 'happy',
  energy: 100,
  experience: 0,
  location: [116.4074, 39.9042], // 默认北京
  isVisible: true,
  lastMoodUpdate: new Date().toISOString(),
  dressUpItem: null
})

// 历史旅行记录
export const tripHistoryAtom = atomWithStorage<TripPlan[]>('tripHistory', [])

// 计算属性：当前活动
export const currentActivityAtom = atom((get) => {
  const tripPlan = get(currentTripPlanAtom)
  const progress = get(tripProgressAtom)
  
  if (!tripPlan || !tripPlan.activities.length) return null
  
  return tripPlan.activities[progress.currentActivityIndex] || null
})

// 计算属性：即将进行的活动
export const upcomingActivitiesAtom = atom((get) => {
  const tripPlan = get(currentTripPlanAtom)
  const progress = get(tripProgressAtom)
  
  if (!tripPlan) return []
  
  return tripPlan.activities.slice(progress.currentActivityIndex + 1)
})

// 计算属性：旅行完成百分比
export const tripCompletionPercentageAtom = atom((get) => {
  const progress = get(tripProgressAtom)
  
  if (progress.totalActivities === 0) return 0
  
  return Math.round((progress.completedActivities.length / progress.totalActivities) * 100)
})

// 操作 atoms
export const startTripAtom = atom(
  null,
  (_get, set, tripPlan: TripPlan) => {
    // 设置当前旅行计划
    set(currentTripPlanAtom, {
      ...tripPlan,
      status: 'active',
      startDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // 重置进度
    set(tripProgressAtom, {
      currentActivityIndex: 0,
      completedActivities: [],
      totalActivities: tripPlan.activities.length,
      startTime: new Date().toISOString(),
      elapsedTime: 0,
      estimatedRemainingTime: tripPlan.activities.reduce((total, activity) => total + activity.duration, 0)
    })
    
    // 设置宠物初始状态
    set(petTravelStateAtom, {
      mood: 'excited',
      energy: 100,
      experience: 0,
      location: tripPlan.cityCoordinates,
      isVisible: true,
      lastMoodUpdate: new Date().toISOString(),
      moodMessage: undefined
    })
  }
)

export const completeCurrentActivityAtom = atom(
  null,
  (get, set) => {
    const tripPlan = get(currentTripPlanAtom)
    const progress = get(tripProgressAtom)
    const petState = get(petTravelStateAtom)
    
    if (!tripPlan || progress.currentActivityIndex >= tripPlan.activities.length) return
    
    const currentActivity = tripPlan.activities[progress.currentActivityIndex]
    
    // 更新活动状态
    const updatedActivities = tripPlan.activities.map((activity, index) => 
      index === progress.currentActivityIndex 
        ? { ...activity, status: 'completed' as const }
        : activity
    )
    
    // 更新旅行计划
    set(currentTripPlanAtom, {
      ...tripPlan,
      activities: updatedActivities,
      updatedAt: new Date().toISOString()
    })
    
    // 更新进度
    set(tripProgressAtom, {
      ...progress,
      currentActivityIndex: progress.currentActivityIndex + 1,
      completedActivities: [...progress.completedActivities, currentActivity.id],
      elapsedTime: progress.elapsedTime + currentActivity.duration
    })
    
    // 更新宠物状态
    const newExperience = petState.experience + 10
    const newEnergy = Math.max(0, petState.energy - 5)
    set(petTravelStateAtom, {
      ...petState,
      experience: newExperience,
      energy: newEnergy,
      location: currentActivity.coordinates,
      lastMoodUpdate: new Date().toISOString()
    })
  }
)

export const updatePetMoodAtom = atom(
  null,
  (get, set, mood: PetTravelState['mood'], message?: string) => {
    const petState = get(petTravelStateAtom)
    
    set(petTravelStateAtom, {
      ...petState,
      mood,
      moodMessage: message,
      lastMoodUpdate: new Date().toISOString()
    })
  }
)

export const completeTripAtom = atom(
  null,
  (get, set) => {
    const tripPlan = get(currentTripPlanAtom)
    const tripHistory = get(tripHistoryAtom)
    
    if (!tripPlan) return
    
    // 完成旅行计划
    const completedTrip = {
      ...tripPlan,
      status: 'completed' as const,
      endDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 添加到历史记录
    set(tripHistoryAtom, [completedTrip, ...tripHistory])
    
    // 更新当前计划状态为已完成，但不清除
    set(currentTripPlanAtom, completedTrip)
    
    // 重置进度
    set(tripProgressAtom, {
      currentActivityIndex: 0,
      completedActivities: [],
      totalActivities: 0,
      elapsedTime: 0,
      estimatedRemainingTime: 0
    })
  }
)

// 清除当前旅行计划（用户主动离开）
export const clearCurrentTripAtom = atom(
  null,
  (get, set) => {
    set(currentTripPlanAtom, null)
    set(tripProgressAtom, {
      currentActivityIndex: 0,
      completedActivities: [],
      totalActivities: 0,
      elapsedTime: 0,
      estimatedRemainingTime: 0
    })
  }
)

// 工具函数：生成路线
export const generateTripRoute = (activities: TripActivity[], cityCoordinates: [number, number]): TripRoute => {
  const waypoints: TripWaypoint[] = [
    // 只包含活动点，移除起始点和结束点
    ...activities.map((activity, _index) => ({
      id: activity.id,
      name: activity.location,
      nameEn: activity.locationEn,
      coordinates: activity.coordinates,
      type: 'activity' as const,
      activityId: activity.id,
      estimatedTime: activity.time,
      description: activity.description
    }))
  ]
  
  // 计算总距离（简化计算）
  let totalDistance = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [lng1, lat1] = waypoints[i].coordinates
    const [lng2, lat2] = waypoints[i + 1].coordinates
    const distance = Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2)) * 111 // 粗略转换为公里
    totalDistance += distance
  }
  
  return {
    id: `route_${Date.now()}`,
    waypoints,
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedDuration: activities.reduce((total, activity) => total + activity.duration, 0),
    transportModes: ['walking', 'transit'],
    style: {
      color: '#10B981', // emerald-500
      weight: 4,
      opacity: 0.8,
      pattern: 'solid'
    }
  }
}

// 工具函数：为活动生成坐标（使用真实城市数据）
export const generateActivityCoordinates = (
  cityCoordinates: [number, number],
  activityIndex: number,
  totalActivities: number,
  cityId?: string,
  theme?: string
): [number, number] => {
  // 如果有城市ID和主题，尝试使用真实坐标
  if (cityId && theme) {
    try {
      return generateActivityCoordinatesForCity(cityId, theme, activityIndex)
    } catch (error) {
      // 如果没有该城市的真实数据，这是正常情况，不需要警告
      console.log(`Using generated coordinates for city ${cityId} (no real data available)`)
    }
  }

  const [baseLng, baseLat] = cityCoordinates
  
  // 在城市周围生成随机但合理的坐标
  const radius = 0.05 // 大约5公里范围
  const angle = (activityIndex / totalActivities) * 2 * Math.PI
  const distance = 0.02 + Math.random() * (radius - 0.02) // 随机距离
  
  const lng = baseLng + distance * Math.cos(angle) + (Math.random() - 0.5) * 0.01
  const lat = baseLat + distance * Math.sin(angle) + (Math.random() - 0.5) * 0.01
  
  return [lng, lat]
}

// 工具函数：创建旅行计划
export const createTripPlan = (
  cityData: RegionData,
  themes: string[],
  themeNames: string[],
  activities: Omit<TripActivity, 'coordinates' | 'status'>[],
  petInfo: PetInfo
): TripPlan => {
  // 为活动生成坐标（使用真实城市数据）
  const activitiesWithCoordinates: TripActivity[] = activities.map((activity, index) => ({
    ...activity,
    coordinates: generateActivityCoordinates(
      cityData.coordinates, 
      index, 
      activities.length,
      cityData.id,
      activity.theme
    ),
    status: 'pending'
  }))
  
  // 生成路线
  const route = generateTripRoute(activitiesWithCoordinates, cityData.coordinates)
  
  return {
    id: `trip_${Date.now()}`,
    cityId: cityData.id,
    cityName: cityData.name,
    cityNameEn: cityData.nameEn,
    cityCoordinates: cityData.coordinates,
    selectedThemes: themes,
    selectedThemeNames: themeNames,
    activities: activitiesWithCoordinates,
    route,
    petCompanion: petInfo,
    startDate: '',
    endDate: '',
    status: 'planning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
} 