import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { WarmBg } from '@/components/bg/WarmBg'
import DashedCard from '@/components/common/DashedCard'
import { 
  currentTripPlanAtom, 
  tripProgressAtom, 
  petTravelStateAtom,
  currentActivityAtom,
  upcomingActivitiesAtom,
  completeCurrentActivityAtom,
  updatePetMoodAtom,
  completeTripAtom
} from '@/store/TripState'
import { MapboxMap } from '@/components/map/MapboxMap'
import toast from 'react-hot-toast'

const TripJourneyView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [currentTime, setCurrentTime] = useState<string>('12:45')
  const [showMoodDialog, setShowMoodDialog] = useState<boolean>(false)
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false)
  const [showLetter, setShowLetter] = useState<boolean>(false)

  // 自定义虚线卡片样式已通过CSS类实现

  // 统一状态管理
  const [currentTripPlan] = useAtom(currentTripPlanAtom)
  const [tripProgress] = useAtom(tripProgressAtom)
  const [petTravelState] = useAtom(petTravelStateAtom)
  const [currentActivity] = useAtom(currentActivityAtom)
  const [upcomingActivities] = useAtom(upcomingActivitiesAtom)
  const [, completeCurrentActivity] = useAtom(completeCurrentActivityAtom)
  const [, updatePetMood] = useAtom(updatePetMoodAtom)
  const [, completeTrip] = useAtom(completeTripAtom)

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
    if (currentTripPlan && tripProgress.currentActivityIndex >= currentTripPlan.activities.length) {
      // 延迟2秒显示信件，让用户先看到"行程结束"状态
      const timer = setTimeout(() => {
        setShowLetter(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentTripPlan, tripProgress.currentActivityIndex])

  // 添加地图数据调试
  useEffect(() => {
    if (currentTripPlan) {
      console.log('TripJourneyView: Map center coordinates:', [currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]])
      console.log('TripJourneyView: Route waypoints:', currentTripPlan.route.waypoints)
    }
  }, [currentTripPlan])

  const generateMoodText = () => {
    if (!currentActivity) return ''
    
    const moodTexts = {
      photography: [
        language === 'zh' ? '哇！这里的光线好棒，我要拍一百张照片！📸' : 'Wow! The lighting here is amazing, I want to take a hundred photos! 📸',
        language === 'zh' ? '咔嚓咔嚓～是不是把我拍得很可爱？' : 'Click click~ Did you capture how cute I am?',
        language === 'zh' ? '这个角度...嗯...再来一张！' : 'This angle... hmm... one more shot!'
      ],
      food: [
        language === 'zh' ? '好香啊～我的小肚子已经咕咕叫了！🍜' : 'Smells so good~ My little tummy is growling! 🍜',
        language === 'zh' ? '这个看起来就很好吃！我可以尝一口吗？' : 'This looks delicious! Can I have a taste?',
        language === 'zh' ? '嗯嗯嗯！太好吃了，我要打包带走！' : 'Mmm mmm! So tasty, I want to take some home!'
      ],
      culture: [
        language === 'zh' ? '哇～历史好深奥，我有点晕了...' : 'Wow~ History is so profound, I\'m getting a bit dizzy...',
        language === 'zh' ? '这些古老的东西让我想起了我爷爷的爷爷！' : 'These ancient things remind me of my grandpa\'s grandpa!',
        language === 'zh' ? '学到了很多呢，我觉得自己变聪明了！' : 'Learned so much, I feel smarter!'
      ],
      nature: [
        language === 'zh' ? '好清新的空气！深呼吸～ ahhhh' : 'Such fresh air! Deep breath~ ahhhh',
        language === 'zh' ? '看到这么美的风景，心情都变好了！' : 'Seeing such beautiful scenery makes me feel so good!',
        language === 'zh' ? '我想在这里打个滚...可以吗？' : 'I want to roll around here... may I?'
      ],
      nightlife: [
        language === 'zh' ? '夜生活开始啦！虽然我有点困了...' : 'Nightlife begins! Though I\'m getting a bit sleepy...',
        language === 'zh' ? '灯光好炫！我的眼睛都要闪瞎了！' : 'The lights are so dazzling! My eyes are getting blinded!',
        language === 'zh' ? '音乐太大声了，我的小耳朵受不了...' : 'The music is too loud, my little ears can\'t handle it...'
      ],
      shopping: [
        language === 'zh' ? '这个可爱！那个也可爱！都想要...' : 'This is cute! That\'s cute too! I want everything...',
        language === 'zh' ? '钱包君，对不起了...今天要让你减肥！' : 'Sorry wallet-kun... you\'re going on a diet today!',
        language === 'zh' ? '买买买！快乐就是这么简单！' : 'Buy buy buy! Happiness is that simple!'
      ],
      adventure: [
        language === 'zh' ? '刺激！但是...有点害怕...' : 'Exciting! But... a little scary...',
        language === 'zh' ? '冒险万岁！我是勇敢的小豚豚！' : 'Long live adventure! I\'m a brave little pig!',
        language === 'zh' ? '哇！这个太高了，我恐高...' : 'Wow! This is too high, I\'m afraid of heights...'
      ],
      relaxation: [
        language === 'zh' ? '啊～好舒服，我要融化了...' : 'Ahh~ so comfortable, I\'m melting...',
        language === 'zh' ? '这就是传说中的躺平生活吗？我爱了！' : 'Is this the legendary lying flat life? I love it!',
        language === 'zh' ? 'zzZ...等等，我不是在睡觉！' : 'zzZ... wait, I\'m not sleeping!'
      ]
    }

    const themeMoods = moodTexts[currentActivity.theme as keyof typeof moodTexts] || [
      language === 'zh' ? '今天的心情不错呢～' : 'I\'m in a good mood today~'
    ]
    
    return themeMoods[Math.floor(Math.random() * themeMoods.length)]
  }

  const handlePetClick = () => {
    const moodText = generateMoodText()
    updatePetMood(petTravelState.mood, moodText)
    setShowMoodDialog(true)
    
    setTimeout(() => {
      setShowMoodDialog(false)
    }, 3000)
  }

  const handleJournalClick = () => {
    navigate('/travel-journal', {
      state: {
        tripPlan: currentTripPlan,
        currentActivity
      }
    })
  }

  const handleNextActivity = () => {
    if (!currentTripPlan) return

    if (tripProgress.currentActivityIndex < currentTripPlan.activities.length - 1) {
      completeCurrentActivity()
      toast.success(
        language === 'zh' ? '进入下一个活动！' : 'Moving to next activity!'
      )
    } else {
      // 完成整个旅行
      completeTrip()
      toast.success(
        language === 'zh' ? '今天的行程全部完成！' : 'All activities completed for today!'
      )
      // 不再立即跳转到 home，让用户看到信件
    }
  }

  const handleLetterClick = () => {
    setShowLetterModal(true)
  }

  const handleCloseLetterModal = () => {
    setShowLetterModal(false)
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
    tangpingIndex: waypoint.type === 'start' ? 90 : waypoint.type === 'end' ? 85 : 75, // 根据类型设置躺平指数
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
  const isTripsCompleted = currentTripPlan && tripProgress.currentActivityIndex >= currentTripPlan.activities.length

  return (
    <WarmBg>
      {/* 自定义虚线卡片样式 */}
      <style>
        {`
          .custom-dashed-spacing {
            border-radius: 0.8vw !important;
          }
          .custom-dashed-spacing .dashed-border {
            top: 10px !important;
            left: 10px !important;
            right: 10px !important;
            bottom: 10px !important;
            border-radius: 13px !important;
          }
          .custom-dashed-spacing .content {
            padding: 12px !important;
            padding-bottom: 12px !important;
          }
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
      
      {/* 全屏地图背景 */}
      <div className="fixed inset-0 w-full h-full">
        <MapboxMap
          className="w-full h-full"
          center={[currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]] as [number, number]} // 转换 [lng, lat] -> [lat, lng]
          zoom={12}
          disableZoom={false}
          disableInteraction={false}
          points={mapPoints}
          routes={mapRoutes}
        />
      </div>

      {/* 所有UI元素悬浮在地图上层 */}
      <div className="relative z-10">
        {/* 返回按钮 - 左上角 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-black/30 backdrop-blur-sm p-2 rounded-lg hover:bg-black/40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{language === 'zh' ? '返回' : 'Back'}</span>
        </button>

        {/* 旅行状态卡片 */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div 
            className="backdrop-blur-sm p-5 w-[47vw] w-full"
            style={{
              borderRadius: '1.5vw',
              background: '#FEFDF9',
              boxShadow: '0 2px 34.9px 3px rgba(123, 66, 15, 0.11)'
            }}
          >
                        {/* 上层：头像、姓名、事情、时间、地点 */}
            <div className="flex items-start justify-between mb-1">
              {/* 左侧：宠物头像、名称和当前活动 */}
              <div className="flex items-start gap-4">
                <div className="w-[5vw] h-[5vw] bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-[2vw]">
                    {currentTripPlan.petCompanion.type === 'cat' ? '🐱' : 
                     currentTripPlan.petCompanion.type === 'dog' ? '🐶' : '🐹'}
                  </span>
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
          
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'zh' ? `${currentTripPlan.petCompanion.name || '豚豚'}的探索计划` : `${currentTripPlan.petCompanion.name || 'Pet'}\'s Exploration Plan`}
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(60vh - 120px)', 
            minHeight: '30vh',
            position: 'relative'
          }}>
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                paddingRight: '0.5vw',
                paddingBottom: '2vh'
              }} 
              className="activities-scroll"
            >
            {currentActivity && (
              <DashedCard 
                style={{ 
                  background: '#FDF5E8',
                  width: '100%'
                }}
                className="mb-3 custom-dashed-spacing"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{formatTimeToAMPM(currentActivity.time)}</span>
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        {language === 'zh' ? '进行中' : 'In Progress'}
                      </span>
                    </div>
                    <div className="mt-1 text-center">
                      <h4 className="font-bold text-sm">
                        {language === 'zh' ? currentActivity.title : currentActivity.titleEn}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {language === 'zh' ? currentActivity.location : currentActivity.locationEn}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleNextActivity}
                    className="text-green-600 hover:text-green-700"
                    aria-label={language === 'zh' ? '下一个活动' : 'Next activity'}
                    title={language === 'zh' ? '下一个活动' : 'Next activity'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </DashedCard>
            )}

            {upcomingActivities.slice(0, 2).map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-3 p-3 mb-3"
                style={{
                  borderRadius: '0.8vw',
                  background: '#FDF5E8',
                  boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                }}
              >
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">{formatTimeToAMPM(activity.time)}</span>
                  </div>
                  <div className="mt-1 text-center">
                    <h4 className="font-bold text-sm text-gray-700">
                      {language === 'zh' ? activity.title : activity.titleEn}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {language === 'zh' ? activity.location : activity.locationEn}
                    </p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}

            {/* 行程结束后显示完成状态 */}
            {isTripsCompleted && (
              <div 
                className="flex items-center gap-3 p-3 mb-3"
                style={{
                  borderRadius: '3vw',
                  background: '#FDF5E8',
                  boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      {language === 'zh' ? '已完成' : 'Completed'}
                    </span>
                  </div>
                  <div className="mt-1 text-center">
                    <h4 className="font-bold text-sm text-gray-700">
                      {language === 'zh' ? '恭喜！所有活动都完成了' : 'Congratulations! All activities completed'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {language === 'zh' ? '今天过得很充实呢～' : 'What a fulfilling day~'}
                    </p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            )}
          </div>

          {!isTripsCompleted && (
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition-colors">
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4C3.45 4 3 4.45 3 5V18C3 18.55 3.45 19 4 19H17C17.55 19 18 18.55 18 18V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5C18.89 2.11 19.39 1.9 19.91 1.9C20.43 1.9 20.93 2.11 21.32 2.5C21.71 2.89 21.92 3.39 21.92 3.91C21.92 4.43 21.71 4.93 21.32 5.32L12 14.64L8 16L9.36 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{language === 'zh' ? '调整计划' : 'Adjust Plan'}</span>
              </span>
            </button>
          )}

            {/* 行程完成后显示"回到主页"按钮 */}
            {isTripsCompleted && (
              <button 
                onClick={() => navigate('/home')}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{language === 'zh' ? '回到主页' : 'Back to Home'}</span>
                </span>
              </button>
            )}

            {!isTripsCompleted && (
              <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition-colors">
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.45 4 3 4.45 3 5V18C3 18.55 3.45 19 4 19H17C17.55 19 18 18.55 18 18V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5C18.89 2.11 19.39 1.9 19.91 1.9C20.43 1.9 20.93 2.11 21.32 2.5C21.71 2.89 21.92 3.39 21.92 3.91C21.92 4.43 21.71 4.93 21.32 5.32L12 14.64L8 16L9.36 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{language === 'zh' ? '调整计划' : 'Adjust Plan'}</span>
                </span>
              </button>
            )}
            </div>
            
            {/* 底部渐变遮罩 */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '6vh',
              background: 'linear-gradient(to bottom, rgba(254, 253, 249, 0) 0%, rgba(254, 253, 249, 0.8) 50%, rgba(254, 253, 249, 1) 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }} />
          </div>
        </div>

        
        
        {/* 小动物区域 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            {showMoodDialog && petTravelState.moodMessage && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg max-w-xs relative border border-white/30">
                  <p className="text-sm text-gray-700">{petTravelState.moodMessage}</p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-3 h-3 bg-white transform rotate-45"></div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handlePetClick}
              className="w-20 h-20 bg-orange-200/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg border border-white/30"
            >
              <span className="text-4xl">
                {currentTripPlan.petCompanion.type === 'cat' ? '🐱' : 
                 currentTripPlan.petCompanion.type === 'dog' ? '🐶' : '🐹'}
              </span>
            </button>
          </div>
        </div>

        {/* 行程结束后显示信件 */}
        {showLetter && isTripsCompleted && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 translate-x-24 z-30 animate-bounce">
            <button
              onClick={handleLetterClick}
              className="w-20 h-20 hover:scale-110 transition-transform cursor-pointer"
              aria-label={language === 'zh' ? '查看信件' : 'View Letter'}
            >
              <img 
                src="/decorations/letter.jpeg" 
                alt={language === 'zh' ? '来自宠物的信件' : 'Letter from Pet'} 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </button>
          </div>
        )}

        {/* 手帐按钮 */}
        <button
          onClick={handleJournalClick}
          className="fixed bottom-8 right-8 w-16 h-16 hover:scale-110 transition-transform z-50"
        >
          <img 
            src="/decorations/book.jpeg" 
            alt={language === 'zh' ? '旅行手帐' : 'Travel Journal'} 
            className="w-full h-full object-contain"
          />
        </button>

        {/* 信件弹窗 */}
        {showLetterModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #fefdf9 0%, #f9f7f4 100%)',
                border: '2px solid #e5ddd5'
              }}
            >
              {/* 关闭按钮 */}
              <button
                onClick={handleCloseLetterModal}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* 信件标题 */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">
                    {currentTripPlan.petCompanion.type === 'cat' ? '🐱' : 
                     currentTripPlan.petCompanion.type === 'dog' ? '🐶' : '🐹'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {language === 'zh' ? '来自小伙伴的信' : 'Letter from Your Companion'}
                </h3>
              </div>

              {/* 信件内容 */}
              <div 
                className="bg-white/80 rounded-xl p-6 border border-gray-200"
                style={{
                  fontFamily: 'PingFang SC, sans-serif',
                  lineHeight: '1.8'
                }}
              >
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {generateLetterContent()}
                </pre>
              </div>

              {/* 底部按钮 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseLetterModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  {language === 'zh' ? '收起信件' : 'Close Letter'}
                </button>
                <button
                  onClick={() => {
                    handleCloseLetterModal()
                    navigate('/home')
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition-colors"
                >
                  {language === 'zh' ? '回到主页' : 'Back to Home'}
                </button>
              </div>
            </div>
          </div>
        )}
    </WarmBg>
  )
}

export default TripJourneyView 