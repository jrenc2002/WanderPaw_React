import React from 'react'
import { AmapMap } from '@/components/map/AmapMap'

const testPoints = [
  {
    id: 'beijing',
    position: [39.9042, 116.4074] as [number, number],
    title: '北京',
    description: '中国的首都',
    tangpingIndex: 75,
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
    tangpingIndex: 65,
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
    tangpingIndex: 70,
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
        <h1 className="text-3xl font-bold mb-6 text-center">高德地图测试</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">地图信息</h2>
          <p className="text-gray-600">
            🗺️ 使用高德地图 JS API 2.0<br/>
            🔑 API Key: 04475e3e2f3f06596d30bc50a740678d<br/>
            🔐 安全密钥: 3fbcccdd17deb2d05f4c92255d448879<br/>
            📍 测试点位: 北京、上海、深圳
          </p>
        </div>

        <div className="h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
          <AmapMap
            onRegionClick={handleRegionClick}
            onRegionHover={handleRegionHover}
            className="w-full h-full"
            center={[35.0, 110.0]} // 中国中心
            zoom={5}
            points={testPoints}
            mapStyle="standard"
          />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-2">使用说明</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>点击地图上的标记查看详细信息</li>
            <li>使用鼠标滚轮缩放地图</li>
            <li>拖拽移动地图视角</li>
            <li>右下角有缩放控件</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 