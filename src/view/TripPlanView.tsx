import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { mockRegionsData } from '@/data/mockData'
import { WarmBg } from '@/components/bg/WarmBg'
import toast from 'react-hot-toast'

interface TripActivity {
  id: string
  time: string
  title: string
  titleEn: string
  location: string
  locationEn: string
  theme: string
  duration: number
  description: string
  descriptionEn: string
}

const generateActivitiesForThemes = (themes: string[], cityName: string): TripActivity[] => {
  const themeActivities: Record<string, TripActivity[]> = {
    photography: [
      {
        id: 'photo-1',
        time: '15:00',
        title: '打卡爵士乐咖啡馆',
        titleEn: 'Jazz Cafe Check-in',
        location: '在小巷中喝咖啡',
        locationEn: 'Coffee in a small alley',
        theme: 'photography',
        duration: 90,
        description: '在复古爵士乐氛围中拍照',
        descriptionEn: 'Photography in vintage jazz atmosphere'
      },
      {
        id: 'photo-2',
        time: '17:00',
        title: '文艺书店打卡',
        titleEn: 'Bookstore Photo Session',
        location: '独立书店咖啡角',
        locationEn: 'Independent bookstore cafe corner',
        theme: 'photography',
        duration: 60,
        description: '在书香中记录美好瞬间',
        descriptionEn: 'Capture beautiful moments among books'
      }
    ],
    food: [
      {
        id: 'food-1',
        time: '12:00',
        title: '当地特色餐厅',
        titleEn: 'Local Specialty Restaurant',
        location: '老城区美食街',
        locationEn: 'Old town food street',
        theme: 'food',
        duration: 90,
        description: '品尝最正宗的当地美食',
        descriptionEn: 'Taste authentic local cuisine'
      },
      {
        id: 'food-2',
        time: '16:30',
        title: '下午茶时光',
        titleEn: 'Afternoon Tea Time',
        location: '精品茶室',
        locationEn: 'Boutique tea house',
        theme: 'food',
        duration: 60,
        description: '享受悠闲的下午茶时光',
        descriptionEn: 'Enjoy relaxing afternoon tea'
      }
    ],
    culture: [
      {
        id: 'culture-1',
        time: '10:00',
        title: '历史博物馆参观',
        titleEn: 'History Museum Visit',
        location: `${cityName}历史博物馆`,
        locationEn: `${cityName} History Museum`,
        theme: 'culture',
        duration: 120,
        description: '深入了解当地历史文化',
        descriptionEn: 'Learn about local history and culture'
      },
      {
        id: 'culture-2',
        time: '14:30',
        title: '传统文化街区',
        titleEn: 'Traditional Cultural District',
        location: '古建筑群',
        locationEn: 'Historic architecture complex',
        theme: 'culture',
        duration: 90,
        description: '漫步在历史悠久的街道',
        descriptionEn: 'Stroll through historic streets'
      }
    ],
    nature: [
      {
        id: 'nature-1',
        time: '08:00',
        title: '城市公园晨跑',
        titleEn: 'City Park Morning Run',
        location: '中央公园',
        locationEn: 'Central Park',
        theme: 'nature',
        duration: 60,
        description: '在自然中开始美好一天',
        descriptionEn: 'Start a beautiful day in nature'
      },
      {
        id: 'nature-2',
        time: '18:00',
        title: '湖边日落漫步',
        titleEn: 'Lakeside Sunset Walk',
        location: '湖心公园',
        locationEn: 'Lakeside Park',
        theme: 'nature',
        duration: 90,
        description: '欣赏美丽的日落景色',
        descriptionEn: 'Enjoy beautiful sunset views'
      }
    ],
    nightlife: [
      {
        id: 'night-1',
        time: '21:00',
        title: '酒吧街体验',
        titleEn: 'Bar Street Experience',
        location: '夜生活酒吧街',
        locationEn: 'Nightlife bar street',
        theme: 'nightlife',
        duration: 120,
        description: '感受夜晚的活力',
        descriptionEn: 'Feel the nighttime energy'
      }
    ],
    shopping: [
      {
        id: 'shop-1',
        time: '14:00',
        title: '购物中心逛街',
        titleEn: 'Shopping Mall Tour',
        location: '市中心购物区',
        locationEn: 'Downtown shopping district',
        theme: 'shopping',
        duration: 150,
        description: '寻找独特的纪念品',
        descriptionEn: 'Find unique souvenirs'
      }
    ],
    adventure: [
      {
        id: 'adventure-1',
        time: '09:30',
        title: '户外探险活动',
        titleEn: 'Outdoor Adventure Activity',
        location: '冒险乐园',
        locationEn: 'Adventure park',
        theme: 'adventure',
        duration: 180,
        description: '挑战自我极限',
        descriptionEn: 'Challenge your limits'
      }
    ],
    relaxation: [
      {
        id: 'relax-1',
        time: '11:00',
        title: '温泉养生体验',
        titleEn: 'Hot Spring Wellness',
        location: '温泉度假村',
        locationEn: 'Hot spring resort',
        theme: 'relaxation',
        duration: 120,
        description: '放松身心，享受宁静',
        descriptionEn: 'Relax and enjoy tranquility'
      }
    ]
  }

  let activities: TripActivity[] = []
  themes.forEach(theme => {
    if (themeActivities[theme]) {
      activities.push(...themeActivities[theme])
    }
  })

  return activities.sort((a, b) => a.time.localeCompare(b.time))
}

const TripPlanView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [activities, setActivities] = useState<TripActivity[]>([])
  const [cityData, setCityData] = useState<any>(null)
  
  const tripPlan = location.state?.tripPlan

  useEffect(() => {
    if (tripPlan) {
      const city = mockRegionsData[tripPlan.cityId]
      setCityData(city)
      
      const cityName = language === 'zh' ? city?.name : city?.nameEn
      const generatedActivities = generateActivitiesForThemes(tripPlan.themes, cityName || '')
      setActivities(generatedActivities)
    }
  }, [tripPlan, language])

  const handleStartTrip = () => {
    // 跳转到旅行进行页面，传递旅行计划数据
    navigate('/trip-journey', { 
      state: { 
        tripPlan,
        activities 
      } 
    })
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (!tripPlan || !cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'zh' ? '生成计划中...' : 'Generating plan...'}</p>
        </div>
      </div>
    )
  }

  return (
    <WarmBg>
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
          {language === 'zh' ? '旅行计划' : 'Trip Plan'}
        </h1>
        
        <div className="w-16"></div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="relative bg-amber-50 rounded-3xl p-6 border-2 border-dashed border-amber-200 shadow-lg">
          <div className="absolute -top-4 -right-2 w-8 h-12 bg-green-400 rounded-full transform rotate-12 opacity-80"></div>
          <div className="absolute -top-2 right-0 w-6 h-8 bg-green-500 rounded-full transform -rotate-12"></div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'zh' 
                ? `${cityData.name}的探索计划` 
                : `${cityData.nameEn} Exploration Plan`
              }
            </h2>
            <p className="text-gray-600 text-sm">
              {language === 'zh' 
                ? `${tripPlan.themes.length}个主题 · ${activities.length}个活动` 
                : `${tripPlan.themes.length} themes · ${activities.length} activities`
              }
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-700">
                      {activity.time}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          {/* 简化的地图图标 */}
                          <div className="w-8 h-6 bg-green-200 rounded-sm relative">
                            <div className="absolute top-0 left-1 w-2 h-1 bg-green-400 rounded-full"></div>
                            <div className="absolute top-1 right-1 w-1 h-1 bg-red-400 rounded-full"></div>
                            <div className="absolute bottom-1 left-2 w-3 h-0.5 bg-blue-300 rounded"></div>
                            <div className="absolute top-2 left-0 w-2 h-0.5 bg-yellow-400 rounded"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                            {language === 'zh' ? activity.title : activity.titleEn}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                            {language === 'zh' ? activity.location : activity.locationEn}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {language === 'zh' ? activity.description : activity.descriptionEn}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 group-hover:text-gray-600 transition-colors">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleStartTrip}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <span>{language === 'zh' ? '开始旅程' : 'Start Journey'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </WarmBg>
  )
}

export default TripPlanView 