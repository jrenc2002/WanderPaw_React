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
      <div class="info-window-container" id="${containerId}" style="
        font-family: 'Inter', sans-serif;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        min-width: 280px;
        max-width: 320px;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      ">
        <!-- 照片卡片区域 -->
        <div class="photo-area" style="
          position: relative;
          height: 100px;
          margin: 15px;
          margin-bottom: 0;
        ">
          ${images.map((imageUrl, index) => `
            <div class="photo-card photo-card-${index}" style="
              position: absolute;
              width: 80px;
              aspect-ratio: 1;
              border: 4px solid #fff;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              left: 50%;
              top: 50%;
              margin-left: -40px;
              margin-top: -40px;
              transform-origin: center center;
              scale: 0;
            ">
              <img src="${imageUrl}" alt="${point.title} ${index + 1}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
              ">
            </div>
          `).join('')}
        </div>

        <!-- 城市信息 -->
        <div style="padding: 15px; padding-top: 10px;">
          <h3 style="
            font-size: 1.3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 5px;
            text-align: center;
          ">${point.title}</h3>
          
          <p style="
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 12px;
            text-align: center;
            line-height: 1.4;
          ">${point.description}</p>
          
          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
              <span style="font-size: 0.9rem; min-width: 18px;">🏠</span>
              <span style="color: #666; flex: 1;">
                ${language === 'zh' ? '躺平指数' : 'Lying Flat Index'}:
              </span>
              <span style="color: ${point.tangpingIndex >= 80 ? '#10b981' : point.tangpingIndex >= 60 ? '#f59e0b' : point.tangpingIndex >= 40 ? '#f97316' : '#ef4444'}; font-weight: 600; margin-left: auto;">
                ${point.tangpingIndex}
              </span>
            </div>
            
            ${point.data && point.data.averageSalary ? `
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                <span style="font-size: 0.9rem; min-width: 18px;">💰</span>
                <span style="color: #666; flex: 1;">
                  ${language === 'zh' ? '平均工资' : 'Avg Salary'}:
                </span>
                <span style="color: #333; font-weight: 600; margin-left: auto;">
                  ${point.data.averageSalary.toLocaleString()} ${point.data.currency}
                </span>
              </div>
            ` : ''}
            
            ${point.data && point.data.rentPrice ? `
              <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem;">
                <span style="font-size: 0.9rem; min-width: 18px;">🏡</span>
                <span style="color: #666; flex: 1;">
                  ${language === 'zh' ? '房租' : 'Rent'}:
                </span>
                <span style="color: #333; font-weight: 600; margin-left: auto;">
                  ${point.data.rentPrice.toLocaleString()} ${point.data.currency}
                </span>
              </div>
            ` : ''}
          </div>

          <!-- 重播按钮 -->
          <button 
            onclick="if(window.playInfoWindowAnimation) window.playInfoWindowAnimation('${containerId}')" 
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 5px;
              padding: 6px 12px;
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 8px;
              color: #3b82f6;
              font-size: 0.75rem;
              cursor: pointer;
              transition: all 0.2s ease;
              width: 100%;
            "
            onmouseover="this.style.background='rgba(59, 130, 246, 0.15)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(59, 130, 246, 0.2)'"
            onmouseout="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 018-8V2.5M20 12a8 8 0 01-8 8v1.5"/>
              <path d="M4 12a8 8 0 008 8v-1.5M20 12a8 8 0 00-8-8V2.5"/>
            </svg>
            <span>${language === 'zh' ? '重播' : 'Replay'}</span>
          </button>
        </div>
      </div>
      
      <script>
        function startAnimation() {
          if (window.playInfoWindowAnimation) {
            window.playInfoWindowAnimation('${containerId}');
          }
        }
        setTimeout(startAnimation, 200);
        setTimeout(startAnimation, 500);
      </script>
    `
  }

  // 创建自定义标记
  const createCustomMarker = (point: MapPoint) => {
    const color = point.tangpingIndex >= 80 ? '#10b981' : 
                  point.tangpingIndex >= 60 ? '#f59e0b' : 
                  point.tangpingIndex >= 40 ? '#f97316' : '#ef4444'
    
    const size = point.tangpingIndex >= 70 ? 46 : 
                 point.tangpingIndex >= 50 ? 42 : 
                 point.tangpingIndex >= 30 ? 38 : 34

    // 创建自定义标记元素
    const el = document.createElement('div')
    el.innerHTML = `
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
          'line-color': style.color || '#3b82f6',
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
            <div class="p-3 max-w-sm bg-white rounded-lg shadow-lg">
              <h3 class="font-bold text-lg mb-2 text-gray-800">${route.name}</h3>
              ${route.description ? `<p class="text-sm text-gray-600">${route.description}</p>` : ''}
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