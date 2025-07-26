import React, { useState, useMemo } from 'react'
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

  
  // 默认选中杭州
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0)



  // 获取精选城市数据
  const destinations = useMemo(() => {
    return selectedCities.map(city => ({
      ...city,
      regionData: mockRegionsData[city.id]
    })).filter(city => city.regionData)
  }, [])

  // 计算围绕地球组件的圆形排布位置
  const calculateCirclePosition = (index: number, total: number, isSelected: boolean) => {
    if (isSelected) {
      // 选中的城市在屏幕上方中央，突出显示
      return {
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20
      }
    }

    // 其他城市围绕地球组件排布
    // 地球组件位置：bottom-[-15vw]，即从底部向下15vw，大小50vw
    // 我们在地球周围形成一个圆弧
    const totalOtherCities = total - 1 // 排除选中的城市
    let adjustedIndex = index
    if (index > selectedCityIndex) {
      adjustedIndex = index - 1
    }
    
    // 创建围绕地球的圆弧（从左下到右下，经过地球周围）
    // 角度范围：-135度 到 -45度，形成地球上方的圆弧
    const startAngle = -135 * (Math.PI / 180) // 左上
    const endAngle = -45 * (Math.PI / 180)    // 右上
    const angleRange = endAngle - startAngle
    
    let angle = startAngle
    if (totalOtherCities > 1) {
      angle = startAngle + (adjustedIndex / (totalOtherCities - 1)) * angleRange
    }
    
    // 地球中心大约在屏幕底部30%的位置，水平居中
    const earthCenterX = 50
    const earthCenterY = 70 // 地球在屏幕下方70%位置
    
    // 圆弧半径（相对于屏幕大小）
    const radiusX = 35 // 水平半径
    const radiusY = 25 // 垂直半径（椭圆形，适应屏幕比例）
    
    // 计算位置
    const x = earthCenterX + radiusX * Math.cos(angle)
    const y = earthCenterY + radiusY * Math.sin(angle)
    
    return {
      top: `${Math.max(5, Math.min(80, y))}%`,
      left: `${Math.max(10, Math.min(90, x))}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 10
    }
  }

  const handleCitySelect = (index: number) => {
    const selectedCity = destinations[index]
    if (!selectedCity) {
      toast.error(language === 'zh' ? '城市数据未找到' : 'City data not found')
      return
    }

    if (index === selectedCityIndex) {
      // 确认操作：如果点击的城市已经被选中，则导航
      toast.success(
        `${language === 'zh' ? '准备出发！' : 'Ready to go!'}`,
        {
          duration: 1500,
          position: 'top-center',
        }
      )
  
      // 延迟跳转，让用户看到选择效果
      setTimeout(() => {
        navigate(`/trip-themes/${selectedCity.id}`)
      }, 1000)

    } else {
      // 选择操作：更新选中的城市
      setSelectedCityIndex(index)
    }
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
            {/* Selected city name tag */}
            {destinations[selectedCityIndex] && (
              <div className="inline-block mt-2">
                <div className="px-5 py-1.5 bg-green-600/90 text-white rounded-full text-md font-semibold shadow-lg">
                  {language === 'zh' ? destinations[selectedCityIndex].cityName : destinations[selectedCityIndex].cityNameEn}
                </div>
              </div>
            )}
          </div>

          {/* 城市选择布局 - 围绕地球的圆形排布 */}
          <div className="relative w-full flex-grow mb-0">
            {destinations.map((destination, index) => {
              const isSelected = index === selectedCityIndex
              const position = calculateCirclePosition(index, destinations.length, isSelected)
              
              return (
                <div
                  key={destination.id}
                  className="absolute cursor-pointer transition-all duration-700 ease-in-out transform-gpu hover:scale-105"
                  style={{
                    ...position,
                    width: isSelected ? '280px' : '200px',
                    height: isSelected ? '280px' : '200px',
                  }}
                  onClick={() => handleCitySelect(index)}
                >
                  <div className="relative w-full h-full">
                    {/* 城市图片 */}
                    <img
                      src={destination.image}
                      alt={language === 'zh' ? destination.cityName : destination.cityNameEn}
                      className={`w-full h-full object-cover rounded-full shadow-2xl transition-all duration-500 ${
                        isSelected 
                          ? 'ring-4 ring-green-400 ring-opacity-60' 
                          : 'ring-2 ring-white/30 opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        filter: isSelected ? 'none' : 'saturate(0.8) brightness(0.9)',
                      }}
                    />
                    
                    {/* 城市名称标签 */}
                    <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="px-3 py-1 bg-black/70 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                        {language === 'zh' ? destination.cityName : destination.cityNameEn}
                      </div>
                    </div>
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