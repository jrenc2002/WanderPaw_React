import React, { useEffect, useState, useMemo } from 'react'
import { MapboxMap } from './MapboxMap'
import type { MapPoint } from '@/data/mapData'
import type { GeneratedTripActivity } from '@/services/tripPlanningService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Tag, Navigation } from 'lucide-react'

interface TripPlanMapProps {
  activities: GeneratedTripActivity[]
  city?: string
  className?: string
  showActivityList?: boolean
  onActivityClick?: (activity: GeneratedTripActivity) => void
}

/**
 * 旅行计划地图组件
 * 显示旅行活动在地图上的位置点
 */
export const TripPlanMap: React.FC<TripPlanMapProps> = ({
  activities,
  city = '未知城市',
  className = '',
  showActivityList = true,
  onActivityClick
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([116.4074, 39.9042]) // 默认北京
  const [mapZoom, setMapZoom] = useState<number>(12)

  // 将活动转换为地图点位
  const mapPoints: MapPoint[] = useMemo(() => {
    return activities
      .filter(activity => activity.coordinates) // 只显示有坐标的活动
      .map((activity, index) => ({
        id: activity.id,
        position: [activity.coordinates![1], activity.coordinates![0]], // 注意：MapPoint使用 [lat, lng] 格式
        title: activity.title,
        description: activity.description,
        petFriendlyIndex: getPetFriendlyIndex(activity.theme),
        data: {
          time: activity.time,
          theme: activity.theme,
          duration: activity.duration,
          tips: activity.tips,
          order: index + 1
        }
      }))
  }, [activities])

  // 计算地图中心和缩放级别
  useEffect(() => {
    if (mapPoints.length > 0) {
      // 计算所有点的边界
      const lats = mapPoints.map(p => p.position[0])
      const lngs = mapPoints.map(p => p.position[1])
      
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      
      // 计算中心点
      const centerLat = (minLat + maxLat) / 2
      const centerLng = (minLng + maxLng) / 2
      setMapCenter([centerLat, centerLng])
      
      // 根据边界范围计算合适的缩放级别
      const latRange = maxLat - minLat
      const lngRange = maxLng - minLng
      const maxRange = Math.max(latRange, lngRange)
      
      let zoom = 12
      if (maxRange > 0.5) zoom = 8
      else if (maxRange > 0.2) zoom = 10
      else if (maxRange > 0.1) zoom = 11
      else if (maxRange > 0.05) zoom = 12
      else zoom = 13
      
      setMapZoom(zoom)
    }
  }, [mapPoints])

  // 处理地图点击
  const handleMapPointClick = (pointId: string) => {
    setSelectedActivityId(pointId)
    const activity = activities.find(a => a.id === pointId)
    if (activity && onActivityClick) {
      onActivityClick(activity)
    }
  }

  // 处理活动列表项点击
  const handleActivityListClick = (activity: GeneratedTripActivity) => {
    if (activity.coordinates) {
      setSelectedActivityId(activity.id)
      setMapCenter([activity.coordinates[1], activity.coordinates[0]]) // 注意坐标转换
      setMapZoom(14)
    }
    if (onActivityClick) {
      onActivityClick(activity)
    }
  }

  // 根据主题获取宠物友好指数
  const getPetFriendlyIndex = (theme: string): number => {
    const themeMap: Record<string, number> = {
      'pet-friendly': 95,
      'nature': 85,
      'walking': 80,
      'photography': 75,
      'culture': 70,
      'food': 65,
      'shopping': 60,
      'nightlife': 50,
      'adventure': 70,
      'relaxation': 80
    }
    return themeMap[theme] || 70
  }

  // 根据主题获取颜色
  const getThemeColor = (theme: string): string => {
    const themeColors: Record<string, string> = {
      'nature': 'bg-green-100 text-green-800',
      'culture': 'bg-blue-100 text-blue-800',
      'food': 'bg-orange-100 text-orange-800',
      'shopping': 'bg-purple-100 text-purple-800',
      'photography': 'bg-pink-100 text-pink-800',
      'relaxation': 'bg-gray-100 text-gray-800',
      'walking': 'bg-teal-100 text-teal-800',
      'nightlife': 'bg-indigo-100 text-indigo-800',
      'pet-friendly': 'bg-yellow-100 text-yellow-800',
      'interactive': 'bg-red-100 text-red-800',
      'adventure': 'bg-emerald-100 text-emerald-800',
      'vintage': 'bg-amber-100 text-amber-800',
      'surprise': 'bg-violet-100 text-violet-800'
    }
    return themeColors[theme] || 'bg-gray-100 text-gray-800'
  }

  // 统计信息
  const stats = {
    totalActivities: activities.length,
    withCoordinates: mapPoints.length,
    missingCoordinates: activities.length - mapPoints.length
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 地图统计信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-900">{city} 行程地图</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>📍 {stats.withCoordinates} 个位置</span>
          {stats.missingCoordinates > 0 && (
            <span className="text-orange-600">⚠️ {stats.missingCoordinates} 个位置待定位</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 地图区域 */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] overflow-hidden">
            <CardContent className="p-0 h-full">
              {mapPoints.length > 0 ? (
                <MapboxMap
                  center={mapCenter}
                  zoom={mapZoom}
                  points={mapPoints}
                  onRegionClick={handleMapPointClick}
                  className="w-full h-full"
                  mapTheme="default"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">暂无位置信息可显示</p>
                    <p className="text-sm text-gray-400 mt-1">
                      请等待地址解析完成或手动添加坐标
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 活动列表 */}
        {showActivityList && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">活动列表</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {activities.map((activity, index) => (
                <Card 
                  key={activity.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedActivityId === activity.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleActivityListClick(activity)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {/* 序号 */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        activity.coordinates ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      {/* 活动信息 */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {activity.title}
                          </h4>
                          <Badge className={`text-xs ${getThemeColor(activity.theme)}`}>
                            {activity.theme}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className={activity.coordinates ? 'text-green-600' : 'text-orange-600'}>
                              {activity.coordinates ? '已定位' : '待定位'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {activity.description}
                        </p>
                        
                        {/* 标签 */}
                        {activity.tips && activity.tips.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {activity.tips.slice(0, 3).map((tip, tipIndex) => (
                                <Badge 
                                  key={tipIndex}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {tip}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 地图说明 */}
      <Card className="bg-blue-50">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 mt-0.5">
              💡
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">地图使用说明：</p>
              <ul className="text-xs space-y-1">
                <li>• 点击地图上的标记可查看活动详情</li>
                <li>• 点击右侧活动列表可定位到地图位置</li>
                <li>• 蓝色标记表示已成功定位的活动位置</li>
                <li>• 灰色活动表示正在解析地址或位置信息不足</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TripPlanMap 