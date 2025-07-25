import type { TripActivity } from '@/store/TripState'

// 真实城市的活动坐标数据
export const cityActivityCoordinates: Record<string, {
  center: [number, number]
  activities: Array<{
    id: string
    theme: string
    coordinates: [number, number]
    name: string
    nameEn: string
  }>
}> = {
  'CN-beijing': {
    center: [116.4074, 39.9042],
    activities: [
      {
        id: 'forbidden-city',
        theme: 'culture',
        coordinates: [116.3974, 39.9163],
        name: '故宫博物院',
        nameEn: 'Forbidden City'
      },
      {
        id: 'tiananmen',
        theme: 'photography',
        coordinates: [116.3913, 39.9054],
        name: '天安门广场',
        nameEn: 'Tiananmen Square'
      },
      {
        id: 'temple-of-heaven',
        theme: 'nature',
        coordinates: [116.4167, 39.8828],
        name: '天坛公园',
        nameEn: 'Temple of Heaven'
      },
      {
        id: 'wangfujing',
        theme: 'shopping',
        coordinates: [116.4103, 39.9097],
        name: '王府井大街',
        nameEn: 'Wangfujing Street'
      },
      {
        id: 'beijing-roast-duck',
        theme: 'food',
        coordinates: [116.3889, 39.9288],
        name: '全聚德烤鸭店',
        nameEn: 'Quanjude Roast Duck'
      },
      {
        id: 'houhai',
        theme: 'nightlife',
        coordinates: [116.3911, 39.9368],
        name: '后海酒吧街',
        nameEn: 'Houhai Bar Street'
      }
    ]
  },
  'CN-shanghai': {
    center: [121.4737, 31.2304],
    activities: [
      {
        id: 'the-bund',
        theme: 'photography',
        coordinates: [121.4845, 31.2396],
        name: '外滩',
        nameEn: 'The Bund'
      },
      {
        id: 'yu-garden',
        theme: 'culture',
        coordinates: [121.4920, 31.2276],
        name: '豫园',
        nameEn: 'Yu Garden'
      },
      {
        id: 'peoples-park',
        theme: 'relaxation',
        coordinates: [121.4692, 31.2285],
        name: '人民公园',
        nameEn: 'People\'s Park'
      },
      {
        id: 'nanjing-road',
        theme: 'shopping',
        coordinates: [121.4692, 31.2353],
        name: '南京路步行街',
        nameEn: 'Nanjing Road'
      },
      {
        id: 'xiaolongbao',
        theme: 'food',
        coordinates: [121.4775, 31.2232],
        name: '南翔小笼包',
        nameEn: 'Nanxiang Xiaolongbao'
      },
      {
        id: 'xintiandi',
        theme: 'nightlife',
        coordinates: [121.4746, 31.2190],
        name: '新天地',
        nameEn: 'Xintiandi'
      }
    ]
  },
  'CN-guangzhou': {
    center: [113.2644, 23.1291],
    activities: [
      {
        id: 'canton-tower',
        theme: 'photography',
        coordinates: [113.3191, 23.1059],
        name: '广州塔',
        nameEn: 'Canton Tower'
      },
      {
        id: 'chen-clan-academy',
        theme: 'culture',
        coordinates: [113.2456, 23.1264],
        name: '陈家祠',
        nameEn: 'Chen Clan Academy'
      },
      {
        id: 'yuexiu-park',
        theme: 'nature',
        coordinates: [113.2734, 23.1324],
        name: '越秀公园',
        nameEn: 'Yuexiu Park'
      },
      {
        id: 'shangxiajiu',
        theme: 'shopping',
        coordinates: [113.2426, 23.1150],
        name: '上下九步行街',
        nameEn: 'Shangxiajiu Pedestrian Street'
      },
      {
        id: 'dim-sum',
        theme: 'food',
        coordinates: [113.2587, 23.1167],
        name: '广式茶楼',
        nameEn: 'Cantonese Tea House'
      },
      {
        id: 'zhujiang-night',
        theme: 'nightlife',
        coordinates: [113.3105, 23.1089],
        name: '珠江夜游',
        nameEn: 'Pearl River Night Cruise'
      }
    ]
  },
  'CN-chengdu': {
    center: [104.0668, 30.5728],
    activities: [
      {
        id: 'panda-base',
        theme: 'nature',
        coordinates: [104.1469, 30.7378],
        name: '大熊猫繁育研究基地',
        nameEn: 'Giant Panda Research Base'
      },
      {
        id: 'jinli-street',
        theme: 'culture',
        coordinates: [104.0434, 30.6470],
        name: '锦里古街',
        nameEn: 'Jinli Ancient Street'
      },
      {
        id: 'peoples-park-chengdu',
        theme: 'relaxation',
        coordinates: [104.0754, 30.6598],
        name: '人民公园',
        nameEn: 'People\'s Park'
      },
      {
        id: 'chunxi-road',
        theme: 'shopping',
        coordinates: [104.0861, 30.6625],
        name: '春熙路',
        nameEn: 'Chunxi Road'
      },
      {
        id: 'hotpot',
        theme: 'food',
        coordinates: [104.0517, 30.6687],
        name: '巴蜀大宅门火锅',
        nameEn: 'Bashu Hotpot'
      },
      {
        id: 'jiuyanqiao',
        theme: 'nightlife',
        coordinates: [104.1002, 30.6456],
        name: '九眼桥酒吧街',
        nameEn: 'Jiuyanqiao Bar Street'
      }
    ]
  }
}

// 为特定城市和主题生成活动坐标
export const generateActivityCoordinatesForCity = (
  cityId: string,
  theme: string,
  activityIndex: number
): [number, number] => {
  const cityData = cityActivityCoordinates[cityId]
  
  if (!cityData) {
    // 如果没有该城市的数据，使用默认生成逻辑
    return generateRandomCoordinates(cityData?.center || [116.4074, 39.9042], activityIndex)
  }

  // 优先使用真实的活动坐标
  const matchingActivity = cityData.activities.find(activity => activity.theme === theme)
  if (matchingActivity) {
    return matchingActivity.coordinates
  }

  // 如果没有匹配的主题，随机选择一个活动坐标
  const randomActivity = cityData.activities[activityIndex % cityData.activities.length]
  return randomActivity.coordinates
}

// 随机生成坐标的辅助函数
const generateRandomCoordinates = (
  center: [number, number],
  index: number
): [number, number] => {
  const [baseLng, baseLat] = center
  const radius = 0.05 // 大约5公里范围
  const angle = (index / 6) * 2 * Math.PI // 将活动均匀分布在圆周上
  const distance = 0.02 + Math.random() * (radius - 0.02)
  
  const lng = baseLng + distance * Math.cos(angle)
  const lat = baseLat + distance * Math.sin(angle)
  
  return [lng, lat]
}

// 为活动生成带有真实坐标的完整数据
export const enhanceActivitiesWithCoordinates = (
  activities: Omit<TripActivity, 'coordinates' | 'status'>[],
  cityId: string
): TripActivity[] => {
  return activities.map((activity, index) => ({
    ...activity,
    coordinates: generateActivityCoordinatesForCity(cityId, activity.theme, index),
    status: 'pending' as const
  }))
}

// 获取城市的真实活动建议
export const getCityActivitySuggestions = (cityId: string, theme: string) => {
  const cityData = cityActivityCoordinates[cityId]
  if (!cityData) return null

  return cityData.activities.filter(activity => activity.theme === theme)
}

// 生成更真实的城市活动数据
export const generateRealisticCityActivities = (
  cityId: string,
  themes: string[],
  language: 'zh' | 'en' = 'zh'
): Omit<TripActivity, 'coordinates' | 'status'>[] => {
  const cityData = cityActivityCoordinates[cityId]
  if (!cityData) {
    // 返回默认活动
    return []
  }

  const activities: Omit<TripActivity, 'coordinates' | 'status'>[] = []
  
  themes.forEach(theme => {
    const themeActivities = cityData.activities.filter(activity => activity.theme === theme)
    
    themeActivities.forEach((realActivity, index) => {
      const baseTime = 9 + activities.length * 2 // 从9点开始，每个活动间隔2小时
      const timeStr = `${baseTime.toString().padStart(2, '0')}:00`
      
      activities.push({
        id: realActivity.id,
        time: timeStr,
        title: language === 'zh' ? realActivity.name : realActivity.nameEn,
        titleEn: realActivity.nameEn,
        location: language === 'zh' ? realActivity.name : realActivity.nameEn,
        locationEn: realActivity.nameEn,
        theme: realActivity.theme,
        duration: 90 + Math.random() * 60, // 90-150分钟
        description: language === 'zh' 
          ? `探索${realActivity.name}，体验当地文化` 
          : `Explore ${realActivity.nameEn} and experience local culture`,
        descriptionEn: `Explore ${realActivity.nameEn} and experience local culture`
      })
    })
  })

  return activities
} 