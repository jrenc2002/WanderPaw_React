// Leaflet地图使用的示例数据
export interface InteractivePoint {
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

// 中国主要城市的躺平指数数据
export const chineseCitiesData: InteractivePoint[] = [
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

// 全球主要城市数据
export const globalCitiesData: InteractivePoint[] = [
  {
    id: 'tokyo',
    position: [35.6762, 139.6503],
    title: '东京',
    description: 'Japan\'s capital, high living standards',
    tangpingIndex: 40,
    data: {
      averageSalary: 45000,
      rentPrice: 120000,
      currency: 'JPY',
      workLifeBalance: '一般',
      costOfLiving: 88,
      qualityOfLife: 85
    }
  },
  {
    id: 'seoul',
    position: [37.5665, 126.9780],
    title: '首尔',
    description: 'South Korea\'s dynamic capital',
    tangpingIndex: 35,
    data: {
      averageSalary: 3500000,
      rentPrice: 800000,
      currency: 'KRW',
      workLifeBalance: '较差',
      costOfLiving: 85,
      qualityOfLife: 80
    }
  },
  {
    id: 'singapore',
    position: [1.3521, 103.8198],
    title: '新加坡',
    description: 'Garden city with high quality of life',
    tangpingIndex: 60,
    data: {
      averageSalary: 6500,
      rentPrice: 2800,
      currency: 'SGD',
      workLifeBalance: '良好',
      costOfLiving: 90,
      qualityOfLife: 92
    }
  },
  {
    id: 'bangkok',
    position: [13.7563, 100.5018],
    title: '曼谷',
    description: 'Thailand\'s vibrant capital',
    tangpingIndex: 80,
    data: {
      averageSalary: 25000,
      rentPrice: 8000,
      currency: 'THB',
      workLifeBalance: '很好',
      costOfLiving: 45,
      qualityOfLife: 75
    }
  },
  {
    id: 'amsterdam',
    position: [52.3676, 4.9041],
    title: '阿姆斯特丹',
    description: 'Netherlands\' liberal capital',
    tangpingIndex: 85,
    data: {
      averageSalary: 4500,
      rentPrice: 1800,
      currency: 'EUR',
      workLifeBalance: '优秀',
      costOfLiving: 82,
      qualityOfLife: 95
    }
  },
  {
    id: 'copenhagen',
    position: [55.6761, 12.5683],
    title: '哥本哈根',
    description: 'Denmark\'s happiest city',
    tangpingIndex: 90,
    data: {
      averageSalary: 45000,
      rentPrice: 12000,
      currency: 'DKK',
      workLifeBalance: '优秀',
      costOfLiving: 88,
      qualityOfLife: 98
    }
  }
]

// 根据缩放级别返回不同的数据
export const getPointsByZoom = (zoom: number): InteractivePoint[] => {
  if (zoom >= 8) {
    // 高缩放级别显示所有城市
    return [...chineseCitiesData, ...globalCitiesData]
  } else if (zoom >= 5) {
    // 中等缩放级别显示主要城市
    return [
      ...chineseCitiesData.filter(city => ['beijing', 'shanghai', 'shenzhen', 'guangzhou', 'chengdu'].includes(city.id)),
      ...globalCitiesData
    ]
  } else {
    // 低缩放级别只显示全球主要城市
    return globalCitiesData
  }
} 