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
import { accessTokenAtom } from '@/store/AuthState'
import { MapboxMap } from '@/components/map/MapboxMap'
import PetDressUpModal, { DressUpItem } from '@/components/pet/PetDressUpModal'
import toast from 'react-hot-toast'
import { getUnifiedButtonStyle, getSecondaryButtonStyle, handleButtonHover, handleSecondaryButtonHover } from '@/utils/buttonStyles'
import { TripContentService } from '@/services/tripContentService'
import { 
  TripProgressCard, 
  TripPlanList, 
  LetterAnimation, 
  ContentModal, 
  BackgroundElements,
  GeneratedContent 
} from '@/components/trip'

const TripJourneyView: React.FC = () => {
  const navigate = useNavigate()
  const [language] = useAtom(selectedLanguageAtom)
  const [currentTime, setCurrentTime] = useState<string>('12:45')
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false)
  const [isJournalAnimating, setIsJournalAnimating] = useState<boolean>(false)
  const [letterAnimationStage, setLetterAnimationStage] = useState<'hidden' | 'appearing' | 'disappearing' | 'reappearing' | 'final'>('hidden')
  const [hasReadLetter, setHasReadLetter] = useState<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [showDressUpModal, setShowDressUpModal] = useState<boolean>(false)

  // 新增状态：管理生成的内容
  const [generatedContents, setGeneratedContents] = useState<Map<string, GeneratedContent>>(new Map())
  const [showContentModal, setShowContentModal] = useState<boolean>(false)
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)

  // 自定义虚线卡片样式已通过CSS类实现

  // 统一状态管理
  const [currentTripPlan] = useAtom(currentTripPlanAtom)
  const [tripProgress] = useAtom(tripProgressAtom)
  const [petTravelState, setPetTravelState] = useAtom(petTravelStateAtom)
  const [currentActivity] = useAtom(currentActivityAtom)
  const [, completeTrip] = useAtom(completeTripAtom)
  const [, clearCurrentTrip] = useAtom(clearCurrentTripAtom)
  const [accessToken] = useAtom(accessTokenAtom)

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



  // 添加地图数据调试
  useEffect(() => {
    if (currentTripPlan) {
      console.log('TripJourneyView: Map center coordinates:', [currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]])
      console.log('TripJourneyView: Route waypoints:', currentTripPlan.route.waypoints)
      console.log('TripJourneyView: First activity coordinates:', currentTripPlan.activities[0]?.coordinates)
    }
  }, [currentTripPlan])

  // 获取地图中心点坐标：优先使用第一个旅行活动的坐标，否则使用城市中心
  const getMapCenter = (): [number, number] => {
    if (!currentTripPlan) {
      return [35.0, 110.0] // 默认中国中心
    }
    
    // 如果有旅行活动，使用第一个活动的坐标
    if (currentTripPlan.activities && currentTripPlan.activities.length > 0) {
      const firstActivity = currentTripPlan.activities[0]
      return [firstActivity.coordinates[1], firstActivity.coordinates[0]] // 转换 [lng, lat] -> [lat, lng]
    }
    
    // 否则使用城市中心坐标
    return [currentTripPlan.cityCoordinates[1], currentTripPlan.cityCoordinates[0]]
  }

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

  const handlePetClick = () => {
    setShowDressUpModal(true)
  }

  const handleDressUpSave = (selectedItem: DressUpItem | null) => {
    setPetTravelState(prev => ({
      ...prev,
      dressUpItem: selectedItem
    }))
    
    if (selectedItem) {
      toast.success(
        language === 'zh' 
          ? `已为${currentTripPlan?.petCompanion.name}添加${selectedItem.name}装扮`
          : `Added ${selectedItem.nameEn} dressing up for ${currentTripPlan?.petCompanion.name}`
      )
    } else {
      toast.success(
        language === 'zh' 
          ? `已移除${currentTripPlan?.petCompanion.name}的装扮`
          : `Removed dressing up for ${currentTripPlan?.petCompanion.name}`
      )
    }
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

  // 处理时间轴圆点点击事件
  const handleTimelinePointClick = async (activity: any, index: number, event: React.MouseEvent) => {
    // 阻止事件冒泡，避免触发父级卡片的点击事件
    event.stopPropagation()
    
    if (!currentTripPlan) return

    const activityId = activity.id
    
    // 检查是否已经生成过内容
    if (generatedContents.has(activityId)) {
      const existingContent = generatedContents.get(activityId)!
      setSelectedContent(existingContent)
      setShowContentModal(true)
      return
    }

    // 设置加载状态
    const loadingContent: GeneratedContent = {
      activityId,
      isLoading: true
    }
    setGeneratedContents(prev => new Map(prev.set(activityId, loadingContent)))

    try {
      // 显示开始生成的提示
      toast.loading(language === 'zh' ? '正在生成旅行照片和故事...' : 'Generating travel photo and story...', {
        id: `generating-${activityId}`
      })

      // 并行调用图片生成和故事生成API
      const [imageResult, storyResult] = await Promise.allSettled([
        generateTravelImage(activity),
        generateTravelStory(activity)
      ])

      let imageUrl: string | undefined
      let story: any
      let error: string | undefined

      // 处理图片生成结果
      if (imageResult.status === 'fulfilled') {
        imageUrl = imageResult.value
      } else {
        console.error('图片生成失败:', imageResult.reason)
        error = '图片生成失败'
      }

      // 处理故事生成结果  
      if (storyResult.status === 'fulfilled') {
        story = storyResult.value
      } else {
        console.error('故事生成失败:', storyResult.reason)
        error = error ? `${error}，故事生成失败` : '故事生成失败'
      }

      // 更新生成的内容
      const finalContent: GeneratedContent = {
        activityId,
        imageUrl,
        story,
        isLoading: false,
        error
      }

      setGeneratedContents(prev => new Map(prev.set(activityId, finalContent)))
      setSelectedContent(finalContent)
      setShowContentModal(true)

      // 关闭加载提示
      toast.dismiss(`generating-${activityId}`)
      
      if (error) {
        toast.error(error)
      } else {
        toast.success(language === 'zh' ? '内容生成完成！' : 'Content generated successfully!')
      }
      
    } catch (error) {
      console.error('生成内容时发生错误:', error)
      const errorContent: GeneratedContent = {
        activityId,
        isLoading: false,
        error: language === 'zh' ? '生成失败，请重试' : 'Generation failed, please try again'
      }
      
      setGeneratedContents(prev => new Map(prev.set(activityId, errorContent)))
      toast.dismiss(`generating-${activityId}`)
      toast.error(language === 'zh' ? '生成失败，请重试' : 'Generation failed, please try again')
    }
  }

  // 生成旅行图片
  const generateTravelImage = async (activity: any): Promise<string> => {
    if (!accessToken) {
      throw new Error('用户未登录')
    }

    const petInfo = currentTripPlan!.petCompanion
    const imagePrompt = TripContentService.buildImagePrompt(activity, petInfo, language)
    
    return await TripContentService.generateTravelImage(imagePrompt, accessToken)
  }

  // 生成旅行故事
  const generateTravelStory = async (activity: any): Promise<{time: string, name: string, description: string}> => {
    if (!accessToken) {
      throw new Error('用户未登录')
    }

    const petInfo = currentTripPlan!.petCompanion
    const cityName = currentTripPlan!.cityName
    const storyPrompt = TripContentService.buildStoryPrompt(activity, petInfo, cityName, language)
    
    const storyContent = await TripContentService.generateTravelStory(storyPrompt, accessToken)

    return {
      time: activity.time,
      name: language === 'zh' ? activity.location : activity.locationEn,
      description: storyContent
    }
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
    petFriendlyIndex: 75, // 所有活动点统一宠物友好度
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
      
      {/* 背景元素 */}
      <BackgroundElements
        currentTripPlan={currentTripPlan}
        language={language}
        getMapCenter={getMapCenter}
        mapPoints={mapPoints}
        mapRoutes={mapRoutes}
      />

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
        <TripProgressCard
          currentTripPlan={currentTripPlan}
          currentActivity={currentActivity}
          tripProgress={tripProgress}
          currentTime={currentTime}
          language={language}
          generatedContents={generatedContents}
          onTimelinePointClick={handleTimelinePointClick}
          formatTimeToAMPM={formatTimeToAMPM}
        />

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
                     <div 
                       className="relative cursor-pointer transition-all hover:scale-110" 
                       onClick={(event) => handleTimelinePointClick(activity, index, event)}
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" viewBox="0 0 41 41" fill="none">
                         <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fill-opacity="0.22"/>
                       </svg>
                       
                       {/* 加载状态指示器 */}
                       {generatedContents.has(activity.id) && generatedContents.get(activity.id)?.isLoading && (
                         <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-4 h-4 border-2 border-[#687949] border-t-transparent rounded-full animate-spin"></div>
                         </div>
                       )}
                       
                       {/* 生成完成指示器 */}
                       {generatedContents.has(activity.id) && !generatedContents.get(activity.id)?.isLoading && !generatedContents.get(activity.id)?.error && (
                         <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                       )}
                       
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
                           {language === 'zh' ? activity.description : activity.description}
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

      {/* 生成内容展示弹窗 */}
      <AnimatePresence>
        {showContentModal && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[30000]"
            onClick={() => setShowContentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                rotateY: { type: "spring", stiffness: 400, damping: 25 }
              }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-[90vw] max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, #FDF5E8 0%, #F9F2E2 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setShowContentModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 flex items-center justify-center transition-all"
                aria-label={language === 'zh' ? '关闭' : 'Close'}
                title={language === 'zh' ? '关闭' : 'Close'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#687949" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* 信封动画效果 */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-6"
              >
                <div className="inline-block relative">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-[#687949]">
                      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6029 13.5963 11.995 13.5963C12.3871 13.5963 12.7713 13.4793 13.1 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold mt-4" style={{ color: '#687949' }}>
                  {language === 'zh' 
                    ? `${currentTripPlan?.petCompanion?.name || '豚豚'}的旅行分享`
                    : `${currentTripPlan?.petCompanion?.name || 'Pet'}'s Travel Share`
                  }
                </h2>
              </motion.div>

              {/* 内容区域 */}
              <div className="flex gap-8 items-start">
                {/* 左侧：图片 */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-1/2"
                >
                  {selectedContent.imageUrl ? (
                    <div className="relative">
                      <img 
                        src={selectedContent.imageUrl}
                        alt="旅行照片"
                        className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                        style={{
                          border: '8px solid #F3E2B6',
                          transform: 'rotate(-2deg)'
                        }}
                      />
                      {/* 照片装饰 */}
                      <div 
                        className="absolute -top-2 -right-2 w-8 h-8 bg-[#F3E2B6] rounded-full shadow-md"
                        style={{ transform: 'rotate(15deg)' }}
                      >
                        <div className="w-full h-full bg-[#687949] rounded-full scale-50 m-auto mt-2"></div>
                      </div>
                    </div>
                  ) : selectedContent.isLoading ? (
                    <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#687949] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                      {language === 'zh' ? '照片生成失败' : 'Image generation failed'}
                    </div>
                  )}
                </motion.div>

                {/* 右侧：故事内容 */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-1/2"
                >
                  {selectedContent.story ? (
                    <div 
                      className="p-6 rounded-2xl relative"
                      style={{
                        background: '#F9F2E2',
                        border: '2px dashed #D1BA9E'
                      }}
                    >
                      {/* 标题 */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#687949' }}>
                          {selectedContent.story.name}
                        </h3>
                        <div className="text-sm" style={{ color: '#A6A196' }}>
                          {selectedContent.story.time} · {language === 'zh' ? '天气晴朗' : 'Sunny Weather'} ☀️
                        </div>
                      </div>

                      {/* 引号装饰 */}
                      <div 
                        className="absolute top-4 left-4 text-4xl opacity-50"
                        style={{ color: '#687949' }}
                      >
                        "
                      </div>
                      
                      {/* 故事内容 */}
                      <div 
                        className="text-base leading-relaxed pt-8 px-4 pb-4"
                        style={{ color: '#687949' }}
                      >
                        {selectedContent.story.description}
                      </div>
                      
                      <div 
                        className="absolute bottom-4 right-4 text-4xl opacity-50"
                        style={{ color: '#687949' }}
                      >
                        "
                      </div>

                      {/* 推荐指数 */}
                      <div className="flex items-center justify-center mt-4 pt-4 border-t border-[#EADDC7]">
                        <span className="text-sm mr-2" style={{ color: '#A6A196' }}>
                          {language === 'zh' ? '推荐指数' : 'Rating'}
                        </span>
                        <div className="flex text-yellow-500">
                          {'⭐'.repeat(Math.floor(Math.random() * 2) + 4)}
                        </div>
                      </div>
                    </div>
                  ) : selectedContent.isLoading ? (
                    <div className="p-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-6 h-6 border-4 border-[#687949] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <div className="text-sm text-gray-500">
                          {language === 'zh' ? '正在生成故事...' : 'Generating story...'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-gray-100 text-center text-gray-500">
                      {language === 'zh' ? '故事生成失败' : 'Story generation failed'}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* 底部按钮 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center mt-8"
              >
                <button 
                  onClick={() => setShowContentModal(false)}
                  className="px-8 py-3 rounded-full transition-all hover:scale-105"
                  style={{
                    background: '#687949',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(104, 121, 73, 0.3)'
                  }}
                >
                  {language === 'zh' ? '收藏这份美好' : 'Treasure This Moment'}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TripJourneyView 