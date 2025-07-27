import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { selectedLanguageAtom } from '@/store/MapState'

import { 
  currentTripPlanAtom, 
  tripProgressAtom, 
  petTravelStateAtom,
  currentActivityAtom,
  upcomingActivitiesAtom,
  completeCurrentActivityAtom,
  updatePetMoodAtom,
  completeTripAtom,
  clearCurrentTripAtom
} from '@/store/TripState'
import { MapboxMap } from '@/components/map/MapboxMap'
import toast from 'react-hot-toast'
import { getUnifiedButtonStyle, getSecondaryButtonStyle, handleButtonHover, handleSecondaryButtonHover } from '@/utils/buttonStyles'

const TripJourneyView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [currentTime, setCurrentTime] = useState<string>('12:45')
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false)
  const [isJournalAnimating, setIsJournalAnimating] = useState<boolean>(false)
  const [letterAnimationStage, setLetterAnimationStage] = useState<'hidden' | 'appearing' | 'disappearing' | 'reappearing' | 'final'>('hidden')
  const [hasReadLetter, setHasReadLetter] = useState<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  // 自定义虚线卡片样式已通过CSS类实现

  // 统一状态管理
  const [currentTripPlan] = useAtom(currentTripPlanAtom)
  const [tripProgress] = useAtom(tripProgressAtom)
  const [petTravelState] = useAtom(petTravelStateAtom)
  const [currentActivity] = useAtom(currentActivityAtom)
  const [, completeTrip] = useAtom(completeTripAtom)
  const [, clearCurrentTrip] = useAtom(clearCurrentTripAtom)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 检查是否有当前旅行计划
  useEffect(() => {
    if (!currentTripPlan) {
      console.log('TripJourneyView: No current trip plan, redirecting to home')
      navigate('/home')
      return
    }
    
    // 调试信息：打印旅行计划数据
    console.log('TripJourneyView: Current trip plan:', currentTripPlan)
    console.log('TripJourneyView: Trip progress:', tripProgress)
    console.log('TripJourneyView: Pet travel state:', petTravelState)
  }, [currentTripPlan, navigate])

  // 检查行程是否结束，决定是否显示信件
  useEffect(() => {
    if (currentTripPlan && (
      tripProgress.currentActivityIndex >= currentTripPlan.activities.length ||
      currentTripPlan.status === 'completed'
    )) {
      // 延迟1秒显示信件，让用户先看到"行程结束"状态
      const timer = setTimeout(() => {
        startLetterAnimation()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentTripPlan, tripProgress.currentActivityIndex])

  // 信件动画序列
  const startLetterAnimation = () => {
    // 第一阶段：从屏幕中间出现
    setLetterAnimationStage('appearing')
    
    // 1.5秒后在中间消失
    setTimeout(() => {
      setLetterAnimationStage('disappearing')
    }, 1500)
    
    // 2.5秒后在宠物右边重新出现
    setTimeout(() => {
      setLetterAnimationStage('reappearing')
    }, 2500)
    
    // 3.5秒后设置为最终状态
    setTimeout(() => {
      setLetterAnimationStage('final')
    }, 3500)
  }

  // 处理行程卡片点击 - 添加背景收回动画
  const handleTripCardClick = () => {
    if (!isTripsCompleted && letterAnimationStage === 'hidden' && !isTransitioning) {
      // 开始过渡动画
      setIsTransitioning(true)
      
      // 1.5秒后完成旅行（动画完成时）
      setTimeout(() => {
        completeTrip()
        setIsTransitioning(false)
        toast.success(
          language === 'zh' ? '行程已结束！' : 'Trip completed!',
          {
            icon: '🎉',
            duration: 2000
          }
        )
        
        // 延迟0.5秒后开始信件动画
        setTimeout(() => {
          startLetterAnimation()
        }, 500)
      }, 1500)
    }
  }

  // 添加地图数据调试
  useEffect(() => {
    if (currentTripPlan) {
      console.log('TripJourneyView: Map center coordinates:', [currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]])
      console.log('TripJourneyView: Route waypoints:', currentTripPlan.route.waypoints)
    }
  }, [currentTripPlan])

  const handleJournalClick = () => {
    setIsJournalAnimating(true)
    // 等待展开动画完成后再导航
    setTimeout(() => {
      navigate('/travel-journal', {
        state: {
          tripPlan: currentTripPlan,
          currentActivity
        }
      })
    }, 800) // 800ms 动画持续时间
  }

  const handleLetterClick = () => {
    setShowLetterModal(true)
  }

  const handleCloseLetterModal = () => {
    setShowLetterModal(false)
  }

  const handleAdjustPlan = () => {
    if (!currentTripPlan) return
    
    // 构造TripPlanView期望的tripPlan数据格式
    const tripPlanData = {
      cityId: currentTripPlan.cityId,
      themes: currentTripPlan.selectedThemes,
      selectedThemeNames: currentTripPlan.selectedThemeNames
    }
    
    // 导航到计划页面，传递当前计划数据
    navigate('/trip-plan', {
      state: {
        tripPlan: tripPlanData
      }
    })
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

  const generateLetterContent = () => {
    if (!currentTripPlan) return ''
    
    const petName = currentTripPlan.petCompanion.name || (language === 'zh' ? '豚豚君' : 'Pet')
    const cityName = currentTripPlan.cityName
    
    if (language === 'zh') {
      return `亲爱的主人：

今天和你一起在${cityName}的冒险真是太棒了！

我们一起看过了美丽的风景，品尝了好吃的美食，还遇到了很多有趣的事情。每一个瞬间都让我的小心脏扑通扑通地跳个不停～

虽然今天的行程结束了，但是我们的友谊永远不会结束！我已经在期待下一次的冒险了，你呢？

记得要好好休息哦～

爱你的
${petName} 💕`
    } else {
      return `Dear Master:

Today's adventure with you in ${cityName} was absolutely amazing!

We saw beautiful sights, tasted delicious food, and encountered so many interesting things. Every moment made my little heart go pitter-patter with excitement～

Although today's journey has ended, our friendship will never end! I'm already looking forward to our next adventure, how about you?

Remember to get some good rest～

With love,
${petName} 💕`
    }
  }

  if (!currentTripPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  // 准备地图数据：将旅行数据转换为地图组件格式
  const mapPoints = currentTripPlan.route.waypoints.map(waypoint => ({
    id: waypoint.id,
    position: [waypoint.coordinates[1], waypoint.coordinates[0]] as [number, number], // 转换 [lng, lat] -> [lat, lng]
    title: language === 'zh' ? waypoint.name : waypoint.nameEn,
    description: waypoint.description || '',
    petFriendlyIndex: waypoint.type === 'start' ? 90 : waypoint.type === 'end' ? 85 : 75, // 根据类型设置宠物友好度
    data: {
      averageSalary: 8000,
      rentPrice: 3000,
      currency: 'CNY',
      workLifeBalance: '良好',
      costOfLiving: 70,
      qualityOfLife: 80
    }
  }))

  const mapRoutes = [{
    id: currentTripPlan.route.id,
    name: language === 'zh' ? '旅行路线' : 'Travel Route',
    description: language === 'zh' ? '今日探索路线' : 'Today\'s exploration route',
    waypoints: currentTripPlan.route.waypoints.map(wp => ({
      position: [wp.coordinates[1], wp.coordinates[0]] as [number, number], // 转换 [lng, lat] -> [lat, lng]
      name: language === 'zh' ? wp.name : wp.nameEn
    })),
    style: {
      color: currentTripPlan.route.style.color,
      weight: currentTripPlan.route.style.weight,
      opacity: currentTripPlan.route.style.opacity
    },
    travelMode: 'walking' as const,
    curveStyle: {
      enabled: true,
      intensity: 0.3
    }
  }]

  // 检查是否行程已结束
  const isTripsCompleted = currentTripPlan && (
    tripProgress.currentActivityIndex >= currentTripPlan.activities.length || 
    currentTripPlan.status === 'completed'
  )

  return (
    <div className="relative">
      {/* 滚动条样式 */}
      <style>
        {`
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
        `}
      </style>
      
      {/* 始终显示地图背景 */}
      <div className="fixed inset-0 w-full h-full z-0">
        <MapboxMap
          className="w-full h-full"
          center={[currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]] as [number, number]} // 转换 [lng, lat] -> [lat, lng]
          zoom={12}
          maxZoom={16}
          disableZoom={false}
          disableInteraction={false}
          points={mapPoints}
          routes={mapRoutes}
        />
      </div>
      


      {/* 地球宠物装饰 - 在地图之上，UI之下 */}
      <div className="fixed bottom-[-80vh] left-1/2 transform -translate-x-1/2 z-5 w-[50vw] h-[50vw] pointer-events-none">
        <img 
          src="/decorations/earth.jpeg" 
          alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            animation: 'earthRotate 60s linear infinite'
          }}
        />
        {/* 宠物在地球上 */}
        <div className={`absolute top-[-15%] left-1/2 transform -translate-x-1/2 animate-pulse ${
          currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog' 
            ? 'w-[12vw] h-[12vw]' 
            : 'w-[15vw] h-[15vw]'
        }`}
        style={{
          animation: 'petSwing 4s ease-in-out infinite'
        }}>
          <img 
            src={
              currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat.png' :
              currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox.png' :
              '/decorations/capybara.jpeg'
            }
            alt={
              language === 'zh' ? (
                currentTripPlan.petCompanion.type === 'cat' ? '猫咪' :
                currentTripPlan.petCompanion.type === 'dog' ? '狗狗' : '水豚'
              ) : (
                currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                currentTripPlan.petCompanion.type === 'dog' ? 'Dog' : 'Capybara'
              )
            }
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 动画样式定义 */}
      <style>{`
        @keyframes earthRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes petSwing {
          0%, 100% { transform: translate(-50%, 0) rotate(-3deg); }
          50% { transform: translate(-50%, 0) rotate(3deg); }
        }
      `}</style>

      {/* 所有UI元素悬浮在地图上层 */}
      <div className="relative z-10">
        {/* 返回按钮 - 左上角 */}
        <div
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#687949] bg-transparent p-2 rounded-lg cursor-pointer transform transition-transform duration-200 hover:scale-110"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{language === 'zh' ? '返回' : 'Back'}</span>
        </div>





        {/* 行程进程卡片 */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div 
            className={`backdrop-blur-sm p-5 w-[47vw] transition-all duration-300 ${
              !isTripsCompleted && letterAnimationStage === 'hidden' && !isTransitioning
                ? 'cursor-pointer hover:scale-105 hover:shadow-lg' 
                : 'cursor-default'
            }`}
            style={{
              borderRadius: '1.5vw',
              background: '#FEFDF9',
              boxShadow: isTripsCompleted || isTransitioning
                ? '0 2px 34.9px 3px rgba(123, 66, 15, 0.05)' 
                : '0 2px 34.9px 3px rgba(123, 66, 15, 0.11)',
              opacity: isTripsCompleted || isTransitioning ? 0.8 : 1
            }}
            onClick={handleTripCardClick}
            title={!isTripsCompleted && letterAnimationStage === 'hidden' && !isTransitioning
              ? (language === 'zh' ? '点击结束行程' : 'Click to end trip') 
              : ''
            }
          >
            
            
            {/* 上层：头像、姓名、事情、时间、地点 */}
            <div className="flex items-start justify-between mb-1">
              {/* 左侧：宠物头像、名称和当前活动 */}
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center overflow-hidden ${
                  currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog' 
                    ? 'w-[7vw] h-[5.5vw]' 
                    : 'w-[8vw] h-[6vw]'
                }`}>
                  <img 
                    src={
                      currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat.png' :
                      currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox.png' :
                      currentTripPlan.petCompanion.type === 'other' ? '/decorations/capybara.jpeg' :
                      '/decorations/fox.png'
                    }
                    alt={
                      currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                      currentTripPlan.petCompanion.type === 'dog' ? 'Dog' :
                      currentTripPlan.petCompanion.type === 'other' ? 'Capybara' :
                      'Pet'
                    }
                    className={`w-full h-full ${
                      currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog'
                        ? 'object-contain'
                        : 'object-cover'
                    }`}
                  />
                </div>
                
                {/* 宠物名称和当前活动 */}
                <div className="flex flex-col">
                  <h2 
                    style={{
                      color: '#687949',
                      fontFamily: 'PingFang SC',
                      fontSize: '1.6vw',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: 'normal'
                    }}
                  >
                    {currentTripPlan.petCompanion.name || (language === 'zh' ? '豚豚君' : 'Pig-kun')}
                  </h2>
                  
                  {currentActivity && (
                    <p 
                      style={{
                        color: '#B1C192',
                        fontFamily: 'PingFang SC',
                        fontSize: '0.9vw',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal',
                        margin: '8px 0'
                      }}
                    >
                      {language === 'zh' ? currentActivity.title : currentActivity.titleEn}
                    </p>
                  )}
                </div>
              </div>
              
              {/* 右侧：时间和地点 */}
              <div className="flex flex-col items-end">
                <div 
                  style={{
                    color: '#687949',
                    fontFamily: 'PingFang SC',
                    fontSize: '2.3vw',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: 'normal'
                  }}
                >
                  {currentTime}
                </div>
                <div 
                  style={{
                    borderRadius: '4vw',
                    background: '#F3E2B6',
                    padding: '2px 10px',
                    marginTop: '1px',
                    marginBottom: '1px'
                  }}
                >
                  <span className="text-s font-medium text-gray-700">
                    {currentTripPlan.cityName}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 下层：行程状态和进度条 */}
            <div className="flex items-center gap-2">
              {/* 行程状态 */}
              <div className="flex top-[2vh] gap-2">
                <span className="text-s text-gray-600">
                  {tripProgress.currentActivityIndex < currentTripPlan.activities.length ? 
                    (language === 'zh' ? '行程中' : 'In Progress') : 
                    (language === 'zh' ? '行程结束' : 'Trip Completed')
                  }
                </span>
              </div>
              
                             {/* 进度条 */}
              <div className="flex-1 relative"
                style={{ minWidth: '20vw', marginLeft: '1vw' }}
              >
                <div className="flex items-center justify-between relative">
                {/* 连接线 */}
                <div className="rounded-full absolute top-[7px] left-[10px] right-[10px] h-2" style={{ backgroundColor: '#E5E5E5' }}></div>
                <div 
                  className="rounded-full absolute top-[7px] left-[10px] h-2 transition-all duration-500"
                  style={{ 
                    width: `${((tripProgress.currentActivityIndex + 1 ) / tripProgress.totalActivities) * 120}%`,
                    backgroundColor: '#597466'
                  }}
                ></div>
                
                {currentTripPlan.activities.map((activity, index) => (
                  <div key={activity.id} className="flex flex-col items-center relative z-10">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      fill="none"
                      className="w-[20px] h-[20px]"
                    >
                      <circle 
                        cx="10" 
                        cy="10" 
                        r="10" 
                        fill={index <= tripProgress.currentActivityIndex ? '#B1C192' : '#E5E5E5'}
                      />
                      <circle 
                        cx="10" 
                        cy="10" 
                        r="5" 
                        fill={index <= tripProgress.currentActivityIndex ? '#597466' : '#D1D5DB'}
                      />
                    </svg>
                                        <span 
                      className="mt-1"
                      style={{
                        color: '#687949',
                        fontFamily: 'PingFang SC',
                        fontSize: '14px',
                        fontWeight: 400
                      }}
                    >
                      {formatTimeToAMPM(activity.time)}
                    </span>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 左侧计划列表 */}
        <div 
          className="absolute top-[32vh] left-8 w-[23vw] backdrop-blur-sm p-4 z-20 h-[60vh]"
          style={{
            borderRadius: '1vw',
            border: '2px dashed #D1BA9E',
            background: '#FEFDF9',
            boxShadow: '0 1.8px 6.48px 2.7px rgba(194, 100, 18, 0.12)',
            position: 'relative'
          }}
        >
          {/* 右上角夹子装饰 */}
          <img 
            src="/src/assets/%E5%A4%B9%E5%AD%90.jpg" 
            alt="Clip decoration"
            style={{
              position: 'absolute',
              top: '-6vh',
              right: '-3vw',
              width: '7vw',
              height: '7vw',
              objectFit: 'contain',
              zIndex: 30,
              transform: 'rotate(15deg)',
              filter: 'drop-shadow(0 0.2vh 0.4vh rgba(0,0,0,0.2))'
            }}
          />
          
          <h3 className="text-lg font-bold mb-4 text-center" style={{ color: 'rgb(87, 62, 35)' }}>
            {language === 'zh' ? `${currentTripPlan.petCompanion.name || '豚豚'}的探索计划` : `${currentTripPlan.petCompanion.name || 'Pet'}\'s Exploration Plan`}
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(60vh - 200px)', 
            minHeight: '75%',
            position: 'relative'
          }}>
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                paddingRight: '0.5vw',
                paddingBottom: '1vh',
                position: 'relative'
              }} 
              className="activities-scroll"
            >
            {/* 渲染所有活动，包括当前活动和即将进行的活动 */}
            {currentTripPlan.activities.map((activity, index) => {
              const isCompleted = index < tripProgress.currentActivityIndex
              const isCurrent = index === tripProgress.currentActivityIndex
              const isLast = index === currentTripPlan.activities.length - 1

              return (
                <div key={activity.id} className="flex items-start gap-2 mb-4">
                  {/* 左侧：进程节点和进度线 */}
                  <div className="flex flex-col items-center">
                                         {/* 进程节点 */}
                     <div className="relative">
                       <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" viewBox="0 0 41 41" fill="none">
                         <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fill-opacity="0.22"/>
                       </svg>
                       
                       {/* 如果已完成或正在进行，显示勾选标记 */}
                       {(isCompleted || isCurrent) && (
                         <div className="absolute inset-0 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="1.5vw" height="1.5vw" viewBox="0 0 30 29" fill="none">
                            <g clipPath="url(#clip0_5036_8885)">
                              <path d="M28.8664 1.97266C20.1112 7.34386 13.7608 14.1263 10.8952 17.5247L3.89678 12.0383L0.800781 14.5295L12.8824 26.8271C14.956 21.4991 21.5512 11.0879 29.6008 3.68626L28.8664 1.97266Z" fill="#687949"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_5036_8885">
                                <rect width="28.8" height="28.8" fill="white" transform="translate(0.800781)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      )}
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
                    {/* 时间和状态 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {formatTimeToAMPM(activity.time)}
                      </span>
                      
                      {/* 状态标签 */}
                      {isCurrent && (
                        <span 
                          className="text-xs text-white px-2 py-1"
                          style={{
                            borderRadius: '38px',
                            background: '#687949'
                          }}
                        >
                          {language === 'zh' ? '进行中' : 'In Progress'}
                        </span>
                      )}
                      
                      {isCompleted && (
                        <span 
                          className="text-xs text-white px-2 py-1"
                          style={{
                            borderRadius: '38px',
                            background: '#687949'
                          }}
                        >
                          {language === 'zh' ? '已完成' : 'Completed'}
                        </span>
                      )}
                    </div>

                                         {/* 卡片内容 */}
                     <div 
                       className={`relative ${isCurrent ? 'p-3' : 'p-3'}`}
                       style={{
                         borderRadius: '0.8vw',
                         background: isCurrent ? '#FDF5E8' : '#FDF9EF',
                         boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                       }}
                     >
                       {/* 虚线描边（仅当前活动） */}
                       {isCurrent && (
                         <div 
                           className="absolute"
                           style={{
                             top: '10px',
                             left: '10px',
                             right: '10px',
                             bottom: '10px',
                             border: '2px dashed #D1BA9E',
                             borderRadius: '0.6vw',
                             pointerEvents: 'none'
                           }}
                         />
                       )}
                       
                       {/* 上部分：头像、地点和心情 */}
                       <div className="flex items-start gap-3 m-2 relative z-10">
                         {/* 左侧头像 */}
                         <div className="w-[3.5vw] h-[3.5vw] bg-[#F4EDE0] rounded-full flex items-center flex-shrink-0 overflow-hidden">
                           <img 
                             src={
                               currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat1.jpeg' :
                               currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox1.jpeg' :
                               currentTripPlan.petCompanion.type === 'other' ? '/decorations/capybara1.jpeg' :
                               '/decorations/fox1.jpeg'
                             }
                             alt={
                               currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                               currentTripPlan.petCompanion.type === 'dog' ? 'Dog' :
                               currentTripPlan.petCompanion.type === 'other' ? 'Capybara' :
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
                             {/* 心情 */}
                             <div className="text-xs text-gray-600 leading-tight">
                               {isCurrent ? 
                                 (petTravelState.moodMessage || (language === 'zh' ? '心情不错～' : 'Feeling good~')) :
                                 (isCompleted ? 
                                   (language === 'zh' ? '已完成～' : 'Completed~') :
                                   (language === 'zh' ? '期待中～' : 'Looking forward~')
                                 )
                               }
                             </div>
                           </div>
                       </div>
                       
                                                {/* 分隔线 */}
                         <div className="w-[90%] h-px bg-[#BBA084] my-1 relative z-10 mx-auto"></div>
                       
                       {/* 下部分：正在做的事情 */}
                       <div className="flex items-center justify-between relative z-10">
                         <div className="ml-2 my-1 text-xs text-gray-700">
                           {language === 'zh' ? activity.title : activity.titleEn}
                         </div>
                         
                       </div>
                     </div>
                  </div>
                </div>
              )
            })}

            {/* 行程结束后显示完成状态 */}
            {isTripsCompleted && (
              <div className="flex items-start gap-3 mb-4">
                                 {/* 左侧：完成节点 */}
                 <div className="flex flex-col items-center">
                   <div className="relative">
                     <svg xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vw" viewBox="0 0 41 41" fill="none">
                       <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fill-opacity="0.8"/>
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" viewBox="0 0 30 29" fill="none">
                        <g clipPath="url(#clip0_5036_8885)">
                          <path d="M28.8664 1.97266C20.1112 7.34386 13.7608 14.1263 10.8952 17.5247L3.89678 12.0383L0.800781 14.5295L12.8824 26.8271C14.956 21.4991 21.5512 11.0879 29.6008 3.68626L28.8664 1.97266Z" fill="#687949"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_5036_8885">
                            <rect width="28.8" height="28.8" fill="white" transform="translate(0.800781)"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 右侧：完成信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs text-white px-2 py-1"
                      style={{
                        borderRadius: '38px',
                        background: '#687949'
                      }}
                    >
                      {language === 'zh' ? '全部完成' : 'All Completed'}
                    </span>
                  </div>
                  
                                     <div 
                     className="p-3"
                     style={{
                       borderRadius: '0.8vw',
                       background: '#FDF9EF',
                       boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                     }}
                   >
                     <div className="text-center">
                       <h4 className="font-bold text-sm text-gray-700">
                         {language === 'zh' ? '恭喜！所有活动都完成了' : 'Congratulations! All activities completed'}
                       </h4>
                       <p className="text-xs text-gray-500 mt-1">
                         {language === 'zh' ? '今天过得很充实呢～' : 'What a fulfilling day~'}
                       </p>
                     </div>
                   </div>
                </div>
              </div>
            )}
            
            </div>
            
            {/* 底部渐变遮罩 */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: '0.5vw',
              height: '4vh',
              background: 'linear-gradient(to bottom, rgba(254, 253, 249, 0) 0%, rgba(254, 253, 249, 0.8) 50%, rgba(254, 253, 249, 1) 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
          </div>
          
          {/* 固定在探索计划底部的按钮 */}
          <div className="mt-4 flex justify-center">
            {!isTripsCompleted && !isTransitioning && (
              <button 
                onClick={handleAdjustPlan}
                style={getUnifiedButtonStyle()}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" viewBox="0 0 31 32" fill="none">
                    <path d="M11.7993 22.7033C11.6848 22.8178 11.5431 22.9014 11.3874 22.9461L4.44681 24.9423C4.08559 25.0462 3.75126 24.7118 3.85516 24.3506L5.85128 17.41C5.89604 17.2544 5.97959 17.1127 6.0941 16.9982L20.2248 2.86746C20.5982 2.49405 21.2037 2.49405 21.5771 2.86746L25.9299 7.22037C26.3034 7.59379 26.3034 8.19928 25.9299 8.57272L11.7993 22.7033ZM19.2105 7.2626L21.5348 9.58694L23.2253 7.8965L20.9009 5.57216L19.2105 7.2626ZM17.6891 8.78396L8.04641 18.4267L7.10806 21.6894L10.3707 20.751L20.0135 11.1083L17.6891 8.78396ZM3.95608 27.2658H26.9061V29.4173H3.95608V27.2658Z" fill="white"/>
                  </svg>
                  <span>{language === 'zh' ? '调整计划' : 'Adjust Plan'}</span>
                </span>
              </button>
            )}

            {/* 行程完成后显示新旅程按钮 */}
            {isTripsCompleted && (
              <button 
                style={getUnifiedButtonStyle()}
                onMouseEnter={(e) => handleButtonHover(e, true)}
                onMouseLeave={(e) => handleButtonHover(e, false)}
                onClick={() => {
                  clearCurrentTrip() // 清除当前旅行计划
                  navigate('/home')
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12L5 10M5 10L3 8M5 10H13M13 12V18C13 18.5304 13.2107 19.0391 13.5858 19.4142C13.9609 19.7893 14.4696 20 15 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H15C14.4696 4 13.9609 4.21071 13.5858 4.58579C13.2107 4.96086 13 5.46957 13 6V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{language === 'zh' ? '开启新旅程！' : 'Start New Journey!'}</span>
                </span>
              </button>
            )}


          </div>
        </div>

        

        {/* 动画信件 */}
        <AnimatePresence>
          {letterAnimationStage !== 'hidden' && (
            <motion.div
              initial={{
                left: '50%',
                top: '50%',
                scale: 0,
                opacity: 0,
                x: '-50%',
                y: '-50%'
              }}
              animate={
                letterAnimationStage === 'appearing' ? {
                  left: '50%',
                  top: '50%',
                  scale: 1.2,
                  opacity: 1,
                  x: '-50%',
                  y: '-50%',
                  transition: { duration: 1.5, ease: "easeOut" }
                } : letterAnimationStage === 'disappearing' ? {
                  left: '50%',
                  top: '50%',
                  scale: 0,
                  opacity: 0,
                  x: '-50%',
                  y: '-50%',
                  transition: { duration: 0.5, ease: "easeIn" }
                } : letterAnimationStage === 'reappearing' ? {
                  left: '60vw',
                  top: '85vh',
                  scale: 0.4,
                  opacity: 1,
                  x: '-50%',
                  y: '-50%',
                  transition: { duration: 0.8, ease: "easeOut" }
                } : {
                  left: '60vw',
                  top: '85vh',
                  scale: 0.4,
                  opacity: 1,
                  x: '-50%',
                  y: '-50%'
                }
              }
              className="fixed z-[10000]"
              style={{ 
                transformOrigin: 'center'
              }}
            >
              <motion.div
                onClick={(letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? handleLetterClick : undefined}
                className={`w-[8vw] h-[8vw] transition-transform cursor-pointer bg-transparent ${
                  (letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') 
                    ? 'ring-2 ring-yellow-400 ring-opacity-50 rounded-lg' 
                    : ''
                }`}
                aria-label={language === 'zh' ? '查看信件' : 'View Letter'}
                role="button"
                tabIndex={(letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? 0 : -1}
                whileHover={(letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? { scale: 1.15 } : {}}
                animate={(letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? {
                  y: [0, -5, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                } : {}}
                style={{
                  backgroundColor: 'transparent',
                  pointerEvents: (letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? 'auto' : 'none',
                  position: 'relative',
                  zIndex: 10001
                }}
              >
                <img 
                  src="/decorations/letter.jpeg" 
                  alt={language === 'zh' ? '来自宠物的信件' : 'Letter from Pet'} 
                  className="w-full h-full object-contain drop-shadow-lg transition-transform duration-200"
                  style={{ backgroundColor: 'transparent' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>



      {/* 手帐按钮 - 右下角 */}
      <motion.div 
        onClick={handleJournalClick}
        className="fixed bottom-8 right-8 z-40 w-[12vw] h-[12vw] cursor-pointer"
        aria-label={language === 'zh' ? '打开手帐' : 'Open Journal'}
        role="button"
        tabIndex={0}
        initial={{ scale: 1, rotate: 0 }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 2,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{
          scale: 0.95,
          rotate: -2,
          transition: { duration: 0.1 }
        }}
        animate={isJournalAnimating ? {
          scale: [1, 0.9, 1.2, 0.8],
          rotate: [0, -5, 5, 0],
          transition: {
            duration: 0.4,
            ease: "easeInOut"
          }
        } : {
          y: [0, -3, 0],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleJournalClick()
          }
        }}
      >
        <motion.img 
          src="/decorations/book.jpeg" 
          alt={language === 'zh' ? '手帐' : 'Journal'} 
          className="w-full h-full object-contain drop-shadow-lg"
          animate={isJournalAnimating ? {
            rotateY: [0, 180, 0],
            transition: {
              duration: 0.6,
              ease: "easeInOut"
            }
          } : {}}
        />
      </motion.div>



      {/* 信件弹窗 - 放在最后确保在最上层 */}
      {showLetterModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'rgba(92, 90, 76, 0.15)',
            backdropFilter: 'blur(9.399999618530273px)'
          }}
          onClick={handleCloseLetterModal}
        >
          <div 
            className="w-[65vw] h-[80vh] relative"
            style={{
              backgroundImage: 'url(/decorations/letter_paper.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 内容容器 */}
            <div className="w-full h-full" style={{ padding: '8vw' }}>
              {/* 上层：标题 */}
              <div className="text-center mb-6">
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: '#687949' }}
                >
                  {language === 'zh' 
                    ? `${currentTripPlan?.petCompanion?.name || '豚豚'}的来信`
                    : `Letter from ${currentTripPlan?.petCompanion?.name || 'Pet'}`
                  }
                </h2>
              </div>

              {/* 下层：主要内容 */}
              <div className="flex gap-6 h-[calc(100%-120px)]">
              {/* 左侧：宠物照片 */}
              <div className="w-[50%] flex items-start">
                <div className="w-full aspect-square  p-1 transform  relative">
                  <img 
                    src="/decorations/photo.png"
                    alt="宠物照片"
                    className="w-full h-full object-cover"
                  />
                  
                  
                </div>
              </div>

              {/* 右侧：信件内容 */}
              <div className="flex-1 flex flex-col">
                {/* 信件标题 */}
                <div className="text-center mb-4">
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: '#687949' }}
                  >
                    岚山竹林
                  </h3>
                  <div 
                    className="text-sm"
                    style={{ color: '#A6A196' }}
                  >
                    7月24日 14:30 · 天气晴朗 ☀️
                  </div>
                </div>

                {/* 信件内容卡片 */}
                <div 
                  className="p-4 mb-4 flex-1 relative"
                  style={{
                    borderRadius: '25px',
                    background: '#F9F2E2'
                  }}
                >
                  {/* 引号装饰 */}
                  <div 
                    className="absolute top-2 left-3 text-3xl opacity-50"
                    style={{ color: '#687949' }}
                  >
                    "
                  </div>
                  <div 
                    className="text-sm leading-relaxed pt-4 px-2"
                    style={{ color: '#687949' }}
                  >
                    我去拍照的时候突然下起了雨，但雨中的竹林意外好看，还遇到一只会摇尾巴的野猫。这个地方太安静太适合发呆了。
                  </div>
                  <div 
                    className="absolute bottom-2 right-3 text-3xl opacity-50"
                    style={{ color: '#687949' }}
                  >
                    "
                  </div>
                </div>

                {/* 分割线 */}
                <div 
                  className="h-px mb-4"
                  style={{ background: '#EADDC7' }}
                ></div>

                {/* 推荐指数和意外收获 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm"
                      style={{ color: '#A6A196' }}
                    >
                      推荐指数
                    </span>
                    <div className="flex text-yellow-500">
                      ⭐⭐⭐⭐
                    </div>
                  </div>
                  
                  {/* 意外收获卡片 */}
                  <div 
                    className="px-3 py-2 flex items-center gap-2"
                    style={{
                      borderRadius: '17px',
                      border: '3px solid #D9C6B1',
                      background: '#FDF5E8',
                      boxShadow: '0 2px 11.4px 3px rgba(123, 66, 15, 0.11)'
                    }}
                  >
                                         
                     <img 
                       src="/decorations/image 93.png"
                       alt="意外收获"
                       className="w-6 h-6 object-contain"
                     />
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="flex gap-3 mt-auto">
                  <button 
                    className="flex-1 py-3 px-4 rounded-[1vw] text-white font-medium transition-all hover:scale-105"
                    style={{ background: '#687949' }}
                    onClick={() => {
                      handleCloseLetterModal()
                      navigate('/travel-journal')
                    }}
                  >
                    {language === 'zh' ? '收进手帐' : 'Add to Journal'}
                  </button>
                  <button 
                    className="w-[4vw] h-[4vw] rounded-full flex items-center justify-center transition-all hover:scale-105"
                    style={{ background: '#D9C6B1' }}
                    title={language === 'zh' ? '分享' : 'Share'}
                    aria-label={language === 'zh' ? '分享信件' : 'Share letter'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke="#687949" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* 圆形展开动画覆盖层 */}
      <AnimatePresence>
        {isJournalAnimating && (
          <>
            {/* 第一层：圆形展开效果 */}
            <motion.div
              initial={{
                width: '12vw',
                height: '12vw',
                borderRadius: '50%',
                opacity: 0.8,
                scale: 0.8,
                x: 0,
                y: 0
              }}
              animate={{
                width: '200vmax',
                height: '200vmax',
                borderRadius: '0%',
                opacity: 0.95,
                scale: 1,
                x: '-50%',
                y: '-50%',
                transition: {
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  borderRadius: {
                    duration: 0.5,
                    delay: 0.2
                  },
                  scale: {
                    duration: 0.3
                  },
                  x: {
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  },
                  y: {
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }
              }}
              className="fixed z-[25] bg-gradient-to-tl from-amber-50/90 to-orange-100/90"
              style={{ 
                bottom: 'calc(2rem + 6vw)',
                right: 'calc(2rem + 6vw)',
                transformOrigin: 'bottom right',
                backdropFilter: 'blur(2px)'
              }}
            />
            
            {/* 第二层：纸张质感效果 */}
            <motion.div
              initial={{
                width: '8vw',
                height: '8vw',
                borderRadius: '50%',
                opacity: 0,
                x: 0,
                y: 0
              }}
              animate={{
                width: '200vmax',
                height: '200vmax',
                borderRadius: '0%',
                opacity: 0.7,
                x: '-50%',
                y: '-50%',
                transition: {
                  duration: 0.9,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                  x: {
                    duration: 0.9,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  },
                  y: {
                    duration: 0.9,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }
              }}
              className="fixed z-[24] bg-gradient-to-tl from-yellow-50/60 to-amber-50/60"
              style={{ 
                bottom: 'calc(2rem + 6vw)',
                right: 'calc(2rem + 6vw)',
                transformOrigin: 'bottom right',
                backgroundImage: 'radial-gradient(circle at 85% 85%, rgba(255,255,255,0.2) 0%, transparent 50%)'
              }}
            />

            {/* 第三层：飘落的纸张装饰 */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 'calc(100vw - 5rem)',
                  y: 'calc(100vh - 5rem)',
                  rotate: 0,
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{
                  x: `${Math.random() * 80}vw`,
                  y: `${Math.random() * 80}vh`,
                  rotate: -180 + Math.random() * 360,
                  opacity: [0, 0.6, 0],
                  scale: [0.5, 1, 0.3],
                  transition: {
                    duration: 1.2,
                    delay: 0.2 + i * 0.1,
                    ease: "easeOut"
                  }
                }}
                className="fixed z-[23] w-6 h-6 bg-amber-100 rounded-sm shadow-sm"
                style={{
                  background: 'linear-gradient(45deg, #fef3c7, #fed7aa)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            ))}
            
            {/* 第四层：温暖光晕效果 */}
            <motion.div
              initial={{
                width: '6vw',
                height: '6vw',
                borderRadius: '50%',
                opacity: 0,
                x: 0,
                y: 0
              }}
              animate={{
                width: '40vw',
                height: '40vw',
                opacity: [0, 0.4, 0.2, 0],
                x: '-50%',
                y: '-50%',
                transition: {
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                  x: {
                    duration: 1.5,
                    delay: 0.3,
                    ease: "easeOut"
                  },
                  y: {
                    duration: 1.5,
                    delay: 0.3,
                    ease: "easeOut"
                  }
                }
              }}
              className="fixed z-[22]"
              style={{ 
                bottom: 'calc(2rem + 6vw)',
                right: 'calc(2rem + 6vw)',
                transformOrigin: 'bottom right',
                background: 'radial-gradient(circle, rgba(255, 243, 199, 0.6) 0%, rgba(254, 215, 170, 0.3) 40%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TripJourneyView 