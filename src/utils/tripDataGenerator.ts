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
  'CN-BJ': { // 修复：从 CN-beijing 改为 CN-BJ
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
      }
    ]
  },
  'CN-SH': { // 修复：从 CN-shanghai 改为 CN-SH
    center: [121.4737, 31.2304],
    activities: [
      {
        id: 'the-bund',
        theme: 'photography',
        coordinates: [121.4900, 31.2397],
        name: '外滩',
        nameEn: 'The Bund'
      },
      {
        id: 'yu-garden',
        theme: 'culture',
        coordinates: [121.4920, 31.2280],
        name: '豫园',
        nameEn: 'Yu Garden'
      },
      {
        id: 'peoples-park',
        theme: 'nature',
        coordinates: [121.4650, 31.2275],
        name: '人民公园',
        nameEn: 'People\'s Park'
      },
      {
        id: 'nanjing-road',
        theme: 'shopping',
        coordinates: [121.4758, 31.2344],
        name: '南京路步行街',
        nameEn: 'Nanjing Road'
      },
      {
        id: 'xiaolongbao',
        theme: 'food',
        coordinates: [121.4944, 31.2267],
        name: '南翔小笼包',
        nameEn: 'Nanxiang Xiaolongbao'
      }
    ]
  },
  'CN-GD': { // 修复：从 CN-guangzhou 改为 CN-GD
    center: [113.2644, 23.1291],
    activities: [
      {
        id: 'canton-tower',
        theme: 'photography',
        coordinates: [113.3189, 23.1059],
        name: '广州塔',
        nameEn: 'Canton Tower'
      },
      {
        id: 'chen-clan-academy',
        theme: 'culture',
        coordinates: [113.2438, 23.1267],
        name: '陈家祠',
        nameEn: 'Chen Clan Academy'
      },
      {
        id: 'yuexiu-park',
        theme: 'nature',
        coordinates: [113.2656, 23.1380],
        name: '越秀公园',
        nameEn: 'Yuexiu Park'
      },
      {
        id: 'beijing-road',
        theme: 'shopping',
        coordinates: [113.2661, 23.1290],
        name: '北京路步行街',
        nameEn: 'Beijing Road'
      },
      {
        id: 'dim-sum',
        theme: 'food',
        coordinates: [113.2590, 23.1163],
        name: '点心茶楼',
        nameEn: 'Dim Sum Restaurant'
      }
    ]
  },
  'CN-SC': { // 修复：从 CN-chengdu 改为 CN-SC
    center: [104.0668, 30.5728],
    activities: [
      {
        id: 'jinli-street',
        theme: 'culture',
        coordinates: [104.0433, 30.6471],
        name: '锦里古街',
        nameEn: 'Jinli Ancient Street'
      },
      {
        id: 'tianfu-square',
        theme: 'photography',
        coordinates: [104.0717, 30.6598],
        name: '天府广场',
        nameEn: 'Tianfu Square'
      },
      {
        id: 'peoples-park-chengdu',
        theme: 'nature',
        coordinates: [104.0589, 30.6710],
        name: '人民公园',
        nameEn: 'People\'s Park'
      },
      {
        id: 'chunxi-road',
        theme: 'shopping',
        coordinates: [104.0813, 30.6587],
        name: '春熙路',
        nameEn: 'Chunxi Road'
      },
      {
        id: 'hotpot',
        theme: 'food',
        coordinates: [104.0776, 30.6515],
        name: '火锅店',
        nameEn: 'Hotpot Restaurant'
      }
    ]
  },
  // 国际城市数据
  'DK': { // 丹麦 - 哥本哈根
    center: [12.5683, 55.6761],
    activities: [
      {
        id: 'little-mermaid',
        theme: 'photography',
        coordinates: [12.5993, 55.6928],
        name: '小美人鱼雕像',
        nameEn: 'The Little Mermaid'
      },
      {
        id: 'nyhavn',
        theme: 'culture',
        coordinates: [12.5913, 55.6798],
        name: '新港',
        nameEn: 'Nyhavn'
      },
      {
        id: 'tivoli-gardens',
        theme: 'nature',
        coordinates: [12.5681, 55.6736],
        name: '蒂沃利花园',
        nameEn: 'Tivoli Gardens'
      },
      {
        id: 'stroget',
        theme: 'shopping',
        coordinates: [12.5707, 55.6783],
        name: '步行街',
        nameEn: 'Strøget'
      },
      {
        id: 'danish-pastry',
        theme: 'food',
        coordinates: [12.5725, 55.6805],
        name: '丹麦糕点店',
        nameEn: 'Danish Pastry Shop'
      }
    ]
  },
  'US': { // 美国 - 纽约
    center: [-74.0060, 40.7128],
    activities: [
      {
        id: 'statue-of-liberty',
        theme: 'photography',
        coordinates: [-74.0445, 40.6892],
        name: '自由女神像',
        nameEn: 'Statue of Liberty'
      },
      {
        id: 'times-square',
        theme: 'culture',
        coordinates: [-73.9857, 40.7580],
        name: '时代广场',
        nameEn: 'Times Square'
      },
      {
        id: 'central-park',
        theme: 'nature',
        coordinates: [-73.9654, 40.7829],
        name: '中央公园',
        nameEn: 'Central Park'
      },
      {
        id: 'fifth-avenue',
        theme: 'shopping',
        coordinates: [-73.9776, 40.7614],
        name: '第五大道',
        nameEn: 'Fifth Avenue'
      },
      {
        id: 'pizza-slice',
        theme: 'food',
        coordinates: [-73.9969, 40.7505],
        name: '纽约披萨',
        nameEn: 'New York Pizza'
      }
    ]
  },
  'JP': { // 日本 - 东京
    center: [139.6917, 35.6895],
    activities: [
      {
        id: 'tokyo-tower',
        theme: 'photography',
        coordinates: [139.7454, 35.6586],
        name: '东京塔',
        nameEn: 'Tokyo Tower'
      },
      {
        id: 'sensoji-temple',
        theme: 'culture',
        coordinates: [139.7967, 35.7148],
        name: '浅草寺',
        nameEn: 'Sensoji Temple'
      },
      {
        id: 'ueno-park',
        theme: 'nature',
        coordinates: [139.7744, 35.7153],
        name: '上野公园',
        nameEn: 'Ueno Park'
      },
      {
        id: 'ginza',
        theme: 'shopping',
        coordinates: [139.7671, 35.6719],
        name: '银座',
        nameEn: 'Ginza'
      },
      {
        id: 'ramen-shop',
        theme: 'food',
        coordinates: [139.7005, 35.6762],
        name: '拉面店',
        nameEn: 'Ramen Shop'
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
    // 如果没有该城市的数据，抛出错误让调用方处理
    throw new Error(`No activity data found for city: ${cityId}`)
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