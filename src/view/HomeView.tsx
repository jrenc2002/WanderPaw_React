import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/GlobalMapState'
import { LeafletMap } from '@/components/map/LeafletMap'
import { getPointsByZoom, type InteractivePoint } from '@/data/leafletMockData'
import toast from 'react-hot-toast'

const HomeView: React.FC = () => {
  const [language] = useAtom(selectedLanguageAtom)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.0, 110.0]) // 中国中心
  const [mapZoom, setMapZoom] = useState<number>(4)
  const [mapPoints, setMapPoints] = useState<InteractivePoint[]>([])
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain' | 'light'>('terrain')

  // 根据缩放级别更新点位数据
  useEffect(() => {
    const points = getPointsByZoom(mapZoom)
    setMapPoints(points)
  }, [mapZoom])

  const handleRegionClick = (regionId: string, data?: any) => {
    setSelectedRegion(regionId)
    setSelectedData(data)
    
    // 显示点击通知
    const point = mapPoints.find(p => p.id === regionId)
    if (point) {
      toast.success(
        `${language === 'zh' ? '已选择' : 'Selected'}: ${point.title}`,
        {
          duration: 2000,
          position: 'top-center',
        }
      )
      
      // 移动地图中心到选中的点
      setMapCenter(point.position)
      setMapZoom(Math.max(mapZoom, 8))
    }
  }

  const handleRegionHover = (regionId: string | null, _data?: any) => {
    // 处理悬停事件
    if (regionId) {
      const point = mapPoints.find(p => p.id === regionId)
      if (point) {
        // 可以在这里添加更多的悬停逻辑
        console.log(`Hovering over: ${point.title}`)
      }
    }
  }

  const handleMapStyleChange = (style: 'standard' | 'satellite' | 'terrain' ) => {
    setMapStyle(style)
    const styleNames = {
      'standard': language === 'zh' ? '标准地图' : 'Standard Map',
      'satellite': language === 'zh' ? '卫星图' : 'Satellite Map',
      'terrain': language === 'zh' ? '地形图' : 'Terrain Map'
    }
    toast.success(
      `${language === 'zh' ? '已切换到' : 'Switched to'} ${styleNames[style]}`,
      {
        duration: 2000,
        position: 'top-center',
      }
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Leaflet地图 */}
      <LeafletMap
        onRegionClick={handleRegionClick}
        onRegionHover={handleRegionHover}
        className="w-full h-full"
        center={mapCenter}
        zoom={mapZoom}
        points={mapPoints}
        mapStyle={mapStyle}
      />
      
   

      {/* 使用说明 */}
      <div className="absolute bottom-8 left-8 z-[1000]">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 max-w-sm shadow-lg">
          <h3 className="text-gray-800 font-semibold mb-2">
            {language === 'zh' ? '📖 使用说明' : '📖 How to Use'}
          </h3>
          <div className="text-gray-700 text-sm space-y-1">
            <div>🖱️ {language === 'zh' ? '滚轮缩放查看不同城市' : 'Scroll to zoom and see different cities'}</div>
            <div>🎯 {language === 'zh' ? '点击标记查看城市详情' : 'Click markers to see city details'}</div>
            <div>👆 {language === 'zh' ? '悬停标记预览躺平指数' : 'Hover markers to preview lying flat index'}</div>
            <div>🌈 {language === 'zh' ? '颜色表示躺平难易程度' : 'Colors indicate lying flat difficulty'}</div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>{language === 'zh' ? '难躺平 (0-40)' : 'Hard to Lie Flat (0-40)'}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>{language === 'zh' ? '较难 (40-60)' : 'Moderate (40-60)'}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>{language === 'zh' ? '一般 (60-80)' : 'Easy (60-80)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>{language === 'zh' ? '很容易 (80+)' : 'Very Easy (80+)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 选中地区详细信息 */}
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

      {/* 地图样式选择器 */}
      <div className="absolute top-8 right-8 z-[1000]">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-xs text-gray-600 mb-2 text-center font-medium">
            {language === 'zh' ? '🗺️ 地图样式' : '🗺️ Map Style'}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleMapStyleChange('terrain')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapStyle === 'terrain' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'zh' ? '地形' : 'Terrain'}
            </button>
            <button
              onClick={() => handleMapStyleChange('satellite')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapStyle === 'satellite' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'zh' ? '卫星' : 'Satellite'}
            </button>
            <button
              onClick={() => handleMapStyleChange('standard')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapStyle === 'standard' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'zh' ? '标准' : 'Standard'}
            </button>
 
          </div>
        </div>
      </div>

      {/* 缩放级别控制器 */}
      <div className="absolute bottom-8 right-8 z-[1000]">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-xs text-gray-600 mb-1 text-center">
            {language === 'zh' ? '缩放级别' : 'Zoom Level'}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              +
            </button>
            <div className="text-xs text-center text-gray-700 px-2">
              {mapZoom}
            </div>
            <button
              onClick={() => setMapZoom(Math.max(mapZoom - 1, 2))}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView
