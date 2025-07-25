import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { MapboxMap } from '@/components/map/MapboxMap'
import { getPointsByZoom, getRoutesByZoom, type MapPoint, type MapRoute } from '@/data/mapData'
import { WarmBg } from '@/components/bg/WarmBg'
import toast from 'react-hot-toast'

const HomeView: React.FC = () => {
  const [language] = useAtom(selectedLanguageAtom)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.0, 110.0]) // 中国中心
  const [mapZoom, setMapZoom] = useState<number>(4)
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([])
  const [mapRoutes, setMapRoutes] = useState<MapRoute[]>([])

  // 根据缩放级别更新点位和路线数据
  useEffect(() => {
    const points = getPointsByZoom(mapZoom)
    const routes = getRoutesByZoom(mapZoom)
    setMapPoints(points)
    setMapRoutes(routes)
  }, [mapZoom])

  const handleRegionClick = (regionId: string, data?: any) => {
    const point = mapPoints.find(p => p.id === regionId)
    if (point) {
      // 显示点击通知
      toast.success(
        `${language === 'zh' ? '已选择' : 'Selected'}: ${point.title}`,
        {
          duration: 1500,
          position: 'top-center',
        }
      )
      
      // 移动地图中心到选中的点
      setMapCenter(point.position)
      setMapZoom(Math.max(mapZoom, 8))
    }
    
    // 保留原有的侧边栏显示逻辑
    setSelectedRegion(regionId)
    setSelectedData(data)
    setSelectedRoute(null) // 清除路线选择
  }

  const handleRegionHover = (regionId: string | null, _data?: any) => {
    // 处理悬停事件
    if (regionId) {
      const point = mapPoints.find(p => p.id === regionId)
      if (point) {
        console.log(`Hovering over: ${point.title}`)
      }
    }
  }

  const handleRouteClick = (routeId: string, data?: any) => {
    setSelectedRoute(routeId)
    setSelectedRegion(null) // 清除点选择
    
    // 显示路线点击通知
    const route = mapRoutes.find(r => r.id === routeId)
    if (route) {
      toast.success(
        `${language === 'zh' ? '已选择路线' : 'Selected Route'}: ${route.name}`,
        {
          duration: 2000,
          position: 'top-center',
        }
      )
      
      // 计算路线的中心点并调整地图视图
      if (route.waypoints.length > 0) {
        const bounds = route.waypoints.reduce(
          (acc, waypoint) => {
            acc.minLat = Math.min(acc.minLat, waypoint.position[0])
            acc.maxLat = Math.max(acc.maxLat, waypoint.position[0])
            acc.minLng = Math.min(acc.minLng, waypoint.position[1])
            acc.maxLng = Math.max(acc.maxLng, waypoint.position[1])
            return acc
          },
          {
            minLat: route.waypoints[0].position[0],
            maxLat: route.waypoints[0].position[0],
            minLng: route.waypoints[0].position[1],
            maxLng: route.waypoints[0].position[1]
          }
        )
        
        const centerLat = (bounds.minLat + bounds.maxLat) / 2
        const centerLng = (bounds.minLng + bounds.maxLng) / 2
        setMapCenter([centerLat, centerLng])
        setMapZoom(Math.max(mapZoom, 6))
      }
    }
  }



  return (
    <WarmBg className="relative w-full h-screen overflow-hidden">
      {/* Mapbox 地图 */}
      <MapboxMap
        onRegionClick={handleRegionClick}
        onRegionHover={handleRegionHover}
        onRouteClick={handleRouteClick}
        className="w-full h-full"
        center={mapCenter}
        zoom={mapZoom}
        points={mapPoints}
        routes={mapRoutes}
      />
      

      
      {/* 地图控制面板 */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
          <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
            <span>🗺️</span>
            {language === 'zh' ? '地图控制' : 'Map Controls'}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{language === 'zh' ? '显示城市' : 'Cities'}: {mapPoints.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛣️</span>
              <span>{language === 'zh' ? '显示路线' : 'Routes'}: {mapRoutes.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔍</span>
              <span>{language === 'zh' ? '缩放级别' : 'Zoom'}: {mapZoom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 选中城市详细信息 */}
      {selectedRegion && selectedData && (
        <div className="absolute top-32 right-8 z-[1000]">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-3 max-w-sm shadow-lg">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
              <span>📍</span>
              {language === 'zh' ? '选中城市详情' : 'Selected City Details'}
            </h3>
            <div className="text-gray-700 text-sm space-y-2">
              <div className="font-medium text-base">
                {mapPoints.find(p => p.id === selectedRegion)?.title}
              </div>
              <div className="flex items-center gap-1">
                <span>🏠</span>
                <span>{language === 'zh' ? '躺平指数' : 'Lying Flat Index'}: </span>
                <span className="font-semibold">{mapPoints.find(p => p.id === selectedRegion)?.tangpingIndex}</span>
              </div>
              {selectedData.averageSalary && (
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span>{language === 'zh' ? '平均工资' : 'Average Salary'}: </span>
                  <span>{selectedData.averageSalary.toLocaleString()} {selectedData.currency}</span>
                </div>
              )}
              {selectedData.rentPrice && (
                <div className="flex items-center gap-1">
                  <span>🏡</span>
                  <span>{language === 'zh' ? '房租' : 'Rent'}: </span>
                  <span>{selectedData.rentPrice.toLocaleString()} {selectedData.currency}</span>
                </div>
              )}
              {selectedData.workLifeBalance && (
                <div className="flex items-center gap-1">
                  <span>⚖️</span>
                  <span>{language === 'zh' ? '工作生活平衡' : 'Work-Life Balance'}: </span>
                  <span>{selectedData.workLifeBalance}</span>
                </div>
              )}
              <button
                onClick={() => setSelectedRegion(null)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 选中路线详细信息 */}
      {selectedRoute && (
        <div className="absolute top-32 right-8 z-[1000]">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-4 py-3 max-w-sm shadow-lg">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
              <span>🛣️</span>
              {language === 'zh' ? '选中路线详情' : 'Selected Route Details'}
            </h3>
            <div className="text-gray-700 text-sm space-y-2">
              {(() => {
                const route = mapRoutes.find(r => r.id === selectedRoute)
                if (!route) return null
                
                const getTravelModeIcon = (mode?: string) => {
                  switch (mode) {
                    case 'driving': return '🚗'
                    case 'walking': return '🚶'
                    case 'transit': return '🚊'
                    case 'bicycling': return '🚴'
                    default: return '🛣️'
                  }
                }
                
                return (
                  <>
                    <div className="font-medium text-base flex items-center gap-2">
                      {getTravelModeIcon(route.travelMode)}
                      {route.name}
                    </div>
                    {route.description && (
                      <p className="text-sm text-gray-600">{route.description}</p>
                    )}
                    <div className="space-y-1">
                      <div className="font-medium text-xs">
                        {language === 'zh' ? '途经站点' : 'Waypoints'}:
                      </div>
                      {route.waypoints.map((waypoint, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span>{waypoint.name || `${language === 'zh' ? '站点' : 'Point'} ${index + 1}`}</span>
                        </div>
                      ))}
                    </div>
                    {route.travelMode && (
                      <div className="text-xs text-gray-500">
                        {language === 'zh' ? '交通方式' : 'Travel Mode'}: {route.travelMode}
                      </div>
                    )}
                  </>
                )
              })()}
              <button
                onClick={() => setSelectedRoute(null)}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors"
              >
                {language === 'zh' ? '关闭' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </WarmBg>
  )
}

export default HomeView
