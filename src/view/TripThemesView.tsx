import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { mockRegionsData } from '@/data/mockData'
import { WarmBg } from '@/components/bg/WarmBg'
import type { TripTheme } from '@/store/TripState'
import toast from 'react-hot-toast'

const tripThemes: TripTheme[] = [
  {
    id: 'photography',
    name: '拍照打卡',
    nameEn: 'Photography',
    icon: '📸',
    description: '发现最美的拍照地点，记录美好瞬间',
    descriptionEn: 'Discover beautiful photo spots and capture perfect moments',
    gradient: 'from-pink-400 to-purple-500',
    popularity: 95
  },
  {
    id: 'food',
    name: '美食探索',
    nameEn: 'Food Adventure',
    icon: '🍜',
    description: '品尝当地特色美食，体验舌尖上的旅行',
    descriptionEn: 'Taste local cuisine and experience culinary delights',
    gradient: 'from-orange-400 to-red-500',
    popularity: 88
  },
  {
    id: 'culture',
    name: '文化体验',
    nameEn: 'Cultural Experience',
    icon: '🏛️',
    description: '深入了解当地文化和历史传统',
    descriptionEn: 'Immerse yourself in local culture and traditions',
    gradient: 'from-blue-400 to-indigo-500',
    popularity: 82
  },
  {
    id: 'nature',
    name: '自然风光',
    nameEn: 'Nature & Scenery',
    icon: '🏔️',
    description: '探索自然美景，享受大自然的宁静',
    descriptionEn: 'Explore natural beauty and enjoy peaceful landscapes',
    gradient: 'from-green-400 to-emerald-500',
    popularity: 90
  },
  {
    id: 'nightlife',
    name: '夜生活',
    nameEn: 'Nightlife',
    icon: '🌃',
    description: '体验丰富多彩的夜生活和娱乐活动',
    descriptionEn: 'Experience vibrant nightlife and entertainment',
    gradient: 'from-purple-400 to-pink-500',
    popularity: 75
  },
  {
    id: 'shopping',
    name: '购物天堂',
    nameEn: 'Shopping',
    icon: '🛍️',
    description: '发现独特商品，享受购物乐趣',
    descriptionEn: 'Discover unique items and enjoy shopping experiences',
    gradient: 'from-yellow-400 to-orange-500',
    popularity: 70
  },
  {
    id: 'adventure',
    name: '冒险体验',
    nameEn: 'Adventure',
    icon: '🎢',
    description: '寻求刺激，挑战自我极限',
    descriptionEn: 'Seek thrills and challenge your limits',
    gradient: 'from-red-400 to-pink-500',
    popularity: 65
  },
  {
    id: 'relaxation',
    name: '休闲放松',
    nameEn: 'Relaxation',
    icon: '🧘‍♀️',
    description: '放松身心，享受悠闲时光',
    descriptionEn: 'Relax and enjoy peaceful moments',
    gradient: 'from-teal-400 to-cyan-500',
    popularity: 85
  }
]

const TripThemesView: React.FC = () => {
  const navigate = useNavigate()
  const { cityId } = useParams<{ cityId: string }>()
  const [language] = useAtom(selectedLanguageAtom)
  const [cityData, setCityData] = useState<any>(null)

  useEffect(() => {
    if (cityId) {
      const city = mockRegionsData[cityId]
      setCityData(city)
    }
  }, [cityId])

  const handleThemeSelect = (themeId: string) => {
    if (!cityData) {
      toast.error(language === 'zh' ? '城市数据未加载' : 'City data not loaded')
      return
    }

    // 创建简化的旅行计划数据，传递给计划页面
    const tripPlan = {
      cityId,
      cityName: language === 'zh' ? cityData.name : cityData.nameEn,
      themes: [themeId], // 只选择单个主题
      selectedThemeNames: [
        (() => {
          const theme = tripThemes.find(t => t.id === themeId)
          return theme ? (language === 'zh' ? theme.name : theme.nameEn) : ''
        })()
      ]
    }

    navigate('/trip-plan', { 
      state: { tripPlan } 
    })
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (!cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <WarmBg>
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
          {language === 'zh' ? '选择旅行主题' : 'Choose Trip Themes'}
        </h1>
        
        <div className="w-16"></div>
      </div>

      {/* 主要内容 */}
      <div className="px-6 py-8">
        {/* 城市信息和标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h2 className="text-2xl font-bold text-gray-800">
              {language === 'zh' ? cityData.name : cityData.nameEn}
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            {language === 'zh' 
              ? '选择您感兴趣的旅行主题，开始专属行程' 
              : 'Choose a theme that interests you to start your personalized itinerary'
            }
          </p>
        </div>

        {/* 主题网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {tripThemes.map((theme) => {
            return (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className="relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`} />
                
                {/* 流行度指示器 */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
                  🔥 {theme.popularity}%
                </div>
                
                {/* 内容 */}
                <div className="relative p-6 h-40 flex flex-col justify-between text-white">
                  <div>
                    <div className="text-3xl mb-2">{theme.icon}</div>
                    <h3 className="text-lg font-bold mb-1">
                      {language === 'zh' ? theme.name : theme.nameEn}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {language === 'zh' ? theme.description : theme.descriptionEn}
                    </p>
                  </div>
                </div>
                
              </div>
            )
          })}
        </div>

        {/* 提示文字 */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {language === 'zh' 
              ? '👆 点击任意主题开始你的专属旅程' 
              : '👆 Tap any theme to start your personalized journey'
            }
          </p>
        </div>
      </div>
    </WarmBg>
  )
}

export default TripThemesView 