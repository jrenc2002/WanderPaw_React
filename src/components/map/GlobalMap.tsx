import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useAtom } from 'jotai'
import {
  regionsDataAtom,
  hoveredRegionAtom,
  selectedLanguageAtom,
  type RegionData
} from '@/store/GlobalMapState'
import { mockRegionsData } from '@/data/mockData'
import { getAllGenesisSamples } from '@/data/genesisSamples'
import type { LifeSample } from '@/store/lifeSample'

interface GlobalMapProps {
  onRegionClick?: (regionId: string) => void
  onRegionHover?: (regionId: string | null) => void
  onSampleClick?: (sampleId: string) => void
  className?: string
}

export const GlobalMap: React.FC<GlobalMapProps> = ({
  onRegionClick,
  onRegionHover,
  onSampleClick,
  className = "w-full h-full"
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  
  const [regionsData] = useAtom(regionsDataAtom)
  const [, setHoveredRegion] = useAtom(hoveredRegionAtom)
  const [language] = useAtom(selectedLanguageAtom)
  
  const [loading, setLoading] = useState(false)

  // 动态加载世界地图数据
  const loadWorldMapData = async () => {
    setLoading(true)
    try {
      // 使用公开的世界地图GeoJSON数据
      const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      const worldGeoJSON = await response.json()
      
      // 注册世界地图
      echarts.registerMap('world', worldGeoJSON)
      return worldGeoJSON
    } catch (error) {
      console.error('Failed to load world map data:', error)
      // 如果加载失败，尝试备用数据源
      try {
        const response = await fetch('https://datahub.io/core/geo-countries/r/countries.geojson')
        const worldGeoJSON = await response.json()
        echarts.registerMap('world', worldGeoJSON)
        return worldGeoJSON
      } catch (fallbackError) {
        console.error('Fallback world map data also failed:', fallbackError)
        return null
      }
    } finally {
      setLoading(false)
    }
  }

  // 获取世界国家数据
  const getWorldCountries = (): RegionData[] => {
    return Object.values(mockRegionsData).filter(region => region.type === 'country')
  }

  // 获取生活样本数据
  const getLifeSamples = (): LifeSample[] => {
    return getAllGenesisSamples()
  }

  // 国家名称映射（处理不同的命名方式）
  const getCountryMapName = (region: RegionData): string => {
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

  // 获取地图配置
  const getMapOption = () => {
    const countries = getWorldCountries()
    const lifeSamples = getLifeSamples()
    
    // 国家数据映射
    const seriesData = countries.map(region => ({
      name: getCountryMapName(region),
      value: region.tangpingIndex,
      regionData: region
    }))

    // 生活样本数据映射
    const sampleData = lifeSamples.map(sample => ({
      name: sample.sharerProfile.nickname,
      value: [
        sample.location.coordinates[0], // 经度
        sample.location.coordinates[1], // 纬度
        sample.qualityScore || 70      // 质量评分作为点的大小
      ],
      sample: sample
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
          // 如果是生活样本点
          if (params.data?.sample) {
            const sample = params.data.sample
            return `
              <div style="padding: 12px; line-height: 1.6; max-width: 300px;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #4ade80;">
                  👤 ${sample.sharerProfile.nickname}
                </div>
                <div style="color: #60a5fa; font-size: 12px; margin-bottom: 2px;">
                  📍 ${sample.location.districtName}, ${sample.location.cityName}
                </div>
                <div style="color: #f87171; font-size: 12px; margin-bottom: 2px;">
                  💼 ${sample.sharerProfile.profession} (${sample.sharerProfile.workMode === 'remote' ? '远程' : sample.sharerProfile.workMode === 'hybrid' ? '混合' : '现场'})
                </div>
                <div style="color: #a78bfa; font-size: 12px; margin-bottom: 2px;">
                  💰 月支出: ${sample.monthlyBudget.totalMonthly.toLocaleString()} ${sample.monthlyBudget.currency}
                </div>
                <div style="color: #fbbf24; font-size: 12px; margin-bottom: 4px;">
                  ⭐ 质量评分: ${sample.qualityScore}/100
                </div>
                <div style="color: #94a3b8; font-size: 11px; font-style: italic;">
                  "${sample.coreAdvice.mainAdvice.substring(0, 50)}..."
                </div>
                <div style="color: #10b981; font-size: 10px; margin-top: 4px;">
                  点击查看详细信息 →
                </div>
              </div>
            `
          }
          
          // 如果是国家数据
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
        // 地图底图层
        {
          name: '躺平指数',
          type: 'map',
          map: 'world',
          roam: true,
          scaleLimit: {
            min: 1,
            max: 8
          },
          center: [0, 10], // 调整地图中心
          zoom: 1.2, // 初始缩放
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
          select: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              color: '#fff'
            },
            itemStyle: {
              areaColor: '#42a5f5',
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          itemStyle: {
            borderColor: '#333',
            borderWidth: 0.5,
            areaColor: '#404040'
          },
          data: seriesData
        },
        // 生活样本点层
        {
          name: '生活样本',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: (value: number[]) => {
            // 根据质量评分调整点的大小
            const score = value[2] || 70
            return Math.max(8, Math.min(20, score / 5))
          },
          itemStyle: {
            color: '#4ade80',
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(74, 222, 128, 0.5)'
          },
          emphasis: {
            itemStyle: {
              color: '#10b981',
              borderColor: '#ffffff',
              borderWidth: 3,
              shadowBlur: 15,
              shadowColor: 'rgba(16, 185, 129, 0.8)'
            },
            symbolSize: (value: number[]) => {
              const score = value[2] || 70
              return Math.max(12, Math.min(25, score / 4))
            }
          },
          data: sampleData,
          zlevel: 2 // 确保点在地图上方
        }
      ],
      // 添加地理坐标系配置
      geo: {
        map: 'world',
        roam: true,
        scaleLimit: {
          min: 1,
          max: 8
        },
        center: [0, 10],
        zoom: 1.2,
        silent: true, // 地理坐标系不响应鼠标事件
        itemStyle: {
          color: 'transparent',
          borderColor: 'transparent'
        }
      }
    }
  }

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
      const mapData = await loadWorldMapData()
      
      if (mapData || true) { // 即使没有加载到数据也尝试渲染
        // 设置图表选项
        const option = getMapOption()
        chartInstance.current.setOption(option)

        // 绑定事件
        chartInstance.current.on('click', (params: any) => {
          // 处理生活样本点击
          if (params.data?.sample) {
            const sampleId = params.data.sample.id
            onSampleClick?.(sampleId)
            return
          }
          
          // 处理国家点击
          if (params.data?.regionData) {
            const regionId = params.data.regionData.id
            onRegionClick?.(regionId)
          }
        })

        chartInstance.current.on('mouseover', (params: any) => {
          // 处理生活样本悬停
          if (params.data?.sample) {
            // 可以添加生活样本的悬停逻辑
            return
          }
          
          // 处理国家悬停
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
      }
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
  }, [])

  // 更新数据
  useEffect(() => {
    if (chartInstance.current) {
      const option = getMapOption()
      chartInstance.current.setOption(option, true)
    }
  }, [regionsData, language])

  return (
    <div className={`relative ${className}`}>
      <div ref={chartRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white text-lg">加载地图中...</span>
          </div>
        </div>
      )}
    </div>
  )
} 