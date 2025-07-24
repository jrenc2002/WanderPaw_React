import { useEffect, useRef, useState, useCallback } from 'react'
import * as echarts from 'echarts'
import { useAtom } from 'jotai'
import {
  hoveredRegionAtom,
  type RegionData
} from '@/store/GlobalMapState'
import { mockRegionsData } from '@/data/mockData'
import {
  getProvinceByCoordinates,
  getCityByCoordinates,
  MAP_DATA_SOURCES,
  BEIJING_DISTRICTS,
  SHANGHAI_DISTRICTS
} from '@/data/geoData'

interface MultiLevelMapProps {
  onRegionClick?: (regionId: string) => void
  onRegionHover?: (regionId: string | null) => void
  className?: string
}

interface MapLevel {
  name: string
  minZoom: number
  maxZoom: number
  dataType: 'country' | 'province' | 'city' | 'district'
  mapUrl?: string
}

// 定义地图层级配置
const MAP_LEVELS: MapLevel[] = [
  {
    name: 'world',
    minZoom: 0,
    maxZoom: 3,
    dataType: 'country'
  },
  {
    name: 'country',
    minZoom: 3,
    maxZoom: 6,
    dataType: 'province'
  },
  {
    name: 'province',
    minZoom: 6,
    maxZoom: 10,
    dataType: 'city'
  },
  {
    name: 'city',
    minZoom: 10,
    maxZoom: 15,
    dataType: 'district'
  }
]

export const MultiLevelMap: React.FC<MultiLevelMapProps> = ({
  onRegionClick,
  onRegionHover,
  className = "w-full h-full"
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  
  const [, setHoveredRegion] = useAtom(hoveredRegionAtom)
  
  const [loading, setLoading] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(1.2)
  const [currentLevel, setCurrentLevel] = useState<MapLevel>(MAP_LEVELS[0])
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 10])

  // 根据缩放级别获取当前应该显示的地图层级
  const getCurrentLevel = useCallback((zoom: number): MapLevel => {
    for (const level of MAP_LEVELS) {
      if (zoom >= level.minZoom && zoom < level.maxZoom) {
        return level
      }
    }
    return MAP_LEVELS[MAP_LEVELS.length - 1] // 返回最高层级
  }, [])

  // 动态加载地图数据
  const loadMapData = async (level: MapLevel, center?: [number, number]) => {
    setLoading(true)
    try {
      let mapData = null
      
      if (level.name === 'world') {
        // 世界地图
        try {
          const response = await fetch(MAP_DATA_SOURCES.world)
          mapData = await response.json()
        } catch {
          // 备用数据源
          const response = await fetch(MAP_DATA_SOURCES.worldBackup)
          mapData = await response.json()
        }
      } else if (level.name === 'country') {
        // 国家级别地图（省份）
        if (center && isInChina(center)) {
          // 如果焦点在中国，加载中国省份地图
          const response = await fetch(MAP_DATA_SOURCES.chinaProvinces)
          mapData = await response.json()
        } else {
          // 其他国家暂时使用世界地图
          const response = await fetch(MAP_DATA_SOURCES.world)
          mapData = await response.json()
        }
      } else if (level.name === 'province') {
        // 省级地图（城市）
        if (center && isInChina(center)) {
          // 根据焦点位置加载对应省份的城市地图
          const provinceCode = getProvinceCodeByLocation(center)
          if (provinceCode) {
            const response = await fetch(MAP_DATA_SOURCES.chinaProvince(provinceCode))
            mapData = await response.json()
          }
        }
      } else if (level.name === 'city') {
        // 城市级地图（区县）
        if (center && isInChina(center)) {
          const cityCode = getCityCodeByLocation(center)
          if (cityCode) {
            const response = await fetch(MAP_DATA_SOURCES.chinaCity(cityCode))
            mapData = await response.json()
          }
        }
      }
      
      if (mapData) {
        echarts.registerMap(level.name, mapData)
      }
      
      return mapData
    } catch (error) {
      console.error(`Failed to load map data for level ${level.name}:`, error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // 判断是否在中国境内
  const isInChina = (center: [number, number]): boolean => {
    const [lng, lat] = center
    return lng >= 73 && lng <= 135 && lat >= 18 && lat <= 54
  }

  // 根据经纬度获取省份代码
  const getProvinceCodeByLocation = (center: [number, number]): string | null => {
    const [lng, lat] = center
    return getProvinceByCoordinates(lng, lat)
  }

  // 根据经纬度获取城市代码
  const getCityCodeByLocation = (center: [number, number]): string | null => {
    const [lng, lat] = center
    return getCityByCoordinates(lng, lat)
  }

  // 根据当前层级获取显示数据
  const getCurrentRegions = useCallback((level: MapLevel, center?: [number, number]): RegionData[] => {
    const allRegions = Object.values(mockRegionsData)
    
    if (level.dataType === 'country') {
      return allRegions.filter(region => region.type === 'country')
    } else if (level.dataType === 'province') {
      // 如果焦点在中国，显示中国省份
      if (center && isInChina(center)) {
        return allRegions.filter(region => region.type === 'province' && region.parentId === 'CN')
      }
      return allRegions.filter(region => region.type === 'country')
    } else if (level.dataType === 'city') {
      // 根据焦点位置显示对应省份的城市
      if (center && isInChina(center)) {
        const provinceCode = getProvinceCodeByLocation(center)
        if (provinceCode) {
          return allRegions.filter(region => region.type === 'city' && region.parentId?.includes(provinceCode.slice(0, 2)))
        }
      }
      return []
    } else if (level.dataType === 'district') {
      // 显示区县数据
      return generateDistrictData(center)
    }
    
    return []
  }, [])

  // 生成模拟的区县数据
  const generateDistrictData = (center?: [number, number]): RegionData[] => {
    if (!center || !isInChina(center)) return []
    
    const provinceCode = getProvinceCodeByLocation(center)
    let districts: any[] = []
    
    if (provinceCode === '110000') {
      // 北京市区
      districts = Object.entries(BEIJING_DISTRICTS).map(([code, info]) => ({
        code,
        ...info,
        tangpingIndex: 40 + Math.random() * 30
      }))
    } else if (provinceCode === '310000') {
      // 上海市区
      districts = Object.entries(SHANGHAI_DISTRICTS).map(([code, info]) => ({
        code,
        ...info,
        tangpingIndex: 35 + Math.random() * 35
      }))
    } else {
      // 其他省份的默认区县
      districts = [
        { code: 'default_01', name: '市辖区', nameEn: 'Municipal District', coordinates: center, tangpingIndex: 50 + Math.random() * 20 },
        { code: 'default_02', name: '新城区', nameEn: 'New District', coordinates: [center[0] + 0.1, center[1]], tangpingIndex: 55 + Math.random() * 20 },
        { code: 'default_03', name: '开发区', nameEn: 'Development Zone', coordinates: [center[0] - 0.1, center[1]], tangpingIndex: 45 + Math.random() * 25 }
      ]
    }
    
    return districts.map((district, index) => ({
      id: district.code || `district_${index}`,
      name: district.name,
      nameEn: district.nameEn,
      type: 'city' as const,
      parentId: provinceCode || 'unknown',
      countryCode: 'CN',
      currency: 'CNY',
      averageSalary: 6000 + Math.random() * 8000,
      rentPrice: 2000 + Math.random() * 4000,
      foodCost: 800 + Math.random() * 600,
      transportCost: 200 + Math.random() * 300,
      entertainmentCost: 400 + Math.random() * 600,
      livingIndex: 60 + Math.random() * 30,
      workLifeBalance: 35 + Math.random() * 40,
      socialSafety: 75 + Math.random() * 20,
      culturalDiversity: 50 + Math.random() * 30,
      languageBarrier: 5 + Math.random() * 15,
      climateComfort: 60 + Math.random() * 20,
      internetSpeed: 80 + Math.random() * 80,
      tangpingIndex: district.tangpingIndex,
      lifeQuality: 60 + Math.random() * 25,
      stressFactor: 55 + Math.random() * 30,
      freelanceFriendly: 40 + Math.random() * 40,
      population: 300000 + Math.random() * 1500000,
      gdpPerCapita: 10000 + Math.random() * 15000,
      unemploymentRate: 2 + Math.random() * 4,
      timezone: 'Asia/Shanghai',
      coordinates: district.coordinates as [number, number]
    }))
  }

  // 国家名称映射
  const getRegionMapName = (region: RegionData, level: MapLevel): string => {
    if (level.dataType === 'country') {
      const nameMapping: Record<string, string> = {
        'CN': 'China',
        'US': 'United States of America',
        'JP': 'Japan',
        'KR': 'South Korea',
        'SG': 'Singapore',
        'TH': 'Thailand',
        'DE': 'Germany',
        'NL': 'Netherlands',
        'DK': 'Denmark',
        'CA': 'Canada',
        'AU': 'Australia'
      }
      return nameMapping[region.id] || region.nameEn
    }
    return region.name
  }

  // 获取地图配置
  const getMapOption = useCallback((level: MapLevel, regions: RegionData[]) => {
    const seriesData = regions.map(region => ({
      name: getRegionMapName(region, level),
      value: region.tangpingIndex,
      regionData: region
    }))

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'transparent',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
          fontSize: 14
        },
        formatter: (params: any) => {
          const data = params.data?.regionData
          if (!data) return params.name
          
          return `
            <div style="padding: 12px; line-height: 1.6;">
              <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
                ${data.name} (${data.nameEn})
              </div>
              <div style="color: #4ade80; font-size: 14px; margin-bottom: 4px;">
                🏠 躺平指数: ${data.tangpingIndex}
              </div>
              <div style="color: #60a5fa; font-size: 12px; margin-bottom: 2px;">
                💰 平均工资: ${data.averageSalary.toLocaleString()} ${data.currency}
              </div>
              <div style="color: #f87171; font-size: 12px; margin-bottom: 2px;">
                🏡 房租: ${data.rentPrice.toLocaleString()} ${data.currency}
              </div>
              <div style="color: #a78bfa; font-size: 12px;">
                ⚖️ 工作生活平衡: ${data.workLifeBalance}
              </div>
            </div>
          `
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        text: ['高躺平指数', '低躺平指数'],
        calculable: true,
        inRange: {
          color: [
            '#ff4444', // 红色 - 低躺平指数
            '#ff8844', 
            '#ffcc44', // 黄色 - 中等
            '#88ff44',
            '#44ff88', // 绿色 - 高躺平指数
          ]
        },
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.3)'
      },
      series: [
        {
          name: '躺平指数',
          type: 'map',
          map: level.name,
          roam: true,
          scaleLimit: {
            min: 1,
            max: 15
          },
          center: mapCenter,
          zoom: currentZoom,
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#fff'
            },
            itemStyle: {
              areaColor: '#ffa726',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          },
          itemStyle: {
            borderColor: '#333',
            borderWidth: 0.5,
            areaColor: '#404040'
          },
          data: seriesData
        }
      ]
    }
  }, [mapCenter, currentZoom])

  // 处理地图缩放事件
  const handleMapZoom = useCallback((params: any) => {
    const newZoom = params.zoom || currentZoom
    const newCenter = params.center || mapCenter
    
    setCurrentZoom(newZoom)
    setMapCenter(newCenter)
    
    const newLevel = getCurrentLevel(newZoom)
    if (newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel)
    }
  }, [currentZoom, mapCenter, currentLevel, getCurrentLevel])

  // 初始化和更新图表
  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return

      // 销毁旧图表
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }

      // 创建新图表
      chartInstance.current = echarts.init(chartRef.current)
      
      // 加载地图数据
      await loadMapData(currentLevel, mapCenter)
      
      // 获取当前地区数据
      const regions = getCurrentRegions(currentLevel, mapCenter)
      
      // 设置图表选项
      const option = getMapOption(currentLevel, regions)
      chartInstance.current.setOption(option)

      // 绑定事件
      chartInstance.current.on('click', (params: any) => {
        if (params.data?.regionData) {
          const regionId = params.data.regionData.id
          onRegionClick?.(regionId)
        }
      })

      chartInstance.current.on('mouseover', (params: any) => {
        if (params.data?.regionData) {
          const regionId = params.data.regionData.id
          setHoveredRegion(regionId)
          onRegionHover?.(regionId)
        }
      })

      chartInstance.current.on('mouseout', () => {
        setHoveredRegion(null)
        onRegionHover?.(null)
      })

      // 绑定缩放事件
      chartInstance.current.on('georoam', handleMapZoom)
    }

    initChart()

    // 处理窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [currentLevel, mapCenter])

  // 当层级改变时重新加载数据
  useEffect(() => {
    if (chartInstance.current) {
      const updateMapData = async () => {
        await loadMapData(currentLevel, mapCenter)
        const regions = getCurrentRegions(currentLevel, mapCenter)
        const option = getMapOption(currentLevel, regions)
        chartInstance.current?.setOption(option, true)
      }
      updateMapData()
    }
  }, [currentLevel, mapCenter, getCurrentRegions, getMapOption])

  return (
    <div className={`relative ${className}`}>
      <div ref={chartRef} className="w-full h-full" />
      
      {/* 层级指示器 */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-white text-sm">
            <div className="font-semibold">当前层级: {currentLevel.dataType}</div>
            <div className="text-xs opacity-80">缩放: {currentZoom.toFixed(1)}</div>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white text-lg">加载 {currentLevel.dataType} 地图中...</span>
          </div>
        </div>
      )}
    </div>
  )
} 