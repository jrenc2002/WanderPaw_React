import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { AmapMap } from '@/components/map/AmapMap'
import { getPointsByZoom, type InteractivePoint } from '@/data/leafletMockData'
import toast from 'react-hot-toast'

const HomeView: React.FC = () => {
  const [language] = useAtom(selectedLanguageAtom)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.0, 110.0]) // 中国中心
  const [mapZoom, setMapZoom] = useState<number>(4)
  const [mapPoints, setMapPoints] = useState<InteractivePoint[]>([])


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



  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* 高德地图 */}
      <AmapMap
        onRegionClick={handleRegionClick}
        onRegionHover={handleRegionHover}
        className="w-full h-full"
        center={mapCenter}
        zoom={mapZoom}
        points={mapPoints}

      />
      
   



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




    </div>
  )
}

export default HomeView
