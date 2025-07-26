import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { petInfoAtom } from '@/store/PetState'

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
    image: hangzhouImg,
    fallbackImage: '/city-images/杭州.jpg'
  },
  {
    id: 'CN-SC', 
    cityName: '成都',
    cityNameEn: 'Chengdu',
    image: chengduImg,
    fallbackImage: '/city-images/成都.jpg'
  },
  {
    id: 'JP',
    cityName: '京都',
    cityNameEn: 'Kyoto', 
    image: kyotoImg,
    fallbackImage: '/city-images/京都.jpg'
  },
  {
    id: 'SG',
    cityName: '新加坡',
    cityNameEn: 'Singapore',
    image: singaporeImg,
    fallbackImage: '/city-images/新加坡.jpg'
  },
  {
    id: 'CN-QD',
    cityName: '青岛',
    cityNameEn: 'Qingdao',
    image: qingdaoImg,
    fallbackImage: '/city-images/青岛.jpg'
  }
]

const CitySelectionView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [petInfo] = useAtom(petInfoAtom)

  
  // 默认选中中间的城市（京都，索引2）
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(2)
  
  // 图片加载状态
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  // 获取精选城市数据
  const destinations = useMemo(() => {
    const result = selectedCities.map(city => ({
      ...city,
      regionData: mockRegionsData[city.id]
    })).filter(city => city.regionData)
    
    return result
  }, [])

  // 处理图片加载错误
  const handleImageError = (cityId: string, cityName: string) => {
    console.error(`图片加载失败: ${cityName} (${cityId})`);
    setImageErrors(prev => ({ ...prev, [cityId]: true }));
  }

  // 处理图片加载成功
  const handleImageLoad = (cityName: string) => {
    console.log(`图片加载成功: ${cityName}`);
  }

  // 获取显示的城市列表（循环显示）
  const getVisibleCities = () => {
    const visibleCities: Array<{
      id: string;
      cityName: string;
      cityNameEn: string;
      image: string;
      fallbackImage: string;
      regionData: any;
      position: number;
      originalIndex: number;
    }> = []
    const totalCities = destinations.length
    
    // 显示当前选中的前后各2个城市，总共5个
    for (let i = -2; i <= 2; i++) {
      const index = (selectedCityIndex + i + totalCities) % totalCities
      visibleCities.push({
        ...destinations[index],
        position: i,
        originalIndex: index
      })
    }
    
    return visibleCities
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

  const visibleCities = getVisibleCities()

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
          <div className="text-center mb-12">
            <h1 className="wanderpaw-title text-4xl md:text-5xl font-bold text-[#687949] dark:text-amber-200 mb-4 transition-all duration-300 ease-in-out hover:scale-105">
              WanderPaw
            </h1>
            <p className="text-lg mb-4" style={{ color: '#687949' }}>
              {language === 'zh' ? '请选择希望探索的城市' : 'Choose the city you wish to explore'}
            </p>
            {/* Selected city name tag */}
            {destinations[selectedCityIndex] && (
              <div key={selectedCityIndex} className="inline-block transition-all duration-500 ease-in-out animate-fadeIn">
                <div className="px-6 py-2 text-white rounded-full text-lg font-semibold shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105 active:scale-95" style={{ backgroundColor: '#687949' }}>
                  {language === 'zh' ? destinations[selectedCityIndex].cityName : destinations[selectedCityIndex].cityNameEn}
                </div>
              </div>
            )}
          </div>

          {/* 横向滑动城市选择器 */}
          <div className="relative w-full max-w-6xl" style={{ marginTop: '5vh' }}>
                        {/* 城市卡片容器 */}
            <div className="flex items-center justify-center space-x-8 transition-all duration-700 ease-in-out">
              {visibleCities.map((city, index) => {
                const isCenter = city.position === 0
                const distance = Math.abs(city.position)
                
                // 根据位置计算样式
                const scale = isCenter ? 1.2 : 1 - (distance * 0.15)
                const opacity = isCenter ? 1 : 0.4 + (0.6 / (distance + 1))
                const zIndex = isCenter ? 20 : 10 - distance
                
                // 计算位移动画
                const translateX = city.position * 10 // 轻微的水平位移效果
                
                return (
                  <div
                    key={`${city.id}-${city.position}`}
                    className="transition-all duration-700 ease-in-out cursor-pointer hover:scale-105 active:scale-95 transform-gpu"
                    style={{
                      transform: `scale(${scale}) translateX(${translateX}px) translateZ(0)`,
                      opacity: opacity,
                      zIndex: zIndex,
                      filter: isCenter ? 'blur(0px)' : 'blur(0.5px)',
                    }}
                    onClick={() => handleCitySelect(city.originalIndex)}
                  >
                    <div className="relative w-64 h-64 group">
                      {/* 城市图片 */}
                      <div className="w-full h-full rounded-2xl overflow-hidden transition-all duration-700 ease-in-out">
                        <img
                          src={imageErrors[city.id] ? city.fallbackImage : city.image}
                          alt={language === 'zh' ? city.cityName : city.cityNameEn}
                          className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform-gpu ${
                            isCenter 
                              ? 'brightness-110 saturate-110 scale-105' 
                              : 'brightness-75 saturate-75 scale-100 group-hover:brightness-90 group-hover:saturate-90 group-hover:scale-102'
                          }`}
                          onError={() => handleImageError(city.id, city.cityName)}
                          onLoad={() => handleImageLoad(city.cityName)}
                        />
                      </div>

                      {/* 动画边框效果 */}
                      {isCenter && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse"></div>
                      )}
                      
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 指示器圆点 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {destinations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCityIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 active:scale-95 ${
                    index === selectedCityIndex 
                      ? 'bg-white/90 scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70 scale-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 底部宠物地球组件 */}
        <div className="absolute bottom-[-60vh] left-0 w-full h-full">
          <EarthWithCapybara petType={petInfo.type === 'none' ? 'other' : (petInfo.type || 'other')} />
        </div>
      </div>
    </WarmBg>
  )
}

export default CitySelectionView 