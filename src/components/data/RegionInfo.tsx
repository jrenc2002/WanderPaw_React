import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
import {
  hoveredRegionAtom,
  selectedLanguageAtom
} from '@/store/MapState'
import { mockRegionsData } from '@/data/mockData'

interface RegionInfoProps {
  regionId?: string
  className?: string
}

export const RegionInfo: React.FC<RegionInfoProps> = ({
  regionId,
  className = ""
}) => {
  const [hoveredRegion] = useAtom(hoveredRegionAtom)
  const [language] = useAtom(selectedLanguageAtom)
  
  const displayRegionId = regionId || hoveredRegion
  const region = displayRegionId ? mockRegionsData[displayRegionId] : null

  if (!region) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            🗺️
          </div>
          <p className="text-sm">将鼠标悬停在地图上查看地区信息</p>
        </div>
      </div>
    )
  }

  // 获取宠物友好度等级
  const getPetFriendlyLevel = (index: number) => {
    if (index >= 80) return { text: '极度躺平', color: 'text-green-600', bg: 'bg-green-100' }
    if (index >= 60) return { text: '相对躺平', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (index >= 40) return { text: '一般', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (index >= 20) return { text: '压力较大', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { text: '高压内卷', color: 'text-red-600', bg: 'bg-red-100' }
  }

  // 获取指标颜色
  const getIndicatorColor = (value: number, reverse = false) => {
    const threshold = reverse ? [80, 60, 40, 20] : [20, 40, 60, 80]
    if (reverse) {
      if (value >= threshold[0]) return 'text-red-500'
      if (value >= threshold[1]) return 'text-orange-500'
      if (value >= threshold[2]) return 'text-yellow-500'
      if (value >= threshold[3]) return 'text-blue-500'
      return 'text-green-500'
    } else {
      if (value >= threshold[3]) return 'text-green-500'
      if (value >= threshold[2]) return 'text-blue-500'
      if (value >= threshold[1]) return 'text-yellow-500'
      if (value >= threshold[0]) return 'text-orange-500'
      return 'text-red-500'
    }
  }

  const petFriendlyLevel = getPetFriendlyLevel(region.petFriendlyIndex)

  // 货币格式化
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString()}`
    } else if (currency === 'CNY') {
      return `¥${amount.toLocaleString()}`
    } else if (currency === 'EUR') {
      return `€${amount.toLocaleString()}`
    } else if (currency === 'JPY') {
      return `¥${amount.toLocaleString()}`
    } else if (currency === 'GBP') {
      return `£${amount.toLocaleString()}`
    }
    return `${amount.toLocaleString()} ${currency}`
  }

  return (
    <motion.div
      key={region.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border overflow-hidden ${className}`}
    >
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {language === 'zh' ? region.name : region.nameEn}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {region.type === 'country' ? '国家' : 
               region.type === 'province' ? '省份' : '城市'}
            </p>
          </div>
          <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${petFriendlyLevel.bg} ${petFriendlyLevel.color}`}>
          {petFriendlyLevel.text}
            </div>
            <div className="text-2xl font-bold mt-1">
              {region.petFriendlyIndex}
            </div>
            <div className="text-blue-100 text-xs">宠物友好度</div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-6 space-y-6">
        {/* 生活成本 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            💰 生活成本
            <span className="ml-2 text-xs text-gray-500">({region.currency})</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">平均工资</div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(region.averageSalary, region.currency)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">房租(月)</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(region.rentPrice, region.currency)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">餐饮(月)</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(region.foodCost, region.currency)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">交通(月)</div>
              <div className="text-lg font-semibold text-purple-600">
                {formatCurrency(region.transportCost, region.currency)}
              </div>
            </div>
          </div>
        </div>

        {/* 生活质量指标 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 生活质量</h3>
          <div className="space-y-3">
            {[
              { label: '工作生活平衡', value: region.workLifeBalance, icon: '⚖️' },
              { label: '社会安全指数', value: region.socialSafety, icon: '🛡️' },
              { label: '文化多样性', value: region.culturalDiversity, icon: '🌍' },
              { label: '气候舒适度', value: region.climateComfort, icon: '🌡️' },
              { label: '自由职业友好', value: region.freelanceFriendly, icon: '💼' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.value >= 80 ? 'bg-green-500' :
                        item.value >= 60 ? 'bg-blue-500' :
                        item.value >= 40 ? 'bg-yellow-500' :
                        item.value >= 20 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getIndicatorColor(item.value)}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 其他信息 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 其他信息</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">人口:</span>
              <span className="font-medium">{region.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">网速:</span>
              <span className="font-medium">{region.internetSpeed} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">人均GDP:</span>
              <span className="font-medium">${region.gdpPerCapita.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">失业率:</span>
              <span className="font-medium">{region.unemploymentRate}%</span>
            </div>
          </div>
        </div>

        {/* 压力因子指示器 */}
        <div className="bg-gradient-to-r from-red-50 to-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">压力因子</span>
            <span className={`text-sm font-bold ${getIndicatorColor(region.stressFactor, true)}`}>
              {region.stressFactor}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                region.stressFactor >= 80 ? 'bg-red-500' :
                region.stressFactor >= 60 ? 'bg-orange-500' :
                region.stressFactor >= 40 ? 'bg-yellow-500' :
                region.stressFactor >= 20 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${region.stressFactor}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            数值越低表示压力越小，越适合躺平
          </div>
        </div>
      </div>
    </motion.div>
  )
} 