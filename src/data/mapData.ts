// 地图数据类型定义
export interface MapPoint {
  id: string
  position: [number, number] // [lat, lng]
  title: string
  description: string
  tangpingIndex: number
  data?: {
    averageSalary?: number
    rentPrice?: number
    currency?: string
    workLifeBalance?: string
    costOfLiving?: number
    qualityOfLife?: number
  }
}

export interface MapRoute {
  id: string
  name: string
  description?: string
  waypoints: Array<{
    position: [number, number] // [lat, lng]
    name?: string
  }>
  style?: {
    color?: string
    weight?: number
    opacity?: number
    dashArray?: string
  }
  travelMode?: 'driving' | 'walking' | 'transit' | 'bicycling'
  // 🌟 简单弯曲配置
  curveStyle?: {
    enabled?: boolean        // 是否启用弯曲
    intensity?: number      // 弯曲强度 (0.1-1.0，默认0.3)
  }
}

export interface MapConfig {
  center: [number, number]
  zoom: number
  points: MapPoint[]
  routes: MapRoute[]
}

// 默认样式配置
export const defaultRouteStyle = {
  color: '#3388ff',
  weight: 4,
  opacity: 0.8,
  dashArray: ''
}

// 中国主要城市的数据
export const chineseCitiesData: MapPoint[] = [
  {
    id: 'beijing',
    position: [39.9042, 116.4074],
    title: '北京',
    description: '首都，高消费高压力',
    tangpingIndex: 25,
    data: {
      averageSalary: 12000,
      rentPrice: 4500,
      currency: 'CNY',
      workLifeBalance: '较差',
      costOfLiving: 95,
      qualityOfLife: 75
    }
  },
  {
    id: 'shanghai',
    position: [31.2304, 121.4737],
    title: '上海',
    description: '经济中心，生活成本极高',
    tangpingIndex: 20,
    data: {
      averageSalary: 13500,
      rentPrice: 5200,
      currency: 'CNY',
      workLifeBalance: '很差',
      costOfLiving: 98,
      qualityOfLife: 72
    }
  },
  {
    id: 'shenzhen',
    position: [22.5431, 114.0579],
    title: '深圳',
    description: '科技之都，年轻人聚集地',
    tangpingIndex: 30,
    data: {
      averageSalary: 11800,
      rentPrice: 4800,
      currency: 'CNY',
      workLifeBalance: '较差',
      costOfLiving: 92,
      qualityOfLife: 78
    }
  },
  {
    id: 'guangzhou',
    position: [23.1291, 113.2644],
    title: '广州',
    description: '商贸中心，生活相对宜居',
    tangpingIndex: 45,
    data: {
      averageSalary: 9500,
      rentPrice: 3200,
      currency: 'CNY',
      workLifeBalance: '一般',
      costOfLiving: 82,
      qualityOfLife: 80
    }
  },
  {
    id: 'hangzhou',
    position: [30.2741, 120.1551],
    title: '杭州',
    description: '电商之都，环境优美',
    tangpingIndex: 55,
    data: {
      averageSalary: 10200,
      rentPrice: 3500,
      currency: 'CNY',
      workLifeBalance: '良好',
      costOfLiving: 85,
      qualityOfLife: 85
    }
  },
  {
    id: 'chengdu',
    position: [30.5728, 104.0668],
    title: '成都',
    description: '悠闲城市，生活节奏慢',
    tangpingIndex: 75,
    data: {
      averageSalary: 7800,
      rentPrice: 2200,
      currency: 'CNY',
      workLifeBalance: '很好',
      costOfLiving: 68,
      qualityOfLife: 88
    }
  },
  {
    id: 'chongqing',
    position: [29.5647, 106.5507],
    title: '重庆',
    description: '山城火锅，生活成本低',
    tangpingIndex: 70,
    data: {
      averageSalary: 7200,
      rentPrice: 1800,
      currency: 'CNY',
      workLifeBalance: '好',
      costOfLiving: 62,
      qualityOfLife: 82
    }
  },
  {
    id: 'wuhan',
    position: [30.5928, 114.3055],
    title: '武汉',
    description: '九省通衢，教育资源丰富',
    tangpingIndex: 60,
    data: {
      averageSalary: 7500,
      rentPrice: 2000,
      currency: 'CNY',
      workLifeBalance: '良好',
      costOfLiving: 65,
      qualityOfLife: 80
    }
  },
  {
    id: 'xian',
    position: [34.3416, 108.9398],
    title: '西安',
    description: '古都风韵，生活悠闲',
    tangpingIndex: 65,
    data: {
      averageSalary: 6800,
      rentPrice: 1600,
      currency: 'CNY',
      workLifeBalance: '好',
      costOfLiving: 58,
      qualityOfLife: 78
    }
  },
  {
    id: 'nanjing',
    position: [32.0603, 118.7969],
    title: '南京',
    description: '六朝古都，文化底蕴深厚',
    tangpingIndex: 50,
    data: {
      averageSalary: 8500,
      rentPrice: 2800,
      currency: 'CNY',
      workLifeBalance: '一般',
      costOfLiving: 72,
      qualityOfLife: 82
    }
  },
  {
    id: 'qingdao',
    position: [36.0986, 120.3719],
    title: '青岛',
    description: '海滨城市，环境宜人',
    tangpingIndex: 68,
    data: {
      averageSalary: 7000,
      rentPrice: 2300,
      currency: 'CNY',
      workLifeBalance: '好',
      costOfLiving: 65,
      qualityOfLife: 85
    }
  },
  {
    id: 'dalian',
    position: [38.9140, 121.6147],
    title: '大连',
    description: '北方明珠，气候宜人',
    tangpingIndex: 72,
    data: {
      averageSalary: 6500,
      rentPrice: 2000,
      currency: 'CNY',
      workLifeBalance: '好',
      costOfLiving: 62,
      qualityOfLife: 83
    }
  }
]

// 示例路线数据 - 展示可爱弯曲线条！🎨
export const sampleRoutes: MapRoute[] = [
  {
    id: 'beijing-shanghai',
    name: '京沪高铁',
    description: '连接北京和上海的高速铁路',
    waypoints: [
      { position: [39.9042, 116.4074], name: '北京' },
      { position: [34.8114, 117.1175], name: '徐州' },
      { position: [32.0603, 118.7969], name: '南京' },
      { position: [31.2304, 121.4737], name: '上海' }
    ],
    style: {
      color: '#ff4444',
      weight: 6,
      opacity: 0.9
    },
    travelMode: 'transit',
    // 🚄 高铁线路：微妙弯曲
    curveStyle: {
      enabled: true,
      intensity: 0.3
    }
  },
  {
    id: 'beijing-shenzhen',
    name: '京深高速',
    description: '从北京到深圳的高速公路',
    waypoints: [
      { position: [39.9042, 116.4074], name: '北京' },
      { position: [30.5928, 114.3055], name: '武汉' },
      { position: [23.1291, 113.2644], name: '广州' },
      { position: [22.5431, 114.0579], name: '深圳' }
    ],
    style: {
      color: '#44ff44',
      weight: 5,
      opacity: 0.8
    },
    travelMode: 'driving',
    // 🛣️ 高速公路：轻微弯曲
    curveStyle: {
      enabled: true,
      intensity: 0.25
    }
  },
  {
    id: 'hangzhou-chengdu',
    name: '杭蓉高速',
    description: '从杭州到成都的旅游路线',
    waypoints: [
      { position: [30.2741, 120.1551], name: '杭州' },
      { position: [32.0603, 118.7969], name: '南京' },
      { position: [34.3416, 108.9398], name: '西安' },
      { position: [30.5728, 104.0668], name: '成都' }
    ],
    style: {
      color: '#4444ff',
      weight: 4,
      opacity: 0.7,
      dashArray: '10,5'
    },
    travelMode: 'driving',
    // 🏞️ 旅游线路：自然弯曲
    curveStyle: {
      enabled: true,
      intensity: 0.4
    }
  }
]

// 根据缩放级别返回不同的数据
export const getPointsByZoom = (zoom: number): MapPoint[] => {
  if (zoom >= 8) {
    // 高缩放级别显示所有城市
    return chineseCitiesData
  } else if (zoom >= 5) {
    // 中等缩放级别显示主要城市
    return chineseCitiesData.filter(city => 
      ['beijing', 'shanghai', 'shenzhen', 'guangzhou', 'chengdu', 'hangzhou'].includes(city.id)
    )
  } else {
    // 低缩放级别只显示主要城市
    return chineseCitiesData.filter(city => 
      ['beijing', 'shanghai', 'shenzhen', 'chengdu'].includes(city.id)
    )
  }
}

// 根据缩放级别返回路线数据
export const getRoutesByZoom = (zoom: number): MapRoute[] => {
  if (zoom >= 6) {
    return sampleRoutes
  } else if (zoom >= 4) {
    return sampleRoutes.filter(route => 
      ['beijing-shanghai', 'beijing-shenzhen'].includes(route.id)
    )
  } else {
    return []
  }
}

// 默认地图配置
export const defaultMapConfig: MapConfig = {
  center: [35.0, 110.0], // 中国中心
  zoom: 4,
  points: getPointsByZoom(4),
  routes: getRoutesByZoom(4)
}

// JSON配置示例
export const mapConfigExample = {
  center: [35.0, 110.0],
  zoom: 5,
  points: [
    {
      id: 'example-city',
      position: [39.9042, 116.4074],
      title: '示例城市',
      description: '这是一个示例城市',
      tangpingIndex: 60,
      data: {
        averageSalary: 8000,
        rentPrice: 3000,
        currency: 'CNY'
      }
    }
  ],
  routes: [
    {
      id: 'example-route',
      name: '示例路线',
      description: '这是一个示例路线',
      waypoints: [
        { position: [39.9042, 116.4074], name: '起点' },
        { position: [31.2304, 121.4737], name: '终点' }
      ],
      style: {
        color: '#ff6600',
        weight: 5,
        opacity: 0.8
      },
      travelMode: 'driving'
    }
  ]
} 