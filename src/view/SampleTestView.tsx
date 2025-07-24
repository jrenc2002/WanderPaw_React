import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalMap } from '@/components/map/GlobalMap'
import { getAllGenesisSamples } from '@/data/genesisSamples'

export const SampleTestView: React.FC = () => {
  const navigate = useNavigate()
  const samples = getAllGenesisSamples()

  const handleRegionClick = (regionId: string) => {
    console.log('点击了国家:', regionId)
  }

  const handleSampleClick = (sampleId: string) => {
    console.log('点击了生活样本:', sampleId)
    // 导航到详情页
    navigate(`/sample/${sampleId}`)
  }

  const handleRegionHover = (regionId: string | null) => {
    if (regionId) {
      console.log('悬停在:', regionId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* 头部信息 */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-2">
          🌍 躺平网 - 全球生活样本地图
        </h1>
        <p className="text-gray-300 mb-4">
          探索真实的生活样本，发现属于你的躺平方式
        </p>
        
        {/* 样本统计 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400">
            📊 已收录 {samples.length} 个生活样本
          </div>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">
            🏠 覆盖 {new Set(samples.map(s => s.location.cityName)).size} 个城市
          </div>
          <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400">
            💼 涵盖 {new Set(samples.map(s => s.sharerProfile.profession)).size} 种职业
          </div>
        </div>
      </div>

      {/* 地图主体 */}
      <div className="h-[calc(100vh-200px)] p-6">
        <div className="h-full bg-black/30 rounded-lg backdrop-blur-sm border border-gray-800 overflow-hidden">
          <GlobalMap
            onRegionClick={handleRegionClick}
            onSampleClick={handleSampleClick}
            onRegionHover={handleRegionHover}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 底部说明 */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-md"></div>
            <span>生活样本标记点</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-green-400 rounded"></div>
            <span>国家躺平指数（颜色表示）</span>
          </div>
          <div className="text-xs">
            💡 提示：点击绿色圆点查看详细生活样本，点击国家查看整体数据
          </div>
        </div>
      </div>
    </div>
  )
} 