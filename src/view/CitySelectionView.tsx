import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { authStateAtom } from '@/store/AuthState'
import { mockRegionsData } from '@/data/mockData'
import { EarthWithCapybara } from '@/components/decorations'
import toast from 'react-hot-toast'
import { WarmBg } from '@/components/bg/WarmBg'

// 精选五个城市
const selectedCities = [
  'CN-ZJ',  // 杭州
  'CN-SC',  // 成都
  'JP',     // 日本 (京都)
  'SG',     // 新加坡
  'CN-QD'   // 广东 (用青岛图片暂代)
]

// 城市图片映射
const cityImages: Record<string, string> = {
  'CN-ZJ': '/city-images/杭州.jpg',
  'CN-SC': '/city-images/成都.jpg', 
  'JP': '/city-images/京都.jpg',
  'SG': '/city-images/新加坡.jpg',
  'CN-QD': '/city-images/青岛.jpg' // 用青岛图片暂代广东
}

// 城市在画面中的位置和大小配置
const slotStyles: Record<string, React.CSSProperties> = {
  center:      { top: '50%', left: '50%', zIndex: 10 },
  bottomLeft:  { top: '80%', left: '18%', zIndex: 5 },
  bottomRight: { top: '85%', left: '82%', zIndex: 5 },
  topRight:    { top: '45%', left: '88%', zIndex: 5 },
  topLeft:     { top: '45%', left: '15%', zIndex: 5 },
}

const CitySelectionView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [authState] = useAtom(authStateAtom)
  
  // 默认选中杭州
  const [selectedCityId, setSelectedCityId] = useState<string>('CN-ZJ')

  // 城市与位置槽的对应关系
  const [citySlots, setCitySlots] = useState<Record<string, string>>({
    'CN-ZJ': 'center',
    'CN-SC': 'bottomLeft',
    'SG': 'bottomRight',
    'JP': 'topRight',
    'CN-GD': 'topLeft',
  })

  const petInfo = authState.user?.petInfo

  // 获取精选城市数据
  const destinations = useMemo(() => {
    return selectedCities.map(cityId => mockRegionsData[cityId]).filter(Boolean)
  }, [])

  const handleCitySelect = (cityId: string) => {
    const selectedCity = mockRegionsData[cityId]
    if (!selectedCity) {
      toast.error(language === 'zh' ? '城市数据未找到' : 'City data not found')
      return
    }

    const isCenter = citySlots[cityId] === 'center'

    if (isCenter) {
      // 确认操作：如果点击的城市已经在中间，则导航
      toast.success(
        `${language === 'zh' ? '准备出发！' : 'Ready to go!'}`,
        {
          duration: 1500,
          position: 'top-center',
        }
      )
  
      // 延迟跳转，让用户看到选择效果
      setTimeout(() => {
        navigate(`/trip-themes/${cityId}`)
      }, 1000)

    } else {
      // 选择操作：将点击的城市移动到中心
      const currentCenterCityId = Object.keys(citySlots).find(key => citySlots[key] === 'center')!
      const clickedCitySlot = citySlots[cityId]

      // 交换位置
      setCitySlots(prev => ({
        ...prev,
        [currentCenterCityId]: clickedCitySlot,
        [cityId]: 'center'
      }))
      
      // 更新当前选中的城市ID
      setSelectedCityId(cityId)
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
            {selectedCityId && mockRegionsData[selectedCityId] && (
              <div className="inline-block mt-2">
                <div className="px-5 py-1.5 bg-green-600/90 text-white rounded-full text-md font-semibold shadow-lg">
                  {language === 'zh' ? mockRegionsData[selectedCityId].name : mockRegionsData[selectedCityId].nameEn}
                </div>
              </div>
            )}
          </div>

          {/* 城市选择布局 */}
          <div className="relative w-full flex-grow mb-20">
            {destinations.map((destination) => {
              const slotName = citySlots[destination.id]
              if (!slotName) return null

              const styles = slotStyles[slotName]
              const isCenter = slotName === 'center'
              
              return (
                <div
                  key={destination.id}
                  className="absolute cursor-pointer transition-all duration-700 ease-in-out transform-gpu"
                  style={{
                    ...styles,
                    width: isCenter ? '320px' : '280px',
                    height: isCenter ? '320px' : '280px',
                    transform: 'translate(-50%, -50%)',
                    filter: isCenter ? 'none' : 'saturate(0.7) blur(1px)',
                    opacity: isCenter ? 1 : 0.6,
                  }}
                  onClick={() => handleCitySelect(destination.id)}
                >
                  <img
                    src={cityImages[destination.id] || '/city-images/杭州.jpg'}
                    alt={language === 'zh' ? destination.name : destination.nameEn}
                    className="w-full h-full object-contain drop-shadow-xl hover:drop-shadow-2xl transition-all"
                  />
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