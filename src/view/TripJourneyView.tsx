import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
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

const TripJourneyView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [currentTime, setCurrentTime] = useState<string>('12:45')
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0)
  const [showMoodDialog, setShowMoodDialog] = useState<boolean>(false)
  const [showDressUpDialog, setShowDressUpDialog] = useState<boolean>(false)
  const [petMood, setPetMood] = useState<string>('')

  const { tripPlan, activities } = location.state || {}

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

  const generateMoodText = () => {
    if (!activities || activities.length === 0) return ''
    
    const currentActivity = activities[currentActivityIndex]
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
    setPetMood(moodText)
    setShowMoodDialog(true)
    
    setTimeout(() => {
      setShowMoodDialog(false)
    }, 3000)
  }

  const handleDressUpClick = () => {
    setShowDressUpDialog(true)
  }

  const handleNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
      toast.success(
        language === 'zh' ? '进入下一个活动！' : 'Moving to next activity!'
      )
    } else {
      toast.success(
        language === 'zh' ? '今天的行程全部完成！' : 'All activities completed for today!'
      )
      navigate('/home')
    }
  }

  if (!tripPlan || !activities) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  const currentActivity = activities[currentActivityIndex]
  const upcomingActivities = activities.slice(currentActivityIndex + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-green-50 relative overflow-hidden">
      {/* 装饰性植物 */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full text-green-400">
          <path d="M10,90 Q30,10 50,50 Q70,10 90,90" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.6"/>
          <circle cx="70" cy="35" r="6" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400">
          <path d="M20,80 Q40,20 60,60 Q80,20 95,85" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.7"/>
          <circle cx="80" cy="45" r="4" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* 顶部状态栏 */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
            <span className="text-lg">🐹</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">
                {language === 'zh' ? '豚豚君' : 'Pig-kun'}
              </span>
              <span className="text-lg">☀️</span>
            </div>
            <p className="text-xs text-gray-600">
              {language === 'zh' ? '正在：身着和服在水灵寺拍照' : 'Currently: Taking photos in kimono at Suirenji Temple'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{currentTime}</div>
          <div className="text-sm text-gray-600">
            {language === 'zh' ? `${tripPlan.cityName}` : tripPlan.cityName}
          </div>
        </div>
      </div>

      {/* 行程进度条 */}
      <div className="px-6 py-4 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'zh' ? '行程中' : 'In Progress'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${
                index <= currentActivityIndex ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-600 mt-1">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="w-full h-1 bg-gray-200 rounded"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-green-500 rounded transition-all duration-500"
            style={{ width: `${((currentActivityIndex + 1) / activities.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex flex-1 p-6 gap-6">
        {/* 左侧计划列表 */}
        <div className="w-80 bg-amber-50 rounded-2xl p-4 border-2 border-dashed border-amber-200 shadow-lg relative">
          <div className="absolute -top-3 -right-1 w-6 h-10 bg-green-400 rounded-full transform rotate-12"></div>
          <div className="absolute -top-1 right-1 w-4 h-6 bg-green-500 rounded-full transform -rotate-12"></div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'zh' ? '豚豚的探索计划' : 'Pig\'s Exploration Plan'}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-100 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{currentActivity.time}</span>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    {language === 'zh' ? '进行中' : 'In Progress'}
                  </span>
                </div>
                <div className="mt-1">
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
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {upcomingActivities.slice(0, 2).map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">{activity.time}</span>
                  </div>
                  <div className="mt-1">
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
          </div>

          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl font-medium transition-colors">
            <span className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4C3.45 4 3 4.45 3 5V18C3 18.55 3.45 19 4 19H17C17.55 19 18 18.55 18 18V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C18.89 2.11 19.39 1.9 19.91 1.9C20.43 1.9 20.93 2.11 21.32 2.5C21.71 2.89 21.92 3.39 21.92 3.91C21.92 4.43 21.71 4.93 21.32 5.32L12 14.64L8 16L9.36 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{language === 'zh' ? '调整计划' : 'Adjust Plan'}</span>
            </span>
          </button>
        </div>

        {/* 右侧地图区域 */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
            <div className="absolute inset-4 bg-green-200 rounded-lg opacity-60"></div>
            <div className="absolute top-16 left-20 w-20 h-16 bg-blue-200 rounded-lg opacity-80"></div>
            <div className="absolute bottom-20 right-24 w-16 h-12 bg-yellow-200 rounded-lg opacity-70"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <h3 className="font-bold text-lg text-gray-800">{tripPlan.cityName}</h3>
              </div>
            </div>
            
            <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">📍</span>
            </div>
          </div>
        </div>
      </div>

      {/* 小动物区域 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {showMoodDialog && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-lg max-w-xs relative">
                <p className="text-sm text-gray-700">{petMood}</p>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-3 h-3 bg-white transform rotate-45"></div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handlePetClick}
            className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg"
          >
            <span className="text-4xl">🐹</span>
          </button>
        </div>
      </div>

      {/* 装扮按钮 */}
      <button
        onClick={handleDressUpClick}
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-400 hover:bg-pink-500 rounded-full flex items-center justify-center shadow-lg transition-colors z-50"
      >
        <span className="text-2xl">👗</span>
      </button>

      {/* 装扮对话框 */}
      {showDressUpDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {language === 'zh' ? '装扮豚豚君' : 'Dress up Pig-kun'}
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['🎩', '👑', '🎀', '👒', '🧢', '🎭'].map((item, index) => (
                <button
                  key={index}
                  className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-2xl transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDressUpDialog(false)}
              className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-xl font-medium transition-colors"
            >
              {language === 'zh' ? '确定' : 'OK'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripJourneyView 