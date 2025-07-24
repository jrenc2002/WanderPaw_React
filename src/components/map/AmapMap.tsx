import React, { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

// 高德地图类型声明
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
  }
}

interface InteractivePoint {
  id: string
  position: [number, number] // [lat, lng]
  title: string
  description: string
  tangpingIndex: number
  data?: any
}

interface AmapMapProps {
  onRegionClick?: (regionId: string, data?: any) => void
  onRegionHover?: (regionId: string | null, data?: any) => void
  className?: string
  center?: [number, number]
  zoom?: number
  points?: InteractivePoint[]
  mapStyle?: 'standard' | 'satellite' | 'terrain' | 'light' | 'fresh'
}

export const AmapMap: React.FC<AmapMapProps> = ({
  onRegionClick,
  onRegionHover,
  className = "w-full h-full",
  center = [39.9042, 116.4074], // 默认北京
  zoom = 5,
  points = [],
  mapStyle = 'fresh'
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [language] = useAtom(selectedLanguageAtom)

  // 加载高德地图
  useEffect(() => {
    const loadAMap = () => {
      // 设置安全密钥
      window._AMapSecurityConfig = {
        securityJSCode: '3fbcccdd17deb2d05f4c92255d448879'
      }

      if (window.AMap) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://webapi.amap.com/maps?v=2.0&key=04475e3e2f3f06596d30bc50a740678d&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar,AMap.MapType`
      script.onload = () => {
        initMap()
      }
      document.head.appendChild(script)
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      // 创建地图实例
      const map = new window.AMap.Map(mapRef.current, {
        zoom: zoom,
        center: [center[1], center[0]], // 高德地图使用 [lng, lat]
        viewMode: '2D',
        lang: language === 'zh' ? 'zh_cn' : 'en',
        mapStyle: getMapStyle(mapStyle),
        features: ['bg', 'point', 'road', 'building'], // 显示地图要素
        showLabel: true // 显示地名标注
      })

      // 添加控件
      map.addControl(new window.AMap.Scale())
      map.addControl(new window.AMap.ToolBar({
        position: {
          bottom: '40px',
          right: '40px'
        }
      }))

      mapInstanceRef.current = map
      setIsMapLoaded(true)

      // 地图点击事件
      map.on('click', (e: any) => {
        console.log('地图点击:', e.lnglat.getLng(), e.lnglat.getLat())
      })
    }

    loadAMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // 获取地图样式
  const getMapStyle = (style: string) => {
    switch (style) {
      case 'satellite':
        return 'amap://styles/satellite'
      case 'terrain':
        return 'amap://styles/normal'
      case 'light':
        return 'amap://styles/light'
      case 'fresh':
        return 'amap://styles/fresh'
      default:
        return 'amap://styles/fresh'
    }
  }

  // 创建自定义标记
  const createCustomMarker = (point: InteractivePoint) => {
    const color = point.tangpingIndex >= 80 ? '#10b981' : 
                  point.tangpingIndex >= 60 ? '#f59e0b' : 
                  point.tangpingIndex >= 40 ? '#f97316' : '#ef4444'
    
    const size = point.tangpingIndex >= 70 ? 46 : 
                 point.tangpingIndex >= 50 ? 42 : 
                 point.tangpingIndex >= 30 ? 38 : 34

    const content = `
      <div class="relative">
        <div class="rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 cursor-pointer" 
             style="background-color: ${color}; width: ${size}px; height: ${size}px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
          <div class="flex flex-col items-center justify-center">
            <span style="font-size: 14px; font-weight: 700; line-height: 1.2;">${Math.round(point.tangpingIndex)}</span>
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0" 
             style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color};"></div>
      </div>
    `

    const marker = new window.AMap.Marker({
      position: [point.position[1], point.position[0]], // [lng, lat]
      content: content,
      offset: new window.AMap.Pixel(-size/2, -size-8)
    })

    // 添加点击事件
    marker.on('click', () => {
      onRegionClick?.(point.id, point.data)
      
      // 创建信息窗体
      const infoWindow = new window.AMap.InfoWindow({
        isCustom: true,
        content: createInfoWindowContent(point),
        offset: new window.AMap.Pixel(0, -size-8)
      })
      
      infoWindow.open(mapInstanceRef.current, marker.getPosition())
    })

    // 添加悬停事件
    marker.on('mouseover', () => {
      onRegionHover?.(point.id, point.data)
    })

    marker.on('mouseout', () => {
      onRegionHover?.(null)
    })

    return marker
  }

  // 创建信息窗体内容
  const createInfoWindowContent = (point: InteractivePoint) => {
    return `
      <div class="p-3 max-w-xs bg-white rounded-lg shadow-lg">
        <h3 class="font-bold text-lg mb-2 text-gray-800">${point.title}</h3>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏠</span>
            <span class="text-sm">
              ${language === 'zh' ? '躺平指数' : 'Lying Flat Index'}: 
              <span class="font-semibold ml-1">${point.tangpingIndex}</span>
            </span>
          </div>
          <p class="text-sm text-gray-600">${point.description}</p>
          ${point.data ? `
            <div class="text-xs text-gray-500 space-y-1">
              ${point.data.averageSalary ? `<div>💰 ${language === 'zh' ? '平均工资' : 'Average Salary'}: ${point.data.averageSalary.toLocaleString()} ${point.data.currency}</div>` : ''}
              ${point.data.rentPrice ? `<div>🏡 ${language === 'zh' ? '房租' : 'Rent'}: ${point.data.rentPrice.toLocaleString()} ${point.data.currency}</div>` : ''}
              ${point.data.workLifeBalance ? `<div>⚖️ ${language === 'zh' ? '工作生活平衡' : 'Work-Life Balance'}: ${point.data.workLifeBalance}</div>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `
  }

  // 更新标记点
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return

    // 清除旧标记
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.remove(marker)
    })
    markersRef.current = []

    // 添加新标记
    points.forEach(point => {
      const marker = createCustomMarker(point)
      mapInstanceRef.current.add(marker)
      markersRef.current.push(marker)
    })
  }, [points, isMapLoaded, language])

  // 更新地图中心和缩放
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return
    
    mapInstanceRef.current.setZoomAndCenter(zoom, [center[1], center[0]])
  }, [center, zoom, isMapLoaded])

  // 更新地图样式
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return
    
    mapInstanceRef.current.setMapStyle(getMapStyle(mapStyle))
  }, [mapStyle, isMapLoaded])

  return (
    <div className={className}>
      <div
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden shadow-xl"
      />
      
      {/* 加载提示 */}
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-600">
            {language === 'zh' ? '地图加载中...' : 'Loading map...'}
          </div>
        </div>
      )}
    </div>
  )
} 