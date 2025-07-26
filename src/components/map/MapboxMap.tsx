import React, { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import type { MapPoint, MapRoute } from '@/data/mapData'
import { defaultRouteStyle } from '@/data/mapData'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// 全局类型声明
declare global {
  interface Window {
    gsap: any
    playInfoWindowAnimation: (containerId: string) => void
  }
}

// 颜色亮度调整函数
const adjustColorBrightness = (hex: string, factor: number): string => {
  // 移除 # 符号
  const color = hex.replace('#', '')
  
  // 将十六进制转换为 RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // 调整亮度
  const newR = Math.min(255, Math.floor(r * factor))
  const newG = Math.min(255, Math.floor(g * factor))
  const newB = Math.min(255, Math.floor(b * factor))
  
  // 转换回十六进制
  const newColor = ((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')
  return `#${newColor}`
}

// Mapbox access token - 你需要在 Mapbox 官网注册获取
// 请替换为你的 PUBLIC TOKEN (以 pk. 开头)
mapboxgl.accessToken = 'pk.eyJ1IjoieHVuaXh3d2kiLCJhIjoiY21kOW92ODUyMGE1aDJscTNuaW55eWNocyJ9.sqfV_Ukyc6u9jgWeq3vukQ'

interface MapboxMapProps {
  onRegionClick?: (regionId: string, data?: any) => void
  onRegionHover?: (regionId: string | null, data?: any) => void
  onRouteClick?: (routeId: string, data?: any) => void
  className?: string
  center?: [number, number]
  zoom?: number
  points?: MapPoint[]
  routes?: MapRoute[]
  disableZoom?: boolean
  disableInteraction?: boolean
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  onRegionClick,
  onRegionHover,
  onRouteClick,
  className = "w-full h-full",
  center = [39.9042, 116.4074], // 默认北京
  zoom = 5,
  points = [],
  routes = [],
  disableZoom = false,
  disableInteraction = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [language] = useAtom(selectedLanguageAtom)

  // 设置全局动画函数 (保持与原来的兼容)
  const setupGlobalAnimationFunction = () => {
    window.playInfoWindowAnimation = function(containerId: string) {
      console.log('playInfoWindowAnimation被调用，容器ID:', containerId);
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('找不到容器元素:', containerId);
        return;
      }
      
      const cards = container.querySelectorAll('.photo-card');
      if (cards.length === 0) {
        console.warn('没有找到photo-card元素');
        return;
      }
      
      if (typeof window.gsap === 'undefined') {
        console.warn('GSAP not available for InfoWindow animation');
        return;
      }
      
      // 先设置初始状态
      window.gsap.set(cards, {
        scale: 0,
        rotation: function(index: number) {
          const rotations = [8, -5, 3];
          return rotations[index] || 0;
        },
        x: function(index: number) {
          const gap = 50;
          const positions = [-gap, 0, gap];
          return positions[index] || 0;
        },
        y: 0
      });
      
      // 然后播放动画
      window.gsap.to(cards, {
        scale: 1,
        stagger: 0.08,
        ease: "elastic.out(1, 0.8)",
        delay: 0.2,
        duration: 0.6
      });
    };
  }

  // 初始化地图
  useEffect(() => {
    if (map.current) return // 已初始化

    // 确保 GSAP 全局可用并定义动画函数
    if (typeof window.gsap === 'undefined') {
      import('gsap').then((gsapModule) => {
        window.gsap = gsapModule.gsap
        setupGlobalAnimationFunction()
      })
    } else {
      setupGlobalAnimationFunction()
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12', // 使用街道样式
      center: [center[1], center[0]], // Mapbox 使用 [lng, lat] 格式
      zoom: zoom,
      language: language === 'zh' ? 'zh-Hans' : 'en',
      interactive: !disableInteraction,
      scrollZoom: !disableZoom && !disableInteraction,
      doubleClickZoom: !disableZoom && !disableInteraction,
      touchZoomRotate: !disableZoom && !disableInteraction,
      dragPan: !disableInteraction,
      keyboard: !disableInteraction
    })

    map.current.on('load', () => {
      setIsMapLoaded(true)
    })

    // 地图点击事件
    map.current.on('click', (e) => {
      console.log('地图点击:', e.lngLat.lng, e.lngLat.lat)
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  // 更新地图中心和缩放
  useEffect(() => {
    if (!map.current || !isMapLoaded) return
    
    map.current.setCenter([center[1], center[0]])
    map.current.setZoom(zoom)
  }, [center, zoom, isMapLoaded])

  // 根据城市生成相关图片URL（用于信息窗体）
  const getCityImages = (cityId: string) => {
    const imageMap: Record<string, string[]> = {
      beijing: [
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=200&auto=format&fit=crop'
      ],
      shanghai: [
        'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1537986904618-27d0e2b52eb4?q=80&w=200&auto=format&fit=crop'
      ],
      shenzhen: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=200&auto=format&fit=crop'
      ],
      chengdu: [
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=200&auto=format&fit=crop'
      ]
    }
    
    return imageMap[cityId] || [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=200&auto=format&fit=crop'
    ]
  }

  // 创建点信息窗体内容
  const createPointInfoWindowContent = (point: MapPoint, uniqueId?: string) => {
    const images = getCityImages(point.id)
    const containerId = uniqueId || 'infowindow-' + point.id + '-' + Date.now()
    
    return `
      <div class="map-point-card" style="min-width: min(300px, 85vw); max-width: min(340px, 90vw);">
        <div class="map-card-close" onclick="this.closest('.mapboxgl-popup').remove()" style="color: #687949;">
          ✕
        </div>
        
        <div class="map-card-photos" id="${containerId}">
          ${images.map((image, index) => `
            <div class="photo-card" style="position: absolute; width: 70px; aspect-ratio: 1; border: 3px solid #FEFDF9; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(104, 121, 73, 0.15); left: 50%; top: 50%; margin-left: -35px; margin-top: -35px; transform-origin: center center;">
              <img 
                src="${image}" 
                alt="城市照片 ${index + 1}"
                class="map-photo-image"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
          `).join('')}
        </div>
        
        <div class="map-card-info">
          <h3 class="map-card-title" style="color: #687949; font-weight: 700;">${point.title}</h3>
          <p class="map-card-description" style="color: #8F6C53;">${point.description}</p>
          
          <div class="map-card-details">
            <div class="map-detail-item">
              <span class="detail-icon" style="color: #B1C192;">💰</span>
              <span class="detail-label" style="color: #8F6C53;">平均薪资</span>
              <span class="detail-value" style="color: #687949; font-weight: 600;">${point.data?.averageSalary?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="map-detail-item">
              <span class="detail-icon" style="color: #B1C192;">🏠</span>
              <span class="detail-label" style="color: #8F6C53;">房租</span>
              <span class="detail-value" style="color: #687949; font-weight: 600;">${point.data?.rentPrice?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="map-detail-item">
              <span class="detail-icon" style="color: #B1C192;">📊</span>
              <span class="detail-label" style="color: #8F6C53;">宠物友好度</span>
              <span class="detail-value" style="color: #687949; font-weight: 600;">${Math.round(point.petFriendlyIndex)}</span>
            </div>
          </div>
          
          <button class="map-replay-btn" onclick="if(window.playInfoWindowAnimation) window.playInfoWindowAnimation('${containerId}')" style="background: linear-gradient(135deg, rgba(177, 193, 146, 0.12) 0%, rgba(199, 170, 108, 0.08) 100%); border: 1px solid rgba(177, 193, 146, 0.3); color: #687949;">
            <span style="font-size: 14px;">🔄</span>
            重播动画
          </button>
        </div>
      </div>`
  }

  // 创建自定义标记
  const createCustomMarker = (point: MapPoint) => {
    // 使用 WanderPaw 主题色彩的宠物友好度颜色方案
    const color = point.petFriendlyIndex >= 80 ? '#687949' :  // forest - 深绿色（最佳）
                  point.petFriendlyIndex >= 60 ? '#B1C192' :  // sage - 浅绿色（良好）
                  point.petFriendlyIndex >= 40 ? '#C7AA6C' :  // gold - 金黄色（一般）
                  point.petFriendlyIndex >= 20 ? '#BBA084' :  // sand - 浅棕色（较差）
                  '#8F6C53'                                // earth - 深棕色（最差）
    
    const size = point.petFriendlyIndex >= 70 ? 46 : 
                 point.petFriendlyIndex >= 50 ? 42 : 
                 point.petFriendlyIndex >= 30 ? 38 : 34

    // 创建自定义标记元素
    const el = document.createElement('div')
    el.innerHTML = `
      <div class="relative">
        <div class="rounded-full border-3 shadow-lg flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 cursor-pointer" 
             style="background: linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(color, 0.8)} 100%); 
                    border: 3px solid #FEFDF9; 
                    width: ${size}px; 
                    height: ${size}px; 
                    box-shadow: 0 4px 16px ${color}40, 0 2px 8px rgba(0,0,0,0.1);">
          <div class="flex flex-col items-center justify-center">
            <span style="font-size: 14px; font-weight: 700; line-height: 1.2; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${Math.round(point.petFriendlyIndex)}</span>
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0" 
             style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"></div>
      </div>
    `
    el.className = 'marker'

    const marker = new mapboxgl.Marker(el)
      .setLngLat([point.position[1], point.position[0]])

    // 添加点击事件
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      
      console.log('标点被点击:', point.title)
      onRegionClick?.(point.id, point.data)
      
      // 创建信息窗体
      const uniqueId = 'infowindow-' + point.id + '-' + Date.now()
      const popupContent = createPointInfoWindowContent(point, uniqueId)
      
      new mapboxgl.Popup({
        offset: [0, -size-8],
        className: 'custom-popup'
      })
        .setHTML(popupContent)
        .setLngLat([point.position[1], point.position[0]])
        .addTo(map.current!)

      // 播放动画
      setTimeout(() => {
        if (window.playInfoWindowAnimation) {
          window.playInfoWindowAnimation(uniqueId)
        }
      }, 300)
    })

    // 添加悬停事件
    el.addEventListener('mouseenter', () => {
      onRegionHover?.(point.id, point.data)
    })

    el.addEventListener('mouseleave', () => {
      onRegionHover?.(null)
    })

    return marker
  }

  // 生成弯曲路径的函数
  const generateCurvedPath = (
    waypoints: Array<{position: [number, number], name?: string}>, 
    curveConfig?: MapRoute['curveStyle']
  ) => {
    if (waypoints.length < 2) return waypoints.map(w => [w.position[1], w.position[0]])
    
    if (curveConfig?.enabled === false) {
      return waypoints.map(w => [w.position[1], w.position[0]])
    }
    
    const intensity = curveConfig?.intensity ?? 0.3
    const curvedPath: [number, number][] = []
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]
      
      curvedPath.push([start.position[1], start.position[0]])
      
      const startLng = start.position[1]
      const startLat = start.position[0]
      const endLng = end.position[1]
      const endLat = end.position[0]
      
      const deltaLng = endLng - startLng
      const deltaLat = endLat - startLat
      const distance = Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat)
      
      const curveFactor = Math.min(distance * 0.15 * intensity, 1.5 * intensity)
      
      const perpLng = -deltaLat
      const perpLat = deltaLng
      const perpLength = Math.sqrt(perpLng * perpLng + perpLat * perpLat)
      
      if (perpLength > 0) {
        const normalizedPerpLng = (perpLng / perpLength) * curveFactor
        const normalizedPerpLat = (perpLat / perpLength) * curveFactor
        
        const segments = Math.max(6, Math.floor(distance * 8))
        
        for (let j = 1; j < segments; j++) {
          const t = j / segments
          
          const baseLng = startLng + deltaLng * t
          const baseLat = startLat + deltaLat * t
          
          const curveIntensity = Math.sin(t * Math.PI) * (1 - Math.pow(Math.abs(t - 0.5) * 2, 3))
          
          const curvedLng = baseLng + normalizedPerpLng * curveIntensity
          const curvedLat = baseLat + normalizedPerpLat * curveIntensity
          
          curvedPath.push([curvedLng, curvedLat])
        }
      }
    }
    
    const lastPoint = waypoints[waypoints.length - 1]
    curvedPath.push([lastPoint.position[1], lastPoint.position[0]])
    
    return curvedPath
  }

  // 更新标记点
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // 清除旧标记
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // 添加新标记
    points.forEach(point => {
      const marker = createCustomMarker(point)
      marker.addTo(map.current!)
      markersRef.current.push(marker)
    })
  }, [points, isMapLoaded, language])

  // 更新路线
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // 清除旧路线
    routes.forEach((_route, index) => {
      const sourceId = `route-${index}`
      const layerId = `route-${index}-layer`
      
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId)
      }
      if (map.current!.getSource(sourceId)) {
        map.current!.removeSource(sourceId)
      }
    })

    // 添加新路线
    routes.forEach((route, index) => {
      const style = { ...defaultRouteStyle, ...route.style }
      const path = generateCurvedPath(route.waypoints, route.curveStyle)
      
      const sourceId = `route-${index}`
      const layerId = `route-${index}-layer`

      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: path
          }
        }
      })

      map.current!.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': style.color || '#B1C192',  // 使用 WanderPaw sage 色调
          'line-width': style.weight || 4,
          'line-opacity': style.opacity || 0.8
        }
      })

      // 添加路线点击事件
      map.current!.on('click', layerId, (e) => {
        onRouteClick?.(route.id, route)
        
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-3 max-w-sm rounded-lg shadow-lg" style="background: linear-gradient(145deg, #FEFDF9 0%, #F9F2E2 100%); border: 2px solid #F0F3EA;">
              <h3 class="font-bold text-lg mb-2" style="color: #687949;">${route.name}</h3>
              ${route.description ? `<p class="text-sm" style="color: #8F6C53;">${route.description}</p>` : ''}
            </div>
          `)
          .addTo(map.current!)
      })

      // 更改鼠标样式
      map.current!.on('mouseenter', layerId, () => {
        map.current!.getCanvas().style.cursor = 'pointer'
      })

      map.current!.on('mouseleave', layerId, () => {
        map.current!.getCanvas().style.cursor = ''
      })
    })
  }, [routes, isMapLoaded, language])

  return (
    <div className={`${className} relative`}>
      <div
        ref={mapContainer}
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