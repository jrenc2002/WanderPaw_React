import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { getTopCountries } from '@/data/mockData'
import type { RegionData } from '@/store/MapState'

const CitySelectionView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [cities, setCities] = useState<RegionData[]>([])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  useEffect(() => {
    // 获取热门城市数据
    const popularCities = getTopCountries().slice(0, 12) // 取前12个热门目的地
    setCities(popularCities)
  }, [])

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId)
    // 短暂延迟后跳转到主题选择页面
    setTimeout(() => {
      navigate(`/trip-themes/${cityId}`)
    }, 300)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getTangpingColor = (index: number) => {
    if (index >= 80) return 'from-green-400 to-emerald-500'
    if (index >= 60) return 'from-blue-400 to-cyan-500'
    if (index >= 40) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const getTangpingText = (index: number) => {
    if (index >= 80) return language === 'zh' ? '超级躺平' : 'Super Chill'
    if (index >= 60) return language === 'zh' ? '很躺平' : 'Very Chill'
    if (index >= 40) return language === 'zh' ? '适度躺平' : 'Moderately Chill'
    return language === 'zh' ? '需要奋斗' : 'Need Hustle'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部导航 */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{language === 'zh' ? '返回' : 'Back'}</span>
        </button>
        
        <h1 className="text-xl font-bold text-gray-800">
          {language === 'zh' ? '选择旅行目的地' : 'Choose Your Destination'}
        </h1>
        
        <div className="w-16"></div> {/* 占位符保持居中 */}
      </div>

      {/* 主要内容 */}
      <div className="px-6 py-8">
        {/* 标题和描述 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'zh' ? '🌍 发现你的理想目的地' : '🌍 Discover Your Ideal Destination'}
          </h2>
          <p className="text-gray-600 text-sm">
            {language === 'zh' 
              ? '选择一个城市，开始你的躺平之旅' 
              : 'Select a city to start your chill journey'
            }
          </p>
        </div>

        {/* 城市卡片网格 */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {cities.map((city) => (
              <div
                key={city.id}
                onClick={() => handleCitySelect(city.id)}
                className={`
                  relative flex-shrink-0 w-72 h-80 rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  ${selectedCity === city.id ? 'scale-105 shadow-2xl ring-4 ring-blue-400' : 'hover:shadow-xl'}
                `}
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getTangpingColor(city.tangpingIndex)} opacity-90`} />
                
                {/* 装饰性图案 */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full" />
                <div className="absolute bottom-8 left-4 w-8 h-8 bg-white/20 rounded-full" />
                
                {/* 内容 */}
                <div className="relative p-6 h-full flex flex-col justify-between text-white">
                  {/* 顶部信息 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {city.countryCode}
                      </span>
                      <span className="text-2xl">
                        {selectedCity === city.id ? '✈️' : '🏙️'}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">
                      {language === 'zh' ? city.name : city.nameEn}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-white/90">
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>
                          {language === 'zh' ? '月薪' : 'Salary'}: {city.averageSalary.toLocaleString()} {city.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏠</span>
                        <span>
                          {language === 'zh' ? '房租' : 'Rent'}: {city.rentPrice.toLocaleString()} {city.currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⚖️</span>
                        <span>
                          {language === 'zh' ? '工作平衡' : 'Work-Life'}: {city.workLifeBalance}/100
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 底部躺平指数 */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {language === 'zh' ? '躺平指数' : 'Chill Index'}
                      </span>
                      <span className="text-lg font-bold">{city.tangpingIndex}</span>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${city.tangpingIndex}%` }}
                      />
                    </div>
                    
                    <span className="text-xs text-white/80">
                      {getTangpingText(city.tangpingIndex)}
                    </span>
                  </div>
                </div>
                
                {/* 选中状态指示器 */}
                {selectedCity === city.id && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-white/50 pointer-events-none">
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            {language === 'zh' 
              ? '👆 左右滑动查看更多城市，点击卡片继续' 
              : '👆 Swipe to see more cities, tap a card to continue'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default CitySelectionView 