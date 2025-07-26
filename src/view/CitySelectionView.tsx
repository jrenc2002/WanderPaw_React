import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { getTopCountries } from '@/data/mockData'
import type { RegionData } from '@/store/MapState'
import { WarmBg } from '@/components/bg/WarmBg'
import './CitySelectionView.css'

const CitySelectionView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [cities, setCities] = useState<RegionData[]>([])
  const [currentCenterIndex, setCurrentCenterIndex] = useState(0)

  const handleBack = () => {
    navigate(-1)
  }

  const getPetFriendlyColor = (index: number) => {
    if (index >= 80) return 'from-green-400 to-emerald-500'
    if (index >= 60) return 'from-blue-400 to-cyan-500'
    if (index >= 40) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const getPetFriendlyText = (index: number) => {
    if (index >= 80) return language === 'zh' ? '超级躺平' : 'Super Chill'
    if (index >= 60) return language === 'zh' ? '很躺平' : 'Very Chill'
    if (index >= 40) return language === 'zh' ? '适度躺平' : 'Moderately Chill'
    return language === 'zh' ? '需要奋斗' : 'Need Hustle'
  }

  // 定义函数
  const handleCitySelect = useCallback((cityIndex: number) => {
    setCurrentCenterIndex(cityIndex)
  }, [])

  const handleConfirm = useCallback(() => {
    const selectedCity = cities[currentCenterIndex]
    if (selectedCity) {
      navigate(`/trip-themes/${selectedCity.id}`)
    }
  }, [cities, currentCenterIndex, navigate])

  const goToPrevious = useCallback(() => {
    setCurrentCenterIndex((prev) => (prev - 1 + cities.length) % cities.length)
  }, [cities.length])

  const goToNext = useCallback(() => {
    setCurrentCenterIndex((prev) => (prev + 1) % cities.length)
  }, [cities.length])

  useEffect(() => {
    try {
      // 获取热门城市数据
      const popularCities = getTopCountries().slice(0, 12) // 取前12个热门目的地
      setCities(popularCities)
    } catch (error) {
      console.error('Error loading cities:', error)
    }
  }, [])

  useEffect(() => {
    // 键盘导航支持
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleConfirm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, handleConfirm])

  const getCardPosition = (cardIndex: number) => {
    // 如果没有城市数据，返回0
    if (cities.length === 0) return 0
    
    const diff = cardIndex - currentCenterIndex
    if (diff === 0) return 0
    
    // 处理环绕情况
    const totalCards = cities.length
    let position = diff
    
    if (Math.abs(diff) > totalCards / 2) {
      position = diff > 0 ? diff - totalCards : diff + totalCards
    }
    
    // 扇形轮播只显示5张卡片：限制位置范围 -2 到 2
    return Math.max(-2, Math.min(2, position))
  }

  // 根据位置获取透明度
  const getCardOpacity = (position: number) => {
    switch (Math.abs(position)) {
      case 0: return 1.0      // 中心卡片：完全不透明
      case 1: return 0.7      // 第一层：70%透明度
      case 2: return 0.4      // 第二层：40%透明度
      default: return 0.2     // 其他：20%透明度
    }
  }

  // 获取可见的卡片索引
  const getVisibleCards = () => {
    if (cities.length === 0) return []
    
    const visibleCards = []
    for (let i = 0; i < cities.length; i++) {
      const position = getCardPosition(i)
      if (Math.abs(position) <= 2) {
        visibleCards.push({ city: cities[i], index: i, position })
      }
    }
    return visibleCards
  }

  return (
    <WarmBg showDecorations={true} className="relative">
      {/* 返回按钮 - 左上角 */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#687949] bg-transparent p-2 rounded-lg"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>{language === 'zh' ? '返回' : 'Back'}</span>
      </button>

      {/* 主要内容 */}
      <div className="px-6 py-8">
        {/* 标题和描述 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#687949] dark:text-amber-200 mb-4">
            WanderPaw
          </h1>
          <p className="text-xl text-[#687949] dark:text-amber-300 font-medium">
            请选择希望探索的城市
          </p>
        </div>

        {/* 城市卡片轮播 */}
        <div className="city-cards-carousel">
          {cities.length === 0 ? (
            <div className="text-center text-amber-700">
              <p>正在加载城市数据...</p>
            </div>
          ) : (
            <>

              {getVisibleCards().map(({ city, index, position }) => {
                const isCenter = position === 0
                const cardOpacity = getCardOpacity(position)
                
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(index)}
                    tabIndex={0}
                    className="city-card fan-card"
                    data-position={position}
                    style={{ 
                      opacity: cardOpacity 
                    } as React.CSSProperties}
                  >
                    <div className="city-card-content">
                      {/* 背景渐变 */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getPetFriendlyColor(city.petFriendlyIndex)}`} 
                           style={{ opacity: 0.95 - (Math.abs(position) * 0.1) }} />
                      
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
                              {isCenter ? '✈️' : '🏙️'}
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
                        
                        {/* 底部宠物友好度 */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {language === 'zh' ? '宠物友好度' : 'Chill Index'}
                            </span>
                            <span className="text-lg font-bold">{city.petFriendlyIndex}</span>
                          </div>
                          
                          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-500"
                              style={{ width: `${city.petFriendlyIndex}%` }}
                            />
                          </div>
                          
                          <span className="text-xs text-white/80">
                            {getPetFriendlyText(city.petFriendlyIndex)}
                          </span>
                        </div>
                      </div>
                      
                      {/* 选中状态指示器 - 飞机图标 */}
                      {isCenter && (
                        <div className="absolute top-2 right-2 selected-indicator">
                          <svg 
                            xmlns='http://www.w3.org/2000/svg' 
                            width='36' 
                            height='36' 
                            viewBox='0 0 24 24'
                            className="text-emerald-600 opacity-70 transform rotate-12 drop-shadow-lg"
                          >
                            <path 
                              fill='currentColor' 
                              d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5L21 16Z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* 底部确认按钮和提示 */}
        <div className="text-center mt-8">
          <button
            onClick={handleConfirm}
            className="mb-4 px-8 py-3 bg-gradient-to-r from-[#687949] to-[#687949] text-white rounded-[22px] font-bold text-lg hover:from-[#505D39] hover:to-[#505D39] transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            {language === 'zh' ? '确认选择' : 'Confirm Selection'}
          </button>
          
        </div>
      </div>
    </WarmBg>
  )
}

export default CitySelectionView 