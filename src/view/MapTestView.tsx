import React from 'react'
import { MapboxMap } from '@/components/map/MapboxMap'
import { MapBorderMask } from '@/components/decorations'

const testPoints = [
  {
    id: 'beijing',
    position: [39.9042, 116.4074] as [number, number],
    title: '北京',
    description: '中国的首都',
    petFriendlyIndex: 75,
    data: {
      averageSalary: 15000,
      rentPrice: 5000,
      currency: 'CNY',
      workLifeBalance: '一般'
    }
  },
  {
    id: 'shanghai',
    position: [31.2304, 121.4737] as [number, number],
    title: '上海',
    description: '中国的经济中心',
    petFriendlyIndex: 65,
    data: {
      averageSalary: 18000,
      rentPrice: 6000,
      currency: 'CNY',
      workLifeBalance: '较差'
    }
  },
  {
    id: 'shenzhen',
    position: [22.5431, 114.0579] as [number, number],
    title: '深圳',
    description: '中国的科技之都',
    petFriendlyIndex: 70,
    data: {
      averageSalary: 16000,
      rentPrice: 4500,
      currency: 'CNY',
      workLifeBalance: '一般'
    }
  }
]

export const MapTestView: React.FC = () => {
  const handleRegionClick = (regionId: string, data?: any) => {
    console.log('点击了地区:', regionId, data)
    alert(`点击了: ${regionId}`)
  }

  const handleRegionHover = (regionId: string | null, data?: any) => {
    if (regionId) {
      console.log('悬停在:', regionId, data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mapbox 地图测试</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">地图信息</h2>
          <p className="text-gray-600">
            🗺️ 使用 Mapbox GL JS<br/>
            🌍 全球详细地图数据支持<br/>
            📍 测试点位: 北京、上海、深圳<br/>
            ✨ 支持国外地图详细数据
          </p>
        </div>

        <div className="h-[600px] bg-white rounded-lg shadow-lg overflow-hidden relative">
          <MapboxMap
            onRegionClick={handleRegionClick}
            onRegionHover={handleRegionHover}
            className="w-full h-full"
            center={[35.0, 110.0]} // 中国中心
            zoom={5}
            maxZoom={14}
            points={testPoints}
          />
          
          {/* 地图边界遮罩 */}
          <MapBorderMask variant="soft" maskWidth="25px" />
        </div>


      </div>
    </div>
  )
} 