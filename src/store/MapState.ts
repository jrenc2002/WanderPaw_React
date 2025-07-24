import { atom } from 'jotai'

// 地图层级类型
export type MapLevel = 'world' | 'country' | 'province' | 'city'

// 地区数据结构
export interface RegionData {
  id: string
  name: string
  nameEn: string
  type: MapLevel
  parentId?: string
  countryCode: string // ISO 3166-1 alpha-2
  
  // 生活成本数据
  currency: string
  averageSalary: number       // 平均工资
  rentPrice: number          // 房租(月)
  foodCost: number           // 餐饮费用(月)
  transportCost: number      // 交通费用(月)
  entertainmentCost: number  // 娱乐费用(月)
  livingIndex: number        // 生活成本指数 (0-100)
  
  // 生活质量指标
  workLifeBalance: number    // 工作生活平衡 (0-100)
  socialSafety: number       // 社会安全指数 (0-100)
  culturalDiversity: number  // 文化多样性 (0-100)
  languageBarrier: number    // 语言障碍度 (0-100)
  climateComfort: number     // 气候舒适度 (0-100)
  internetSpeed: number      // 网络速度 (Mbps)
  
  // 躺平指数相关
  tangpingIndex: number      // 躺平指数 (0-100)
  lifeQuality: number        // 生活质量 (0-100)
  stressFactor: number       // 压力因子 (0-100)
  freelanceFriendly: number  // 自由职业友好度 (0-100)
  
  // 其他数据
  population: number
  gdpPerCapita: number
  unemploymentRate: number
  timezone: string
  coordinates: [number, number] // [lng, lat]
}

// 地图导航状态
export interface MapNavigation {
  currentLevel: MapLevel
  currentRegion: string
  breadcrumb: Array<{
    id: string
    name: string
    level: MapLevel
  }>
}

// 过滤选项
export interface FilterOptions {
  salaryRange: [number, number]
  rentRange: [number, number]
  tangpingIndexRange: [number, number]
  selectedCurrencies: string[]
  selectedRegionTypes: MapLevel[]
  minLifeQuality: number
  maxStressFactor: number
}

// 比较模式
export interface ComparisonData {
  enabled: boolean
  selectedRegions: string[]
  maxCompare: number
}

// 状态 atoms
export const mapNavigationAtom = atom<MapNavigation>({
  currentLevel: 'world',
  currentRegion: 'world',
  breadcrumb: [{ id: 'world', name: '世界', level: 'world' }]
})

export const regionsDataAtom = atom<Record<string, RegionData>>({})

export const loadingAtom = atom<boolean>(false)

export const errorAtom = atom<string>('')

export const filterOptionsAtom = atom<FilterOptions>({
  salaryRange: [0, 100000],
  rentRange: [0, 5000],
  tangpingIndexRange: [0, 100],
  selectedCurrencies: [],
  selectedRegionTypes: [],
  minLifeQuality: 0,
  maxStressFactor: 100
})

export const comparisonDataAtom = atom<ComparisonData>({
  enabled: false,
  selectedRegions: [],
  maxCompare: 5
})

export const hoveredRegionAtom = atom<string | null>(null)

export const selectedLanguageAtom = atom<'zh' | 'en'>('zh')

// 计算属性：当前显示的地区数据
export const currentRegionsAtom = atom((get) => {
  const navigation = get(mapNavigationAtom)
  const allRegions = get(regionsDataAtom)
  const filter = get(filterOptionsAtom)
  
  // 根据当前层级筛选地区
  const regions = Object.values(allRegions).filter(region => {
    if (navigation.currentLevel === 'world') {
      return region.type === 'country'
    } else {
      return region.parentId === navigation.currentRegion
    }
  })
  
  // 应用过滤条件
  return regions.filter(region => {
    return region.averageSalary >= filter.salaryRange[0] &&
           region.averageSalary <= filter.salaryRange[1] &&
           region.rentPrice >= filter.rentRange[0] &&
           region.rentPrice <= filter.rentRange[1] &&
           region.tangpingIndex >= filter.tangpingIndexRange[0] &&
           region.tangpingIndex <= filter.tangpingIndexRange[1] &&
           region.lifeQuality >= filter.minLifeQuality &&
           region.stressFactor <= filter.maxStressFactor
  })
})

// 工具函数：货币转换 (简化版本，实际应该对接汇率API)
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string = 'USD'): number => {
  const exchangeRates: Record<string, number> = {
    'USD': 1,
    'CNY': 0.14,
    'EUR': 1.09,
    'JPY': 0.0067,
    'GBP': 1.25,
    'KRW': 0.00075,
    'SGD': 0.74,
    'AUD': 0.64,
    'CAD': 0.71
  }
  
  const fromRate = exchangeRates[fromCurrency] || 1
  const toRate = exchangeRates[toCurrency] || 1
  
  return (amount * fromRate) / toRate
}

// 工具函数：计算躺平指数
export const calculateTangpingIndex = (region: RegionData): number => {
  const {
    workLifeBalance,
    lifeQuality,
    stressFactor,
    socialSafety,
    livingIndex,
    freelanceFriendly
  } = region
  
  // 躺平指数计算公式 (权重可调整)
  const index = (
    workLifeBalance * 0.25 +
    lifeQuality * 0.2 +
    (100 - stressFactor) * 0.2 +
    socialSafety * 0.15 +
    (100 - livingIndex) * 0.1 +
    freelanceFriendly * 0.1
  )
  
  return Math.round(index)
} 