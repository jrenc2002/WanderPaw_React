import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapboxMap } from '@/components/map/MapboxMap'
import { MapBorderMask } from '@/components/decorations'
import { getAllGenesisSamples } from '@/data/genesisSamples'
import { WarmBg } from '@/components/bg/WarmBg'

export const SampleTestView: React.FC = () => {
  const navigate = useNavigate()
  const samples = getAllGenesisSamples()

  // 将生活样本转换为 Leaflet 地图标点格式
  const mapPoints = samples.map(sample => ({
    id: sample.id,
    position: [sample.location.coordinates[1], sample.location.coordinates[0]] as [number, number], // Leaflet 使用 [lat, lng]
    title: sample.sharerProfile.nickname,
    description: `${sample.location.cityName} - ${sample.sharerProfile.profession}`,
    petFriendlyIndex: sample.qualityScore || 70,
    data: {
      averageSalary: sample.monthlyBudget.totalMonthly,
      currency: sample.monthlyBudget.currency,
      workLifeBalance: sample.sharerProfile.workMode === 'remote' ? '很好' : 
                       sample.sharerProfile.workMode === 'hybrid' ? '良好' : '一般',
      costOfLiving: sample.monthlyBudget.totalMonthly,
      qualityOfLife: sample.qualityScore || 70
    }
  }))

  const handleRegionClick = (regionId: string, data?: any) => {
    console.log('点击了地区:', regionId, data)
    // 如果是生活样本点，导航到详情页
    if (regionId.startsWith('sample_')) {
      const sampleId = regionId.replace('sample_', '')
      navigate(`/sample/${sampleId}`)
    }
  }

  const handleRegionHover = (regionId: string | null, data?: any) => {
    if (regionId) {
      console.log('悬停在:', regionId, data)
    }
  }

  return (
    <WarmBg>
      {/* 头部信息 */}
      <div className="p-6 bg-white/80 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 WanderPaw - 全球生活样本地图
        </h1>
        <p className="text-gray-600 mb-4">
          探索真实的生活样本，发现属于你的旅行方式
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
        <div className="h-full bg-black/30 rounded-lg backdrop-blur-sm border border-gray-800 overflow-hidden relative">
          <MapboxMap
            onRegionClick={handleRegionClick}
            onRegionHover={handleRegionHover}
            className="w-full h-full"
            center={[30.0, 120.0]} // 以中国为中心
            zoom={4}
            maxZoom={12}
            points={mapPoints}
          />
          
          {/* 地图边界遮罩 */}
          <MapBorderMask variant="subtle" maskWidth="35px" backgroundColor="#1F2937" />
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
            <span>质量评分（颜色表示）</span>
          </div>
          <div className="text-xs">
            💡 提示：点击标记点查看详细生活样本信息
          </div>
        </div>
      </div>
    </WarmBg>
  )
} 