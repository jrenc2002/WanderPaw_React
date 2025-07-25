import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { petInfoAtom } from '@/store/PetState'
import { currentTripPlanAtom, createTripPlan, startTripAtom } from '@/store/TripState'
import type { TripActivity } from '@/store/TripState'
import { mockRegionsData } from '@/data/mockData'
import { WarmBg } from '@/components/bg/WarmBg'
import DashedCard from '@/components/common/DashedCard'
import { generateRealisticCityActivities } from '@/utils/tripDataGenerator'
import toast from 'react-hot-toast'

const generateActivitiesForThemes = (themes: string[], cityName: string): Omit<TripActivity, 'coordinates' | 'status'>[] => {
  const themeActivities: Record<string, Omit<TripActivity, 'coordinates' | 'status'>[]> = {
    photography: [
      {
        id: 'photo-1',
        time: '08:30',
        title: '晨光咖啡馆打卡',
        titleEn: 'Morning Coffee Cafe Check-in',
        location: '老城区咖啡街',
        locationEn: 'Old town coffee street',
        theme: 'photography',
        duration: 60,
        description: '捕捉晨光中的温暖咖啡时光',
        descriptionEn: 'Capture warm coffee moments in morning light'
      },
      {
        id: 'photo-2',
        time: '10:00',
        title: '街头艺术涂鸦墙',
        titleEn: 'Street Art Graffiti Wall',
        location: '创意街区',
        locationEn: 'Creative district',
        theme: 'photography',
        duration: 90,
        description: '在色彩斑斓的涂鸦墙前拍照',
        descriptionEn: 'Photography at colorful graffiti walls'
      },
      {
        id: 'photo-3',
        time: '14:00',
        title: '复古书店拍摄',
        titleEn: 'Vintage Bookstore Shoot',
        location: '独立书店咖啡角',
        locationEn: 'Independent bookstore cafe corner',
        theme: 'photography',
        duration: 75,
        description: '在书香中记录文艺瞬间',
        descriptionEn: 'Capture literary moments among books'
      },
      {
        id: 'photo-4',
        time: '16:30',
        title: '黄昏市集记录',
        titleEn: 'Sunset Market Documentation',
        location: '传统夜市入口',
        locationEn: 'Traditional night market entrance',
        theme: 'photography',
        duration: 90,
        description: '记录市井生活的真实美好',
        descriptionEn: 'Document authentic beauty of local life'
      },
      {
        id: 'photo-5',
        time: '18:30',
        title: '城市天际线',
        titleEn: 'City Skyline',
        location: '观景台',
        locationEn: 'Observation deck',
        theme: 'photography',
        duration: 60,
        description: '拍摄城市最美的天际线',
        descriptionEn: 'Capture the most beautiful city skyline'
      }
    ],
    food: [
      {
        id: 'food-1',
        time: '09:00',
        title: '传统早餐体验',
        titleEn: 'Traditional Breakfast Experience',
        location: '当地早餐店',
        locationEn: 'Local breakfast shop',
        theme: 'food',
        duration: 60,
        description: '品尝最地道的当地早餐',
        descriptionEn: 'Taste the most authentic local breakfast'
      },
      {
        id: 'food-2',
        time: '12:00',
        title: '特色餐厅午餐',
        titleEn: 'Specialty Restaurant Lunch',
        location: '老城区美食街',
        locationEn: 'Old town food street',
        theme: 'food',
        duration: 90,
        description: '享用当地招牌菜品',
        descriptionEn: 'Enjoy local signature dishes'
      },
      {
        id: 'food-3',
        time: '15:30',
        title: '手工甜品店',
        titleEn: 'Handmade Dessert Shop',
        location: '甜品工坊',
        locationEn: 'Dessert workshop',
        theme: 'food',
        duration: 45,
        description: '品尝精致手工甜品',
        descriptionEn: 'Taste exquisite handmade desserts'
      },
      {
        id: 'food-4',
        time: '18:00',
        title: '街边小食探索',
        titleEn: 'Street Food Exploration',
        location: '夜市美食区',
        locationEn: 'Night market food area',
        theme: 'food',
        duration: 120,
        description: '深度体验街头美食文化',
        descriptionEn: 'Deep experience of street food culture'
      },
      {
        id: 'food-5',
        time: '20:30',
        title: '特色酒吧小酌',
        titleEn: 'Specialty Bar Drinks',
        location: '精酿酒吧',
        locationEn: 'Craft beer bar',
        theme: 'food',
        duration: 90,
        description: '品尝当地特色饮品',
        descriptionEn: 'Taste local specialty beverages'
      }
    ],
    culture: [
      {
        id: 'culture-1',
        time: '09:30',
        title: '历史博物馆探索',
        titleEn: 'History Museum Exploration',
        location: `${cityName}历史博物馆`,
        locationEn: `${cityName} History Museum`,
        theme: 'culture',
        duration: 150,
        description: '深入了解当地历史文脉',
        descriptionEn: 'Learn about local historical context'
      },
      {
        id: 'culture-2',
        time: '13:00',
        title: '传统手工艺体验',
        titleEn: 'Traditional Handicraft Experience',
        location: '手工艺体验馆',
        locationEn: 'Handicraft experience center',
        theme: 'culture',
        duration: 120,
        description: '亲手制作传统工艺品',
        descriptionEn: 'Hands-on traditional craft making'
      },
      {
        id: 'culture-3',
        time: '15:30',
        title: '古建筑群漫步',
        titleEn: 'Historic Architecture Walk',
        location: '古建筑保护区',
        locationEn: 'Historic architecture district',
        theme: 'culture',
        duration: 90,
        description: '感受建筑艺术的魅力',
        descriptionEn: 'Feel the charm of architectural art'
      },
      {
        id: 'culture-4',
        time: '17:30',
        title: '当地民俗表演',
        titleEn: 'Local Folk Performance',
        location: '文化广场',
        locationEn: 'Cultural square',
        theme: 'culture',
        duration: 75,
        description: '观赏传统民俗表演',
        descriptionEn: 'Watch traditional folk performances'
      },
      {
        id: 'culture-5',
        time: '19:30',
        title: '文化夜游',
        titleEn: 'Cultural Night Tour',
        location: '历史街区',
        locationEn: 'Historic district',
        theme: 'culture',
        duration: 90,
        description: '夜晚的文化街区别有韵味',
        descriptionEn: 'Historic district has unique charm at night'
      }
    ],
    nature: [
      {
        id: 'nature-1',
        time: '07:00',
        title: '日出观赏',
        titleEn: 'Sunrise Viewing',
        location: '观日台',
        locationEn: 'Sunrise viewing platform',
        theme: 'nature',
        duration: 90,
        description: '迎接第一缕阳光',
        descriptionEn: 'Welcome the first ray of sunlight'
      },
      {
        id: 'nature-2',
        time: '09:30',
        title: '城市公园晨练',
        titleEn: 'City Park Morning Exercise',
        location: '中央公园',
        locationEn: 'Central Park',
        theme: 'nature',
        duration: 75,
        description: '在自然中开始活力一天',
        descriptionEn: 'Start an energetic day in nature'
      },
      {
        id: 'nature-3',
        time: '14:00',
        title: '植物园探秘',
        titleEn: 'Botanical Garden Discovery',
        location: '市植物园',
        locationEn: 'City botanical garden',
        theme: 'nature',
        duration: 120,
        description: '探索丰富的植物世界',
        descriptionEn: 'Explore the rich plant world'
      },
      {
        id: 'nature-4',
        time: '16:30',
        title: '湖边休憩',
        titleEn: 'Lakeside Rest',
        location: '湖心公园',
        locationEn: 'Lakeside Park',
        theme: 'nature',
        duration: 90,
        description: '在湖边感受宁静时光',
        descriptionEn: 'Feel peaceful moments by the lake'
      },
      {
        id: 'nature-5',
        time: '18:30',
        title: '日落观景',
        titleEn: 'Sunset Viewing',
        location: '山顶观景台',
        locationEn: 'Mountaintop viewing platform',
        theme: 'nature',
        duration: 60,
        description: '欣赏最美的日落景色',
        descriptionEn: 'Enjoy the most beautiful sunset views'
      }
    ],
    nightlife: [
      {
        id: 'night-1',
        time: '20:00',
        title: '夜市探索',
        titleEn: 'Night Market Exploration',
        location: '夜生活街区',
        locationEn: 'Nightlife district',
        theme: 'nightlife',
        duration: 120,
        description: '感受夜晚的热闹氛围',
        descriptionEn: 'Feel the lively nighttime atmosphere'
      },
      {
        id: 'night-2',
        time: '22:30',
        title: '音乐酒吧体验',
        titleEn: 'Music Bar Experience',
        location: '现场音乐酒吧',
        locationEn: 'Live music bar',
        theme: 'nightlife',
        duration: 90,
        description: '享受现场音乐的魅力',
        descriptionEn: 'Enjoy the charm of live music'
      }
    ],
    shopping: [
      {
        id: 'shop-1',
        time: '10:30',
        title: '当地特产市场',
        titleEn: 'Local Specialty Market',
        location: '传统市场',
        locationEn: 'Traditional market',
        theme: 'shopping',
        duration: 90,
        description: '寻找独特的当地特产',
        descriptionEn: 'Find unique local specialties'
      },
      {
        id: 'shop-2',
        time: '14:00',
        title: '购物中心探索',
        titleEn: 'Shopping Mall Exploration',
        location: '市中心购物区',
        locationEn: 'Downtown shopping district',
        theme: 'shopping',
        duration: 150,
        description: '购买心仪的纪念品',
        descriptionEn: 'Buy favorite souvenirs'
      },
      {
        id: 'shop-3',
        time: '17:00',
        title: '创意市集',
        titleEn: 'Creative Market',
        location: '文创园区',
        locationEn: 'Creative park',
        theme: 'shopping',
        duration: 90,
        description: '发现独特的创意商品',
        descriptionEn: 'Discover unique creative products'
      }
    ],
    adventure: [
      {
        id: 'adventure-1',
        time: '08:00',
        title: '户外徒步挑战',
        titleEn: 'Outdoor Hiking Challenge',
        location: '自然步道',
        locationEn: 'Nature trail',
        theme: 'adventure',
        duration: 180,
        description: '挑战体能极限，亲近自然',
        descriptionEn: 'Challenge physical limits, get close to nature'
      },
      {
        id: 'adventure-2',
        time: '13:30',
        title: '水上运动体验',
        titleEn: 'Water Sports Experience',
        location: '水上运动中心',
        locationEn: 'Water sports center',
        theme: 'adventure',
        duration: 150,
        description: '体验刺激的水上活动',
        descriptionEn: 'Experience thrilling water activities'
      },
      {
        id: 'adventure-3',
        time: '16:30',
        title: '攀岩体验',
        titleEn: 'Rock Climbing Experience',
        location: '攀岩馆',
        locationEn: 'Climbing gym',
        theme: 'adventure',
        duration: 120,
        description: '挑战垂直高度的勇气',
        descriptionEn: 'Challenge the courage of vertical heights'
      }
    ],
    relaxation: [
      {
        id: 'relax-1',
        time: '10:00',
        title: '温泉养生',
        titleEn: 'Hot Spring Wellness',
        location: '温泉度假村',
        locationEn: 'Hot spring resort',
        theme: 'relaxation',
        duration: 150,
        description: '在温泉中放松身心',
        descriptionEn: 'Relax body and mind in hot springs'
      },
      {
        id: 'relax-2',
        time: '14:30',
        title: 'SPA理疗体验',
        titleEn: 'SPA Therapy Experience',
        location: '高端SPA会所',
        locationEn: 'Premium SPA center',
        theme: 'relaxation',
        duration: 120,
        description: '享受专业的理疗服务',
        descriptionEn: 'Enjoy professional therapy services'
      },
      {
        id: 'relax-3',
        time: '17:30',
        title: '冥想瑜伽',
        titleEn: 'Meditation Yoga',
        location: '瑜伽馆',
        locationEn: 'Yoga studio',
        theme: 'relaxation',
        duration: 90,
        description: '通过瑜伽找回内心平静',
        descriptionEn: 'Find inner peace through yoga'
      }
    ]
  }

  const activities: Omit<TripActivity, 'coordinates' | 'status'>[] = []
  themes.forEach(theme => {
    if (themeActivities[theme]) {
      activities.push(...themeActivities[theme])
    }
  })

  // 如果只有一个主题但活动少于6个，从其他主题补充
  if (themes.length === 1 && activities.length < 6) {
    const otherThemes = Object.keys(themeActivities).filter(t => !themes.includes(t))
    const shuffledOtherThemes = otherThemes.sort(() => Math.random() - 0.5)
    
    for (const otherTheme of shuffledOtherThemes) {
      if (activities.length >= 8) break
      const otherActivities = themeActivities[otherTheme].slice(0, 2)
      activities.push(...otherActivities)
    }
  }

  return activities.sort((a, b) => a.time.localeCompare(b.time)).slice(0, 8)
}

const TripPlanView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [petInfo] = useAtom(petInfoAtom)
  const [_currentTripPlan, setCurrentTripPlan] = useAtom(currentTripPlanAtom)
  const [, startTrip] = useAtom(startTripAtom)
  const [activities, setActivities] = useState<Omit<TripActivity, 'coordinates' | 'status'>[]>([])
  const [cityData, setCityData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const tripPlan = location.state?.tripPlan

  useEffect(() => {
    if (tripPlan) {
      const city = mockRegionsData[tripPlan.cityId]
      setCityData(city)
      
      setIsGenerating(true)
      
      // 优先使用真实城市数据，否则使用默认生成器
      const realisticActivities = generateRealisticCityActivities(
        tripPlan.cityId, 
        tripPlan.themes, 
        language
      )
      
      if (realisticActivities.length > 0) {
        setActivities(realisticActivities)
      } else {
        // 回退到默认生成器
        const cityName = language === 'zh' ? city?.name : city?.nameEn
        const generatedActivities = generateActivitiesForThemes(tripPlan.themes, cityName || '')
        setActivities(generatedActivities)
      }
      
      setIsGenerating(false)
    }
  }, [tripPlan, language])

  const handleStartTrip = () => {
    if (!cityData || !activities.length) {
      toast.error(language === 'zh' ? '计划数据不完整' : 'Plan data incomplete')
      return
    }

    try {
      // 创建完整的旅行计划
      const completeTripPlan = createTripPlan(
        cityData,
        tripPlan.themes,
        tripPlan.selectedThemeNames,
        activities,
        petInfo
      )

      // 保存到状态管理
      setCurrentTripPlan(completeTripPlan)
      
      // 启动旅行
      startTrip(completeTripPlan)

      toast.success(
        language === 'zh' ? '旅行计划已创建！' : 'Trip plan created!',
        {
          icon: '🎉',
          duration: 2000
        }
      )

      // 跳转到旅行进行页面
      navigate('/trip-journey')
    } catch (error) {
      console.error('Failed to create trip plan:', error)
      toast.error(
        language === 'zh' ? '创建计划失败，请重试' : 'Failed to create plan, please try again'
      )
    }
  }

  const handleRegeneratePlan = () => {
    if (!tripPlan || !cityData) return
    
    setIsGenerating(true)
    
    setTimeout(() => {
      // 重新生成活动
      const realisticActivities = generateRealisticCityActivities(
        tripPlan.cityId, 
        tripPlan.themes, 
        language
      )
      
      if (realisticActivities.length > 0) {
        setActivities(realisticActivities)
      } else {
        // 回退到默认生成器
        const cityName = language === 'zh' ? cityData?.name : cityData?.nameEn
        const generatedActivities = generateActivitiesForThemes(tripPlan.themes, cityName || '')
        setActivities(generatedActivities)
      }
      
      setIsGenerating(false)
      
      toast.success(
        language === 'zh' ? '计划已重新生成！' : 'Plan regenerated!',
        {
          icon: '🔄',
          duration: 2000
        }
      )
    }, 1000) // 模拟生成时间
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (!tripPlan || !cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" style={{ width: '2.22vw', height: '2.22vw' }}></div>
          <p className="text-gray-600">{language === 'zh' ? '生成计划中...' : 'Generating plan...'}</p>
        </div>
      </div>
    )
  }

  return (
    <WarmBg>
      <style>{`
        .activities-scroll::-webkit-scrollbar {
          width: 0.42vw;
        }
        .activities-scroll::-webkit-scrollbar-track {
          background: #F5F5F5;
          border-radius: 0.21vw;
        }
        .activities-scroll::-webkit-scrollbar-thumb {
          background: #D1BA9E;
          border-radius: 0.21vw;
        }
        .activities-scroll::-webkit-scrollbar-thumb:hover {
          background: #C7AA6C;
        }
        .trip-plan-container {
          padding: 2.22vw 1.67vw;
          max-width: 37.5vw;
          margin: 0 auto;
        }
        .main-card {
          min-height: 77.78vh;
          position: relative;
        }
        .bottom-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.11vw;
          padding-top: 1.11vw;
          border-top: 0.07vw solid #e5e7eb;
          margin-bottom: 1.11vw;
        }
        .start-button {
          padding: 0.56vw 2.22vw;
          color: white;
          border-radius: 0.90vw;
          font-weight: bold;
          font-size: 1.25vw;
          transition: all 0.2s;
          box-shadow: 0 0.28vw 0.42vw rgba(0,0,0,0.1);
          transform: scale(1);
        }
        .start-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        .start-button:disabled {
          transform: none;
        }
        .regenerate-button {
          padding: 0.56vw;
          transition: all 0.2s;
        }
        .regenerate-button:hover:not(:disabled) {
          transform: scale(1.1);
        }
        .regenerate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .regenerate-icon {
          width: 1.67vw;
          height: 1.67vw;
          transition: transform 0.2s;
        }
        .plan-title {
          font-size: 1.67vw;
          font-weight: bold;
          color: #573E23;
          margin-top: 1.11vw;
          text-align: center;
        }
        .activities-container {
          margin-top: 1.67vw;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 44.44vh);
          min-height: 44.44vh;
        }
        .activities-title {
          font-size: 1.25vw;
          font-weight: 600;
          color: #573E23;
          margin-bottom: 1.11vw;
          flex-shrink: 0;
        }
        .activities-scroll-container {
          flex: 1;
          overflow-y: auto;
          padding-right: 0.56vw;
        }
        .activities-list {
          height: 100%;
        }
        .timeline-container {
          position: relative;
        }
        .timeline-svg {
          position: absolute;
          left: 1.11vw;
          top: 0;
          z-index: 0;
          width: 2.22vw;
          height: 100%;
        }
        .timeline-line {
          stroke: #687949;
          stroke-linecap: round;
        }
        .timeline-start-circle {
          fill: #687949;
          fill-opacity: 0.22;
        }
        .timeline-center-circle {
          fill: #687949;
        }
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1.67vw;
          margin-bottom: 1.67vw;
        }
        .activity-time {
          flex-shrink: 0;
          width: 4.44vw;
          padding-top: 1.67vw;
        }
        .activity-time-text {
          font-size: 0.97vw;
          font-weight: bold;
          color: #687949;
          text-align: center;
        }
        .activity-dot {
          position: absolute;
          left: 0.83vw;
          width: 0.56vw;
          height: 0.56vw;
          background: #687949;
          border-radius: 50%;
        }
        .activity-card {
          flex: 1;
          padding: 1.39vw;
          transition: all 0.2s;
          border-radius: 2.08vw;
          background: #FDF9EF;
          box-shadow: 0 0.56vw 3.17vw 0.83vw rgba(123, 66, 15, 0.11);
        }
        .activity-card:hover {
          transform: scale(1.02);
        }
        .activity-content {
          display: flex;
          align-items: flex-start;
          gap: 1.11vw;
        }
        .activity-icon {
          width: 3.33vw;
          height: 3.33vw;
          background: #dcfce7;
          border-radius: 0.83vw;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .activity-icon-inner {
          width: 2.22vw;
          height: 1.67vw;
          background: #bbf7d0;
          border-radius: 0.14vw;
          position: relative;
        }
        .activity-icon-dot1 {
          position: absolute;
          top: 0;
          left: 0.28vw;
          width: 0.56vw;
          height: 0.28vw;
          background: #4ade80;
          border-radius: 50%;
        }
        .activity-icon-dot2 {
          position: absolute;
          top: 0.28vw;
          right: 0.28vw;
          width: 0.28vw;
          height: 0.28vw;
          background: #f87171;
          border-radius: 50%;
        }
        .activity-icon-line1 {
          position: absolute;
          bottom: 0.28vw;
          left: 0.56vw;
          width: 0.83vw;
          height: 0.14vw;
          background: #60a5fa;
          border-radius: 0.07vw;
        }
        .activity-icon-line2 {
          position: absolute;
          top: 0.56vw;
          left: 0;
          width: 0.56vw;
          height: 0.14vw;
          background: #fbbf24;
          border-radius: 0.07vw;
        }
        .activity-text {
          flex: 1;
          min-width: 0;
        }
        .activity-title {
          font-weight: bold;
          color: #573E23;
          margin-bottom: 0.28vw;
          font-size: 1.25vw;
        }
        .activity-location {
          font-size: 0.97vw;
          color: #687949;
          margin-bottom: 0.56vw;
          font-weight: 500;
        }
        .activity-description {
          font-size: 0.97vw;
          color: #6b7280;
          line-height: 1.5;
        }
        .activity-duration {
          font-size: 0.97vw;
          color: #C7AA6C;
          margin-top: 0.56vw;
          font-weight: 600;
        }
        .loading-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .loading-content {
          text-align: center;
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
          width: 2.22vw;
          height: 2.22vw;
          border: 0.28vw solid #C7AA6C;
          border-top-color: transparent;
          border-radius: 50%;
          margin: 0 auto 1.11vw;
        }
        .loading-text {
          color: #6b7280;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="trip-plan-container">
        <DashedCard 
          width="100%" 
          style={{ 
            minHeight: '77.78vh',
            position: 'relative'
          }}
          bottomElement={
            <div className="bottom-buttons">
              <button
                onClick={handleStartTrip}
                disabled={isGenerating || !activities.length}
                className={`start-button ${
                  !isGenerating && activities.length
                    ? 'bg-gradient-to-r from-[#687949] to-[#687949] hover:from-[#C7AA6C] hover:to-[#C7AA6C]' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                }`}
              >
                {language === 'zh' ? '开始旅程' : 'Start Journey'}
              </button>
              
              <button
                onClick={handleRegeneratePlan}
                disabled={isGenerating}
                className="regenerate-button"
                title={language === 'zh' ? '重新生成计划' : 'Regenerate plan'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none" className="regenerate-icon">
                  <path d="M42 9.3V17.7C42 18.6 41.7 19.2 41.1 19.8C40.5 20.4 39.6 20.7 39 20.7H30.6C29.7 20.7 29.1 20.4 28.5 19.8C27.3 18.6 27.3 16.8 28.5 15.6C29.1 15 29.7 14.7 30.6 14.7H31.8C29.4 12.9 27 12 24.3 12C20.7 12 17.7 13.2 15.6 15.6C14.4 16.8 12.6 16.8 11.4 15.6C10.2 14.4 10.2 12.6 11.4 11.4C14.7 8.1 19.2 6 24.3 6C28.8 6 33 7.8 36 10.5V9.3C36 8.4 36.3 7.8 36.9 7.2C38.1 6 39.9 6 41.1 7.2C41.7 7.5 42 8.4 42 9.3ZM19.5 32.4C18.9 33 18 33.3 17.4 33.3H16.5C18.6 35.1 21 36 23.7 36C27 36 30 34.8 32.1 32.4C33.3 31.2 35.1 31.2 36.3 32.4C37.5 33.6 37.5 35.4 36.3 36.6C33.3 39.9 28.8 42 23.7 42C19.2 42 15 40.2 12 37.5V39C12 39.9 11.7 40.5 11.1 41.1C9.9 42.3 8.1 42.3 6.9 41.1C6.3 40.5 6 39.6 6 38.7V30.3C6 29.4 6.3 28.8 6.9 28.2C7.5 27.6 8.1 27.3 9 27.3H17.4C18.3 27.3 18.9 27.6 19.5 28.2C20.7 29.4 20.7 31.2 19.5 32.4Z" fill="#C7AA6C"/>
                </svg>
              </button>
            </div>
          }
        >
          <h2 className="plan-title">
            {language === 'zh' 
              ? `${petInfo.type === 'cat' ? '猫咪' : petInfo.type === 'dog' ? '狗狗' : '仓鼠'}的探索计划` 
              : `${petInfo.type === 'cat' ? 'Cat' : petInfo.type === 'dog' ? 'Dog' : 'Hamster'} Exploration Plan`
            }
          </h2>
          
          

          {/* 活动列表部分 */}
          <div className="activities-container">
            <h3 className="activities-title">
              {language === 'zh' ? '今日计划' : 'Today\'s Plan'}
            </h3>
            
            {/* 固定高度的活动容器 */}
            <div className="activities-scroll-container">
                {isGenerating ? (
                  <div className="loading-container">
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      <p className="loading-text">{language === 'zh' ? '生成计划中...' : 'Generating plan...'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="activities-list">
                <div className="timeline-container">
                  {/* 左侧时间线SVG背景 */}
                  <div className="timeline-svg" style={{ height: `${activities.length * 13.33}vh` }}>
                    <svg width="32" height="100%" viewBox="0 0 32 238" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full">
                      <line x1="16.5" y1="48.5" x2="16.5" y2="100%" className="timeline-line"/>
                      <path d="M16 0C7.13846 0 0 7.13846 0 16C0 24.8615 7.13846 32 16 32C24.8615 32 32 24.8615 32 16C32 7.13846 24.8615 0 16 0ZM16 29.5385C8.49231 29.5385 2.46154 23.5077 2.46154 16C2.46154 8.49231 8.49231 2.46154 16 2.46154C23.5077 2.46154 29.5385 8.49231 29.5385 16C29.5385 23.5077 23.5077 29.5385 16 29.5385Z" className="timeline-start-circle"/>
                      <circle cx="16" cy="16" r="9" className="timeline-center-circle"/>
                    </svg>
                  </div>

                  <div style={{ position: 'relative', zIndex: 10 }}>
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="activity-item">
                        {/* 时间显示 */}
                        <div className="activity-time">
                          <div className="activity-time-text">
                            {activity.time}
                          </div>
                          {/* 在每个时间点添加一个小圆点标记 */}
                          {index > 0 && (
                            <div className="activity-dot" style={{ top: `${index * 13.33 + 2.67}vh` }}></div>
                          )}
                        </div>
                        
                        {/* 活动内容卡片 */}
                        <div className="activity-card">
                          <div className="activity-content">
                            <div className="activity-icon">
                              <div className="activity-icon-inner">
                                <div className="activity-icon-dot1"></div>
                                <div className="activity-icon-dot2"></div>
                                <div className="activity-icon-line1"></div>
                                <div className="activity-icon-line2"></div>
                              </div>
                            </div>
                            
                            <div className="activity-text">
                              <h4 className="activity-title">
                                {language === 'zh' ? activity.title : activity.titleEn}
                              </h4>
                              <p className="activity-location">
                                {language === 'zh' ? activity.location : activity.locationEn}
                              </p>
                              <p className="activity-description">
                                {language === 'zh' ? activity.description : activity.descriptionEn}
                              </p>
                              <p className="activity-duration">
                                {language === 'zh' ? `预计 ${activity.duration} 分钟` : `Est. ${activity.duration} min`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                )}
              </div>
            </div>
        </DashedCard>
      </div>
    </WarmBg>
  )
}

export default TripPlanView 