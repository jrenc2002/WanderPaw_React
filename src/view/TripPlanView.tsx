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
import { TripPlanMap } from '@/components/map/TripPlanMap'
import type { GeneratedTripActivity } from '@/services/tripPlanningService'
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
  const [planTitle, setPlanTitle] = useState<string>('')
  const [planSummary, setPlanSummary] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  
  const tripPlan = location.state?.tripPlan
  const generatedPlan = location.state?.generatedPlan
  const isAiGenerated = location.state?.isAiGenerated

  useEffect(() => {
    if (tripPlan) {
      const city = mockRegionsData[tripPlan.cityId]
      setCityData(city)
      
      setIsGenerating(true)
      
      // 如果有AI生成的计划数据，优先使用
      if (isAiGenerated && generatedPlan) {
        console.log('使用AI生成的旅行计划:', generatedPlan)
        
        // 设置计划标题和摘要
        setPlanTitle(language === 'zh' ? generatedPlan.planTitle : generatedPlan.planTitleEn)
        setPlanSummary(language === 'zh' ? generatedPlan.summary : generatedPlan.summaryEn)
        
        // 转换AI生成的活动到本地格式
        const aiActivities = generatedPlan.activities.map((activity: any) => ({
          id: activity.id,
          time: activity.time,
          title: language === 'zh' ? activity.title : activity.titleEn,
          titleEn: activity.titleEn,
          location: language === 'zh' ? activity.location : activity.locationEn,
          locationEn: activity.locationEn,
          theme: activity.theme,
          duration: activity.duration,
          description: language === 'zh' ? activity.description : activity.descriptionEn,
          descriptionEn: activity.descriptionEn,
          tips: activity.tips || [] // 保留 tips 字段
        }))
        
        setActivities(aiActivities)
        
        toast.success(
          language === 'zh' 
            ? `✨ AI为您和${petInfo?.name || '小伙伴'}定制了专属旅行计划！` 
            : `✨ AI has customized an exclusive trip plan for you and ${petInfo?.name || 'buddy'}!`,
          { duration: 4000 }
        )
      } else {
        // 使用原有的生成逻辑
        const cityName = language === 'zh' ? city?.name : city?.nameEn
        const generatedActivities = generateActivitiesForThemes(tripPlan.themes, cityName || '')
        
        if (generatedActivities.length > 0) {
          setActivities(generatedActivities)
        } else {
          // 回退到真实城市数据
          const realisticActivities = generateRealisticCityActivities(
            tripPlan.cityId, 
            tripPlan.themes, 
            language
          )
          setActivities(realisticActivities)
        }
        
        // 设置默认标题
        setPlanTitle(language === 'zh' ? `${cityName}旅行计划` : `${cityName} Trip Plan`)
      }
      
      setIsGenerating(false)
    }
  }, [tripPlan, generatedPlan, isAiGenerated, language, petInfo?.name])

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
      // 优先使用丰富的mock数据重新生成活动
      const cityName = language === 'zh' ? cityData?.name : cityData?.nameEn
      const generatedActivities = generateActivitiesForThemes(tripPlan.themes, cityName || '')
      
      if (generatedActivities.length > 0) {
        setActivities(generatedActivities)
      } else {
        // 回退到真实城市数据
        const realisticActivities = generateRealisticCityActivities(
          tripPlan.cityId, 
          tripPlan.themes, 
          language
        )
        setActivities(realisticActivities)
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

  // 时间格式转换函数
  const formatTimeToAMPM = (timeString: string) => {
    // 假设输入格式是 "HH:MM" 例如 "14:30"
    const [hours] = timeString.split(':').map(Number);
    
    if (hours === 0) {
      return '12AM';
    } else if (hours === 12) {
      return '12PM';
    } else if (hours < 12) {
      return `${hours}AM`;
    } else {
      return `${hours - 12}PM`;
    }
  };

  // 转换活动数据为地图组件格式
  const convertToMapActivities = (activities: Omit<TripActivity, 'coordinates' | 'status'>[]): GeneratedTripActivity[] => {
    return activities.map(activity => ({
      ...activity,
      coordinates: undefined, // 本地活动暂时没有坐标
      tips: activity.tips || [], // 使用活动的 tips 字段
      estimatedCost: undefined,
      difficulty: 'easy' as const
    }))
  }

  // 处理活动点击
  const handleActivityClick = (activity: GeneratedTripActivity) => {
    console.log('选中活动:', activity)
    toast.success(
      `${language === 'zh' ? '选中活动' : 'Selected activity'}: ${activity.title}`,
      {
        duration: 2000,
        position: 'top-center',
      }
    )
  }

  if (!tripPlan || !cityData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite', 
            width: '2vw', 
            height: '2vw', 
            border: '0.2vw solid #3b82f6', 
            borderTop: '0.2vw solid transparent', 
            borderRadius: '50%', 
            margin: '0 auto 1vh auto' 
          }}></div>
          <p style={{ color: '#6b7280' }}>{language === 'zh' ? '生成计划中...' : 'Generating plan...'}</p>
        </div>
      </div>
    )
  }

  return (
    <WarmBg>
      {/* 返回按钮 - 左上角 */}
      <div
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#687949] bg-transparent p-2 rounded-lg cursor-pointer transform transition-transform duration-200 hover:scale-110"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>{language === 'zh' ? '返回' : 'Back'}</span>
      </div>

      {/* 左下角宠物装饰 */}
      <div className="fixed bottom-0 left-[3vh] z-0">
        <img 
          src={
            petInfo.type === 'cat' ? "/decorations/cat.png" :
            petInfo.type === 'dog' ? "/decorations/fox.png" :
            "/decorations/capybara.jpeg"
          }
          alt={
            petInfo.type === 'cat' ? "Cat decoration" :
            petInfo.type === 'dog' ? "Dog decoration" :
            "Pet decoration"
          }
          className="w-[35vh] h-[35vh] object-contain transition-opacity duration-300"
        />
      </div>

      <style>{`
        .activities-scroll::-webkit-scrollbar {
          width: 0.3vw;
        }
        .activities-scroll::-webkit-scrollbar-track {
          background: #EADDC7;
          border-radius: 0.15vw;
        }
        .activities-scroll::-webkit-scrollbar-thumb {
          background: #597466;
          border-radius: 0.15vw;
        }
        .activities-scroll::-webkit-scrollbar-thumb:hover {
          background: #4a5f54;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ 
        padding: '4vh 3vw', 
        maxWidth: '40vw', 
        margin: '0 auto',
        minHeight: '100vh'
      }}>
        <div style={{ position: 'relative' }}>
          {/* 右上角夹子装饰 */}
          <img 
            src="/src/assets/%E5%A4%B9%E5%AD%90.jpg" 
            alt="Clip decoration"
            style={{
              position: 'absolute',
              top: '-4vh',
              right: '-2vw',
              width: '9vw',
              height: '9vw',
              objectFit: 'contain',
              zIndex: 20,
              transform: 'rotate(15deg)',
              filter: 'drop-shadow(0 0.2vh 0.4vh rgba(0,0,0,0.2))',
              background: 'transparent'
            }}
          />
          
          <DashedCard 
            width="100%" 
            style={{ 
              minHeight: '80vh',
              position: 'relative'
            }}
          bottomElement={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '2vw', 
              paddingTop: '2vh', 
              marginBottom: '2vh' 
            }}>
              <button
                onClick={handleStartTrip}
                disabled={isGenerating || !activities.length}
                style={{
                  padding: '1vh 4vw',
                  background: !isGenerating && activities.length
                    ? 'linear-gradient(to right, #687949, #687949)'
                    : 'linear-gradient(to right, #9ca3af, #6b7280)',
                  color: 'white',
                  borderRadius: '0.7vw',
                  fontWeight: 'bold',
                  fontSize: '1.2vw',
                  transition: 'all 0.2s',
                  boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.3)',
                  transform: !isGenerating && activities.length ? 'scale(1)' : 'none',
                  cursor: !isGenerating && activities.length ? 'pointer' : 'not-allowed',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && activities.length) {
                    e.currentTarget.style.background = 'linear-gradient(to right, #C7AA6C, #C7AA6C)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating && activities.length) {
                    e.currentTarget.style.background = 'linear-gradient(to right, #687949, #687949)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                {language === 'zh' ? '开始旅程' : 'Start Journey'}
              </button>
              
              <button
                onClick={handleRegeneratePlan}
                disabled={isGenerating}
                style={{
                  padding: '0.5vh',
                  transition: 'all 0.2s',
                  opacity: isGenerating ? 0.5 : 1,
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  border: 'none',
                  background: 'transparent'
                }}
                title={language === 'zh' ? '重新生成计划' : 'Regenerate plan'}
                onMouseEnter={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating) {
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5vw" height="1.5vw" viewBox="0 0 48 48" fill="none" style={{ transition: 'transform 0.2s' }}>
                  <path d="M42 9.3V17.7C42 18.6 41.7 19.2 41.1 19.8C40.5 20.4 39.6 20.7 39 20.7H30.6C29.7 20.7 29.1 20.4 28.5 19.8C27.3 18.6 27.3 16.8 28.5 15.6C29.1 15 29.7 14.7 30.6 14.7H31.8C29.4 12.9 27 12 24.3 12C20.7 12 17.7 13.2 15.6 15.6C14.4 16.8 12.6 16.8 11.4 15.6C10.2 14.4 10.2 12.6 11.4 11.4C14.7 8.1 19.2 6 24.3 6C28.8 6 33 7.8 36 10.5V9.3C36 8.4 36.3 7.8 36.9 7.2C38.1 6 39.9 6 41.1 7.2C41.7 7.5 42 8.4 42 9.3ZM19.5 32.4C18.9 33 18 33.3 17.4 33.3H16.5C18.6 35.1 21 36 23.7 36C27 36 30 34.8 32.1 32.4C33.3 31.2 35.1 31.2 36.3 32.4C37.5 33.6 37.5 35.4 36.3 36.6C33.3 39.9 28.8 42 23.7 42C19.2 42 15 40.2 12 37.5V39C12 39.9 11.7 40.5 11.1 41.1C9.9 42.3 8.1 42.3 6.9 41.1C6.3 40.5 6 39.6 6 38.7V30.3C6 29.4 6.3 28.8 6.9 28.2C7.5 27.6 8.1 27.3 9 27.3H17.4C18.3 27.3 18.9 27.6 19.5 28.2C20.7 29.4 20.7 31.2 19.5 32.4Z" fill="#C7AA6C"/>
                </svg>
              </button>
            </div>
          }
        >
          <div style={{ marginTop: '2vh', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '1.5vw', 
              fontWeight: 'bold', 
              color: '#573E23', 
              marginBottom: '1vh'
            }}>
              {planTitle || (language === 'zh' 
                ? `${petInfo.name || '豚豚君'}的探索计划` 
                : `${petInfo.name || 'Tonton-kun'}'s Exploration Plan`
              )}
            </h2>
            
            
          </div>
          
          

          {/* 活动列表部分 */}
          <div style={{ 
            marginTop: '3vh', 
            marginLeft: '2px',
            marginRight: '2px',
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(80vh - 20vh)', 
            minHeight: '40vh',
            position: 'relative'
          }}>
            
            
            {/* 固定高度的活动容器 */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1vw' }} className="activities-scroll">
                {isGenerating ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%' 
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        animation: 'spin 1s linear infinite', 
                        width: '2vw', 
                        height: '2vw', 
                        border: '0.2vw solid #C7AA6C', 
                        borderTop: '0.2vw solid transparent', 
                        borderRadius: '50%', 
                        margin: '0 auto 2vh auto' 
                      }}></div>
                      <p style={{ color: '#6b7280' }}>{language === 'zh' ? '生成计划中...' : 'Generating plan...'}</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: '100%' }}>
                    {/* 渲染所有活动列表 */}
                    {activities.map((activity, index) => {
                      const isLast = index === activities.length - 1

                      return (
                        <div key={activity.id} className="flex items-start gap-2 mb-4">
                          {/* 左侧：进程节点和进度线 */}
                          <div className="flex flex-col items-center ml-2">
                            {/* 进程节点 */}
                            <div className="relative">
                              <svg xmlns="http://www.w3.org/2000/svg" width="1.5vw" height="1.5vw" viewBox="0 0 41 41" fill="none">
                                <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fillOpacity="0.22"/>
                              </svg>
                              
                              {/* 圆心点 */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-[0.6vw] h-[0.6vw] bg-[#687949] rounded-full"></div>
                              </div>
                            </div>
                            
                            {/* 进度线 */}
                            {!isLast && (
                              <div 
                                className="w-[1px] h-[14vh] mt-2"
                                style={{ background: '#687949' }}
                              ></div>
                            )}
                          </div>

                          {/* 右侧：时间和卡片 */}
                          <div className="flex-1">
                            {/* 时间 */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {formatTimeToAMPM(activity.time)}
                              </span>
                            </div>

                            {/* 卡片内容 */}
                            <div 
                              className="relative p-3"
                              style={{
                                borderRadius: '0.8vw',
                                background: '#FDF9EF',
                                boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                              }}
                            >
                              {/* 上部分：头像、地点和描述 */}
                              <div className="flex items-center gap-3 m-2 relative z-10">
                                {/* 左侧头像 */}
                                <div className="w-[3.5vw] h-[3.5vw] bg-[#F4EDE0] rounded-full flex items-center flex-shrink-0 overflow-hidden">
                                  <img 
                                    src={
                                      petInfo.type === 'cat' ? '/decorations/cat1.jpeg' :
                                      petInfo.type === 'dog' ? '/decorations/fox1.jpeg' :
                                      petInfo.type === 'other' ? '/decorations/capybara1.jpeg' :
                                      '/decorations/fox1.jpeg'
                                    }
                                    alt={
                                      petInfo.type === 'cat' ? 'Cat' :
                                      petInfo.type === 'dog' ? 'Dog' :
                                      petInfo.type === 'other' ? 'Capybara' :
                                      'Pet'
                                    }
                                    className="w-[120%] h-[120%] object-cover transform -translate-x-2 scale-110"
                                  />
                                </div>
                                
                                {/* 右侧地点和心情 */}
                                <div className="flex-1 flex flex-col justify-center">
                                  {/* 地点 */}
                                  <div className="text-s font-medium text-gray-800 leading-tight mb-1">
                                    {language === 'zh' ? activity.location : activity.locationEn}
                                  </div>
                                  
                            
                                </div>
                              </div>
                              
                              {/* 分隔线 */}
                              <div className="w-[90%] h-px bg-[#BBA084] my-1 relative z-10 mx-auto"></div>
                              
                                                              {/* 下部分：正在做的事情 */}
                                <div className="flex items-center justify-between relative z-10">
                                  <div className="ml-2 my-1 text-xs text-gray-700">
                                    {language === 'zh' ? activity.description : activity.description}
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}


                  </div>
                )}
              </div>
            
            {/* 底部渐变遮罩 */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '6vh',
              background: 'linear-gradient(to bottom, rgba(253, 248, 243, 0) 0%, rgba(253, 248, 243, 0.8) 50%, rgba(253, 248, 243, 1) 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
          </div>
        </DashedCard>
        </div>
      </div>
    </WarmBg>
  )
}

export default TripPlanView 