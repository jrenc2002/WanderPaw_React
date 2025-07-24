import React, { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import type { MapPoint, MapRoute } from '@/data/mapData'
import { defaultRouteStyle } from '@/data/mapData'

// 高德地图类型声明
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
    gsap: any
    playInfoWindowAnimation: (containerId: string) => void
  }
}

interface AmapMapProps {
  onRegionClick?: (regionId: string, data?: any) => void
  onRegionHover?: (regionId: string | null, data?: any) => void
  onRouteClick?: (routeId: string, data?: any) => void
  className?: string
  center?: [number, number]
  zoom?: number
  points?: MapPoint[]
  routes?: MapRoute[]
}

export const AmapMap: React.FC<AmapMapProps> = ({
  onRegionClick,
  onRegionHover,
  onRouteClick,
  className = "w-full h-full",
  center = [39.9042, 116.4074], // 默认北京
  zoom = 5,
  points = [],
  routes = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylinesRef = useRef<any[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [language] = useAtom(selectedLanguageAtom)
  


  // 设置全局动画函数
  const setupGlobalAnimationFunction = () => {
    // 全局函数，用于重播动画
    window.playInfoWindowAnimation = function(containerId: string) {
      console.log('playInfoWindowAnimation被调用，容器ID:', containerId);
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('找不到容器元素:', containerId);
        return;
      }
      console.log('找到容器元素:', container);
      
      const cards = container.querySelectorAll('.photo-card');
      console.log('找到卡片数量:', cards.length);
      if (cards.length === 0) {
        console.warn('没有找到photo-card元素');
        return;
      }
      
      // 确保 gsap 存在
      if (typeof window.gsap === 'undefined') {
        console.warn('GSAP not available for InfoWindow animation');
        return;
      }
      console.log('GSAP可用，开始动画');
      
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
      console.log('初始状态设置完成');
      
      // 然后播放动画
      window.gsap.to(cards, {
        scale: 1,
        stagger: 0.08,
        ease: "elastic.out(1, 0.8)",
        delay: 0.2,
        duration: 0.6,
        onComplete: function() {
          console.log('动画播放完成');
        }
      });
      console.log('动画已启动');
    };
  }

  // 生成微妙弯曲路径的函数 - 一丢丢自然弯曲 🌿
  const generateCurvedPath = (
    waypoints: Array<{position: [number, number], name?: string}>, 
    curveConfig?: MapRoute['curveStyle']
  ) => {
    if (waypoints.length < 2) return waypoints.map(w => [w.position[1], w.position[0]])
    
    // 如果禁用弯曲，返回直线
    if (curveConfig?.enabled === false) {
      return waypoints.map(w => [w.position[1], w.position[0]])
    }
    
    // 🌿 简单的弯曲参数 - 微妙自然
    const intensity = curveConfig?.intensity ?? 0.3  // 弯曲强度，默认很小
    
    const curvedPath: [number, number][] = []
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]
      
      // 起始点
      curvedPath.push([start.position[1], start.position[0]])
      
      // 计算两点间的距离和方向
      const startLng = start.position[1]
      const startLat = start.position[0]
      const endLng = end.position[1]
      const endLat = end.position[0]
      
      const deltaLng = endLng - startLng
      const deltaLat = endLat - startLat
      const distance = Math.sqrt(deltaLng * deltaLng + deltaLat * deltaLat)
      
      // 🌿 微妙的弯曲参数 - 只有一丢丢
      const curveFactor = Math.min(distance * 0.15 * intensity, 1.5 * intensity)
      
      // 计算垂直方向的偏移向量
      const perpLng = -deltaLat
      const perpLat = deltaLng
      const perpLength = Math.sqrt(perpLng * perpLng + perpLat * perpLat)
      
      if (perpLength > 0) {
        // 标准化垂直向量
        const normalizedPerpLng = (perpLng / perpLength) * curveFactor
        const normalizedPerpLat = (perpLat / perpLength) * curveFactor
        
        // 🎯 适度分段
        const segments = Math.max(6, Math.floor(distance * 8))
        
        for (let j = 1; j < segments; j++) {
          const t = j / segments
          
          // 基础线性插值
          const baseLng = startLng + deltaLng * t
          const baseLat = startLat + deltaLat * t
          
          // 🌿 简单自然的弧形 - 只是微妙的弯曲
          const curveIntensity = Math.sin(t * Math.PI) * (1 - Math.pow(Math.abs(t - 0.5) * 2, 3))
          
          // 应用轻微弯曲
          const curvedLng = baseLng + normalizedPerpLng * curveIntensity
          const curvedLat = baseLat + normalizedPerpLat * curveIntensity
          
          curvedPath.push([curvedLng, curvedLat])
        }
      }
    }
    
    // 添加最后一个点
    const lastPoint = waypoints[waypoints.length - 1]
    curvedPath.push([lastPoint.position[1], lastPoint.position[0]])
    
    return curvedPath
  }

  // 加载高德地图
  useEffect(() => {
    const loadAMap = () => {
      // 设置安全密钥
      window._AMapSecurityConfig = {
        securityJSCode: '3fbcccdd17deb2d05f4c92255d448879'
      }

      // 确保 GSAP 全局可用并定义动画函数
      if (typeof window.gsap === 'undefined') {
        import('gsap').then((gsapModule) => {
          window.gsap = gsapModule.gsap
          setupGlobalAnimationFunction()
          loadMapScript()
        })
      } else {
        setupGlobalAnimationFunction()
        loadMapScript()
      }
    }

    const loadMapScript = () => {
      if (window.AMap) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://webapi.amap.com/maps?v=2.0&key=04475e3e2f3f06596d30bc50a740678d`
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
        mapStyle: 'amap://styles/fresh', // 固定使用草色青样式
        features: ['bg', 'point', 'road', 'building'], // 显示地图要素
        showLabel: true // 显示地名标注
      })

      mapInstanceRef.current = map
      setIsMapLoaded(true)

      // 确保动画函数已定义
      setupGlobalAnimationFunction()

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

  // 创建自定义标记
  const createCustomMarker = (point: MapPoint) => {
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
    marker.on('click', (e: any) => {
      // 阻止事件冒泡到地图
      e.stopPropagation && e.stopPropagation()
      
      console.log('标点被点击:', point.title)
      
      onRegionClick?.(point.id, point.data)
      
      try {
        // 生成唯一ID，确保内容和外部调用使用相同ID
        const uniqueId = 'infowindow-' + point.id + '-' + Date.now()
        
        // 创建信息窗体
        const infoWindowContent = createPointInfoWindowContent(point, uniqueId)
        console.log('InfoWindow内容已创建，长度:', infoWindowContent.length, 'ID:', uniqueId)
        
        const infoWindow = new window.AMap.InfoWindow({
          isCustom: true,
          content: infoWindowContent,
          offset: new window.AMap.Pixel(0, -size-8)
        })
        
        console.log('InfoWindow已创建，准备打开')
        infoWindow.open(mapInstanceRef.current, marker.getPosition())
        console.log('InfoWindow已打开')
        
        // 在InfoWindow打开后直接调用动画
        setTimeout(() => {
          console.log('外部调用动画，容器ID:', uniqueId)
          if (window.playInfoWindowAnimation) {
            window.playInfoWindowAnimation(uniqueId)
          } else {
            console.error('playInfoWindowAnimation函数不存在')
          }
        }, 300)
        
        // 多次尝试确保成功
        setTimeout(() => {
          if (window.playInfoWindowAnimation) {
            window.playInfoWindowAnimation(uniqueId)
          }
        }, 600)
      } catch (error) {
        console.error('创建或打开InfoWindow时出错:', error)
      }
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

  // 创建路线 - 微妙弯曲版本 🌿
  const createPolyline = (route: MapRoute) => {
    const style = { ...defaultRouteStyle, ...route.style }
    
    // 生成微妙的弯曲路径
    const path = generateCurvedPath(route.waypoints, route.curveStyle)

    // 🌿 创建简洁的主路线
    const polyline = new window.AMap.Polyline({
      path: path,
      strokeColor: style.color,
      strokeWeight: style.weight || 4,
      strokeOpacity: style.opacity,
      strokeStyle: style.dashArray ? 'dashed' : 'solid',
      strokeDasharray: style.dashArray ? style.dashArray.split(',').map(Number) : undefined,
      lineJoin: 'round', // 圆润连接
      lineCap: 'round',  // 圆润端点
      cursor: 'pointer'
    })

    // 添加路线点击事件
    polyline.on('click', (e: any) => {
      onRouteClick?.(route.id, route)
      
      // 创建路线信息窗体
      const infoWindow = new window.AMap.InfoWindow({
        isCustom: true,
        content: createRouteInfoWindowContent(route),
        position: e.lnglat
      })
      
      infoWindow.open(mapInstanceRef.current, e.lnglat)
    })

    // 🌿 添加简洁的路线悬停效果
    polyline.on('mouseover', () => {
      polyline.setOptions({
        strokeWeight: (style.weight || 4) + 2,
        strokeOpacity: Math.min((style.opacity || 0.8) + 0.2, 1)
      })
    })

    polyline.on('mouseout', () => {
      polyline.setOptions({
        strokeWeight: style.weight || 4,
        strokeOpacity: style.opacity
      })
    })

    return polyline
  }

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

        <!-- 箭头指示器 -->
        <div style="
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        "></div>
      </div>
      
      <script>
        // 自动播放动画，确保DOM完全渲染
        function startAnimation() {
          if (window.playInfoWindowAnimation) {
            console.log('尝试播放动画，容器ID:', '${containerId}');
            window.playInfoWindowAnimation('${containerId}');
          } else {
            console.warn('playInfoWindowAnimation函数不存在');
          }
        }
        
        // 多重延迟确保DOM渲染完成
        setTimeout(startAnimation, 200);
        setTimeout(startAnimation, 500);
        
        // 使用MutationObserver确保DOM完全加载
        if (typeof MutationObserver !== 'undefined') {
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type === 'childList' && document.getElementById('${containerId}')) {
                setTimeout(startAnimation, 100);
                observer.disconnect();
              }
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      </script>
    `
  }

  // 创建路线信息窗体内容
  const createRouteInfoWindowContent = (route: MapRoute) => {
    const getTravelModeIcon = (mode?: string) => {
      switch (mode) {
        case 'driving': return '🚗'
        case 'walking': return '🚶'
        case 'transit': return '🚊'
        case 'bicycling': return '🚴'
        default: return '🛣️'
      }
    }

    return `
      <div class="p-3 max-w-sm bg-white rounded-lg shadow-lg">
        <h3 class="font-bold text-lg mb-2 text-gray-800 flex items-center gap-2">
          ${getTravelModeIcon(route.travelMode)}
          ${route.name}
        </h3>
        <div class="space-y-2">
          ${route.description ? `<p class="text-sm text-gray-600">${route.description}</p>` : ''}
          <div class="text-xs text-gray-500">
            <div class="font-medium mb-1">${language === 'zh' ? '途经站点' : 'Waypoints'}:</div>
            <div class="space-y-1">
              ${route.waypoints.map((waypoint, index) => `
                <div class="flex items-center gap-1">
                  <span class="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">${index + 1}</span>
                  <span>${waypoint.name || `${language === 'zh' ? '站点' : 'Point'} ${index + 1}`}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ${route.travelMode ? `
            <div class="text-xs text-gray-500">
              ${language === 'zh' ? '交通方式' : 'Travel Mode'}: ${route.travelMode}
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

  // 更新路线 - 支持微妙弯曲线条 🌿
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return

    // 清除旧路线
    polylinesRef.current.forEach(polyline => {
      mapInstanceRef.current.remove(polyline)
    })
    polylinesRef.current = []

    // 添加新的微妙弯曲路线
    routes.forEach(route => {
      const polyline = createPolyline(route)
      mapInstanceRef.current.add(polyline)
      polylinesRef.current.push(polyline)
    })
  }, [routes, isMapLoaded, language])

  // 更新地图中心和缩放
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return
    
    mapInstanceRef.current.setZoomAndCenter(zoom, [center[1], center[0]])
  }, [center, zoom, isMapLoaded])

  return (
    <div className={`${className} relative`}>
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