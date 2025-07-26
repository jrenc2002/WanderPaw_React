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

  // 计算球状弧线位置 - 确保角度均匀分布
  const calculateSphericalArcPosition = (index: number, total: number, isSelected: boolean) => {
    // 定义弧线参数
    const centerX = 50 // 弧线中心X坐标（屏幕50%）
    const centerY = 60 // 弧线中心Y坐标（屏幕40%）
    const arcRadius = 45 // 弧线半径
    
    // 计算均匀角度间隔
    const angleStep = 30 // 每两张图片之间的角度间隔（度）
    
    // 计算中心图片的索引（居中对称）
    const centerIndex = (total - 1) / 2
    
    // 计算当前图片相对于中心的角度偏移
    const angleOffset = (index - centerIndex) * angleStep
    
    // 最终角度（0度为正上方，正值为顺时针）
    const angle = angleOffset
    const angleRad = (angle * Math.PI) / 180 // 转换为弧度
    
    // 计算基础位置 - 形成真正的圆形上半弧
    const baseX = centerX + arcRadius * Math.sin(angleRad)
    const baseY = centerY - arcRadius * Math.cos(angleRad) // 移除Y轴压缩，保证圆形
    
    // 选中状态的特殊处理
    if (isSelected) {
      return {
        top: `${baseY - 3}%`, // 选中时稍微上移
        left: `${baseX}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20
      }
    }
    
    return {
      top: `${baseY}%`,
      left: `${baseX}%`,
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
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #4a7c59 0%, #8b9dc3 50%, #7b68ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              WanderPaw
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {language === 'zh' ? '请选择希望探索的城市' : 'Choose the city you wish to explore'}
            </p>
            {/* Selected city name tag */}
            {destinations[selectedCityIndex] && (
              <div className="inline-block">
                <div className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-lg font-semibold shadow-lg">
                  {language === 'zh' ? destinations[selectedCityIndex].cityName : destinations[selectedCityIndex].cityNameEn}
                </div>
              </div>
            )}
          </div>

          {/* 球状弧线城市布局 */}
          <div className="relative w-full flex-grow">
            {/* 弧线背景引导线（可选的视觉辅助） */}
            <div className="absolute inset-0 pointer-events-none">
              <svg
                className="w-full h-full opacity-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M 12 40 A 45 45 0 0 1 88 40"
                  stroke="url(#arcGradient)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="2,2"
                />
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b9dc3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7b68ee" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {destinations.map((destination, index) => {
              const isSelected = index === selectedCityIndex
              const position = calculateSphericalArcPosition(index, destinations.length, isSelected)
              
              return (
                <div
                  key={destination.id}
                  className="absolute cursor-pointer transition-all duration-700 ease-in-out transform-gpu hover:scale-105 group"
                  style={{
                    ...position,
                    width: isSelected ? '300px' : '300px',
                    height: isSelected ? '300px' : '300px',
                  }}
                  onClick={() => handleCitySelect(index)}
                >
                  <div className="relative w-full h-full">
                    {/* 城市图片容器 */}
                    <div className={`relative w-full h-full  transition-all duration-500`}>
                      {/* 城市图片 */}
                      <img
                        src={imageErrors[destination.id] ? destination.fallbackImage : destination.image}
                        alt={language === 'zh' ? destination.cityName : destination.cityNameEn}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isSelected 
                            ? 'scale-105 brightness-110' 
                            : 'scale-100 saturate-90 brightness-95 group-hover:saturate-100 group-hover:brightness-100'
                        }`}
                        onError={() => handleImageError(destination.id, destination.cityName)}
                        onLoad={() => handleImageLoad(destination.cityName)}
                      />
                      
                    
                    </div>
                   
                    
                  
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 底部水豚地球组件 */}
        <div className="absolute bottom-[-60vh] left-0 w-full h-full">
          <EarthWithCapybara />
        </div>
      </div>
    </WarmBg>
  )
}

export default CitySelectionView 