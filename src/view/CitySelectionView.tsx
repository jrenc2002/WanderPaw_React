import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

import { mockRegionsData } from '@/data/mockData'
import { EarthWithCapybara } from '@/components/decorations'
import toast from 'react-hot-toast'
import { WarmBg } from '@/components/bg/WarmBg'

// 引入城市图片
import hangzhouImg from '@/assets/杭州.png'
import chengduImg from '@/assets/成都.jpg'
import kyotoImg from '@/assets/京都.jpg'
import singaporeImg from '@/assets/新加坡.jpg'
import qingdaoImg from '@/assets/青岛.jpg'

// 精选五个城市配置
const selectedCities = [
  {
    id: 'CN-ZJ',
    cityName: '杭州',
    cityNameEn: 'Hangzhou',
    image: hangzhouImg
  },
  {
    id: 'CN-SC', 
    cityName: '成都',
    cityNameEn: 'Chengdu',
    image: chengduImg
  },
  {
    id: 'JP',
    cityName: '京都',
    cityNameEn: 'Kyoto', 
    image: kyotoImg
  },
  {
    id: 'SG',
    cityName: '新加坡',
    cityNameEn: 'Singapore',
    image: singaporeImg
  },
  {
    id: 'CN-QD',
    cityName: '青岛',
    cityNameEn: 'Qingdao',
    image: qingdaoImg
  }
]

const CitySelectionView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)

  




  // 获取精选城市数据
  const destinations = useMemo(() => {
    return selectedCities.map(city => ({
      ...city,
      regionData: mockRegionsData[city.id]
    })).filter(city => city.regionData)
  }, [])

  // 计算以地球组件为圆心的圆形排布位置
  const calculateCirclePosition = (index: number, total: number) => {
    // 地球组件位置分析：fixed bottom-[-15vw] left-1/2, 大小 50vw x 50vw
    // 地球中心位置计算
    const earthCenterX = 50 // 水平居中百分比
    const earthCenterY = 75 // 地球中心在屏幕75%位置（考虑到bottom-[-15vw]的偏移）
    
    // 大圆半径 - 足够大让城市围绕地球排布
    const radius = 40 // 使用40%的屏幕作为半径，形成大圆
    
    // 计算每个城市的角度 - 均匀分布在360度圆周上
    const angleStep = (2 * Math.PI) / total
    const angle = index * angleStep - Math.PI / 2 // 从顶部开始（-90度）
    
    // 计算位置坐标
    const x = earthCenterX + radius * Math.cos(angle)
    const y = earthCenterY + radius * Math.sin(angle)
    
    return {
      top: `${Math.max(5, Math.min(90, y))}%`,
      left: `${Math.max(5, Math.min(95, x))}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 15 // 统一的zIndex，没有层级区别
    }
  }

  const handleCitySelect = (index: number) => {
    const selectedCity = destinations[index]
    if (!selectedCity) {
      toast.error(language === 'zh' ? '城市数据未找到' : 'City data not found')
      return
    }

    // 直接选择并导航到该城市
    toast.success(
      `${language === 'zh' ? '出发前往' : 'Heading to'} ${language === 'zh' ? selectedCity.cityName : selectedCity.cityNameEn}!`,
      {
        duration: 1500,
        position: 'top-center',
      }
    )

    // 延迟跳转，让用户看到选择效果
    setTimeout(() => {
      navigate(`/trip-themes/${selectedCity.id}`)
    }, 1000)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <WarmBg>
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        {/* 返回按钮 */}
        <button
          onClick={handleBack}
          title={language === 'zh' ? '返回' : 'Back'}
          className="fixed top-8 left-8 z-40 bg-white/80 backdrop-blur-sm rounded-full p-3 text-gray-600 hover:bg-white/90 transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative z-20 flex flex-col items-center flex-grow p-6 pt-16">
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #4a7c59 0%, #8b9dc3 50%, #7b68ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              WanderPaw
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              {language === 'zh' ? '请选择希望探索的城市' : 'Choose the city you wish to explore'}
            </p>

          </div>

          {/* 城市选择布局 - 围绕地球的圆形排布 */}
          <div className="relative w-full flex-grow mb-0">
            {destinations.map((destination, index) => {
              const position = calculateCirclePosition(index, destinations.length)
              
              return (
                <div
                  key={destination.id}
                  className="absolute cursor-pointer transition-all duration-700 ease-in-out transform-gpu hover:scale-105"
                  style={{
                    ...position,
                    width: '200px',
                    height: '200px',
                  }}
                  onClick={() => handleCitySelect(index)}
                >
                  <div className="relative w-full h-full">
                    {/* 城市名称标签 */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 opacity-100">
                      <div className="px-3 py-1 bg-black/70 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                        {language === 'zh' ? destination.cityName : destination.cityNameEn}
                      </div>
                    </div>
                    {/* 城市图片 */}
                    <img
                      src={destination.image}
                      alt={language === 'zh' ? destination.cityName : destination.cityNameEn}
                      className="w-full h-full object-cover rounded-full transition-all duration-500 ring-2 ring-white/30 hover:ring-4 hover:ring-green-400/60 hover:scale-110 shadow-2xl"
                      style={{
                        filter: 'saturate(0.9) brightness(0.95)',
                      }}
                    />
                    
                  
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 底部水豚地球组件 */}
        <EarthWithCapybara />
      </div>
    </WarmBg>
  )
}

export default CitySelectionView 