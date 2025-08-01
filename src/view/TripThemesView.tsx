import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import { authStateAtom } from '@/store/AuthState'
import { mockRegionsData } from '@/data/mockData'
import { WarmBg } from '@/components/bg/WarmBg'
import type { TripTheme } from '@/store/TripState'
import toast from 'react-hot-toast'
import clipImage from '@/assets/夹子.jpg'
import { getUnifiedButtonStyle, handleButtonHover } from '@/utils/buttonStyles'
import { TripPlanningService, type TripPlanningRequest } from '@/services/tripPlanningService'
// import { XhsService } from '@/services/xhsService' // 已移除：小红书服务已禁用

const tripThemes: TripTheme[] = [
  {
    id: 'photography',
    name: '拍照打卡',
    nameEn: 'Photography',
    icon: '📸',
    description: '寻找最美的角度记录旅程',
    descriptionEn: 'Find the most beautiful angles to record your journey',
    gradient: 'from-pink-400 to-purple-500',
    popularity: 95
  },
  {
    id: 'nature',
    name: '自然疗愈',
    nameEn: 'Nature Healing',
    icon: '🌿',
    description: '想去感受一下风、雨和山林',
    descriptionEn: 'Want to feel the wind, rain and forests',
    gradient: 'from-green-400 to-emerald-500',
    popularity: 90
  },
  {
    id: 'culture',
    name: '人文体验',
    nameEn: 'Cultural Experience',
    icon: '🏛️',
    description: '想感受一下当地的文化',
    descriptionEn: 'Want to experience the local culture',
    gradient: 'from-blue-400 to-indigo-500',
    popularity: 82
  },
  {
    id: 'random',
    name: '随机探索',
    nameEn: 'Random Adventure',
    icon: '🎲',
    description: '让小宠物来决定吧',
    descriptionEn: 'Let the little pet decide',
    gradient: 'from-purple-400 to-pink-500',
    popularity: 88
  }
]

const TripThemesView: React.FC = () => {
  const navigate = useNavigate()
  const { cityId } = useParams<{ cityId: string }>()
  const [language] = useAtom(selectedLanguageAtom)
  const [authState] = useAtom(authStateAtom)
  const petInfo = authState.user?.petInfo
  const [cityData, setCityData] = useState<any>(null)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 根据宠物类型获取装饰图片
  const getPetDecoration = () => {
    // 调试信息
    console.log('authState.user:', authState.user)
    console.log('petInfo:', petInfo)
    
    // 如果用户没有登录或没有宠物信息，显示默认水豚
    if (!authState.user || !petInfo) {
      console.log('使用默认装饰：水豚')
      return {
        src: '/decorations/capybara.jpeg',
        alt: language === 'zh' ? '水豚装饰' : 'Capybara decoration'
      }
    }
    
    if (petInfo.avatar) {
      // 如果有自定义头像，直接使用
      console.log('使用自定义头像:', petInfo.avatar)
      return {
        src: petInfo.avatar,
        alt: petInfo.name || (language === 'zh' ? '宠物装饰' : 'Pet decoration')
      }
    }
    
    // 根据宠物类型返回对应图片
    console.log('根据宠物类型选择:', petInfo.type)
    switch (petInfo.type) {
      case 'cat':
        return {
          src: '/decorations/cat.png',
          alt: language === 'zh' ? '小喵装饰' : 'Cat decoration'
        }
      case 'dog':
        return {
          src: '/decorations/fox.png', // 使用狐狸图片作为狗的装饰
          alt: language === 'zh' ? '小狗装饰' : 'Dog decoration'
        }
      case 'other':
        return {
          src: '/decorations/capybara.jpeg',
          alt: language === 'zh' ? '水豚装饰' : 'Capybara decoration'
        }
      case 'none':
      case undefined:
      case null:
      default:
        // 默认显示水豚
        return {
          src: '/decorations/capybara.jpeg',
          alt: language === 'zh' ? '水豚装饰' : 'Capybara decoration'
        }
    }
  }

  useEffect(() => {
    if (cityId) {
      const city = mockRegionsData[cityId]
      setCityData(city)
    }
  }, [cityId])

  const handleThemeSelect = async (themeId: string) => {
    if (!cityData) {
      toast.error(language === 'zh' ? '城市数据未加载' : 'City data not loaded')
      return
    }

    if (!authState.accessToken) {
      toast.error(language === 'zh' ? '请先登录' : 'Please login first')
      navigate('/auth')
      return
    }

    if (!petInfo || !petInfo.name) {
      toast.error(language === 'zh' ? '请先设置宠物信息' : 'Please set pet information first')
      navigate('/pet-initialization')
      return
    }

    setIsGenerating(true)
    
    try {
      // 显示开始生成的提示
      const loadingToast = toast.loading(
        language === 'zh' ? '正在生成专属旅行计划...' : 'Generating exclusive trip plan...'
      )

      // 获取选择的主题信息
      const selectedThemeData = tripThemes.find(t => t.id === themeId)
      const themeNames = selectedThemeData ? [
        language === 'zh' ? selectedThemeData.name : selectedThemeData.nameEn
      ] : []

      // 构建旅行规划请求
      const planningRequest: TripPlanningRequest = {
        cityName: language === 'zh' ? cityData.name : cityData.nameEn,
        cityNameEn: cityData.nameEn || cityData.name,
        themes: [themeId],
        themeNames,
        duration: 1, // 默认1天
        petInfo,
        language,
      }

      console.log('开始生成旅行计划:', planningRequest)

      // 调用旅行规划服务
      const response = await TripPlanningService.generateTripPlan(
        planningRequest,
        authState.accessToken
      )

      toast.dismiss(loadingToast)

      if (response.success && response.data) {
        toast.success(
          language === 'zh' 
            ? `成功生成旅行计划！包含${response.data.activities.length}个活动` 
            : `Trip plan generated! Including ${response.data.activities.length} activities`,
          { duration: 3000 }
        )

        // 导航到旅行计划页面，传递生成的数据
        navigate('/trip-plan', { 
          state: { 
            tripPlan: {
              cityId,
              cityName: planningRequest.cityName,
              themes: planningRequest.themes,
              selectedThemeNames: themeNames
            },
            generatedPlan: response.data,
            isAiGenerated: true
          } 
        })
      } else {
        throw new Error(response.error || '生成计划失败')
      }
    } catch (error: any) {
      console.error('旅行计划生成失败:', error)
      
      toast.error(
        language === 'zh' 
          ? `生成失败：${error.message}` 
          : `Generation failed: ${error.message}`,
        { duration: 5000 }
      )

             // 如果是服务连接问题，提供备用方案
       if (error.message.includes('连接') || error.message.includes('connect')) {
         toast(
           language === 'zh' 
             ? '将为您切换到离线模式生成计划' 
             : 'Switching to offline mode for plan generation',
           { icon: '💡', duration: 3000 }
         )
         
         // 重新获取主题名称用于备用计划
         const selectedThemeData = tripThemes.find(t => t.id === themeId)
         const fallbackThemeNames = selectedThemeData ? [
           language === 'zh' ? selectedThemeData.name : selectedThemeData.nameEn
         ] : []
         
         // 使用原有的简化旅行计划数据作为备用
         const fallbackPlan = {
           cityId,
           cityName: language === 'zh' ? cityData.name : cityData.nameEn,
           themes: [themeId],
           selectedThemeNames: fallbackThemeNames
         }

         navigate('/trip-plan', { 
           state: { tripPlan: fallbackPlan } 
         })
       }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (!cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-[3vh] h-[3vh] border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-[1.5vh]"></div>
          <p className="text-gray-600 text-[1.4vh]">{language === 'zh' ? '加载中...' : 'Loading...'}</p>
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
          src={getPetDecoration().src}
          alt={getPetDecoration().alt}
          className="w-[35vh] h-[35vh] object-contain transition-opacity duration-300"
          onError={(e) => {
            console.error('图片加载失败:', getPetDecoration().src)
            console.error('完整URL:', e.currentTarget.src)
            // 如果图片加载失败，尝试加载水豚图片作为备用
            const fallbackUrl = window.location.origin + '/decorations/capybara.jpeg'
            if (e.currentTarget.src !== fallbackUrl) {
              e.currentTarget.src = fallbackUrl
            }
          }}
          onLoad={() => {
            console.log('图片加载成功:', getPetDecoration().src)
          }}
        />
      </div>

      {/* 主要内容 */}
      <div className="px-[2.2vh] py-[3vh]">
        {/* 主标题 */}
        <div className="text-center mb-[3vh]">
          <h1 className="wanderpaw-title text-4xl md:text-5xl font-bold text-[#687949] dark:text-amber-200 mb-[1.5vh]">
            WanderPaw
          </h1>
          <p className="text-[1.8vh] text-[#687949] dark:text-amber-300 font-medium">
            小伙伴将代您探索世界
          </p>
        </div>

        {/* 主题选择卡片 */}
        <div 
          className="mx-auto max-w-2xl pt-[3vh] pb-[3vh] px-[4.4vh] mb-[3vh] relative z-10"
          style={{
            borderRadius: '3.5vh',
            background: '#FEFDF9',
            boxShadow: '0 0.2vh 3.2vh 0.3vh rgba(123, 66, 15, 0.11)'
          }}
        >
          {/* 夹子装饰 */}
          <div className="absolute -top-[8vh] -right-[8vh] z-20">
            <img 
              src={clipImage} 
              alt="Clip decoration"
              className="w-[18vh] h-[18vh] object-contain transform rotate-12"
            />
          </div>
          
          {/* 卡片标题 */}
          <div className="text-center mb-[3vh]">
            <h2 
              className="mb-[1.5vh]"
              style={{
                color: '#687949',
                fontFamily: '"PingFang SC"',
                fontSize: '2.5vh',
                fontWeight: 600,
                lineHeight: 'normal'
              }}
            >
              选择本次旅行的主题
            </h2>
            <p 
              style={{
                color: '#ADA89E',
                fontFamily: '"PingFang SC"',
                fontSize: '1.5vh',
                fontWeight: 400,
                lineHeight: 'normal'
              }}
            >
              为这次旅行定个调调吧
            </p>
          </div>

          {/* 主题网格 - 四宫格布局 */}
          <div className="grid grid-cols-2 gap-[1.5vh]">
            {tripThemes.slice(0, 4).map((theme) => {
              const isSelected = selectedTheme === theme.id
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 p-[1.5vh] h-[18vh] flex items-center justify-center"
                  style={{
                    borderRadius: '1vh',
                    border: '0.2vh solid #E5E2DC',
                    background: isSelected ? '#F0F3EA' : 'transparent'
                  }}
                >
                  {/* 内容 */}
                  <div className="text-center">
                    <div className="mb-[1.1vh] flex justify-center">
                      {theme.id === 'photography' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="4.5vh" height="4.5vh" viewBox="0 0 60 60" fill="none">
                          <path d="M55.3379 31.9645C54.5099 31.9645 53.8379 31.2925 53.8379 30.4645V29.7715C53.8379 28.9435 54.5099 28.2715 55.3379 28.2715C56.1659 28.2715 56.8379 28.9435 56.8379 29.7715V30.4645C56.8379 31.2925 56.1659 31.9645 55.3379 31.9645Z" fill="#687949"/>
                          <path d="M46.3372 52.1736H13.7812C7.99125 52.1736 3.28125 47.1696 3.28125 41.0196V25.4976C3.28125 19.3476 7.99125 14.3436 13.7812 14.3436H15.4462C15.7372 14.3436 16.0132 14.2026 16.1842 13.9686L18.9292 10.2276C20.4442 8.08863 23.1892 7.51562 24.5782 7.51562H36.1342C37.6042 7.51562 40.4302 8.12762 41.7862 10.4136L44.2462 13.9206C44.4292 14.1906 44.7112 14.3406 45.0172 14.3406H46.3402C52.1302 14.3406 56.8402 19.3446 56.8402 25.4946C56.8402 26.3226 56.1682 26.9946 55.3402 26.9946C54.5122 26.9946 53.8402 26.3226 53.8402 25.4946C53.8402 20.9976 50.4772 17.3406 46.3402 17.3406H45.0172C43.7182 17.3406 42.5062 16.6986 41.7772 15.6246L39.2962 12.0876C39.2692 12.0486 39.2452 12.0126 39.2242 11.9736C38.5942 10.8756 36.8722 10.5186 36.1372 10.5186H24.5782C24.0112 10.5186 22.2082 10.7856 21.3742 11.9676C21.3682 11.9766 21.3622 11.9856 21.3562 11.9916L18.6022 15.7416C18.238 16.2365 17.7627 16.639 17.2146 16.9168C16.6664 17.1945 16.0607 17.3397 15.4462 17.3406H13.7812C9.64425 17.3406 6.28125 21.0006 6.28125 25.4946V41.0136C6.28125 45.5106 9.64425 49.1676 13.7812 49.1676H46.3342C50.4712 49.1676 53.8342 45.5076 53.8342 41.0136V34.6686C53.8342 33.8406 54.5062 33.1686 55.3342 33.1686C56.1622 33.1686 56.8342 33.8406 56.8342 34.6686V41.0136C56.8372 47.1696 52.1272 52.1736 46.3372 52.1736Z" fill="#687949"/>
                          <path d="M30.06 42.6544C24.486 42.6544 19.953 38.1184 19.953 32.5474C19.953 26.9764 24.486 22.4404 30.06 22.4404C35.634 22.4404 40.167 26.9764 40.167 32.5474C40.167 38.1184 35.634 42.6544 30.06 42.6544ZM30.06 25.4374C26.142 25.4374 22.953 28.6264 22.953 32.5444C22.953 36.4624 26.142 39.6514 30.06 39.6514C33.978 39.6514 37.167 36.4624 37.167 32.5444C37.167 28.6264 33.981 25.4374 30.06 25.4374ZM16.296 24.6094H11.625C10.797 24.6094 10.125 23.9374 10.125 23.1094C10.125 22.2814 10.797 21.6094 11.625 21.6094H16.296C17.124 21.6094 17.796 22.2814 17.796 23.1094C17.796 23.9374 17.124 24.6094 16.296 24.6094Z" fill="#687949"/>
                        </svg>
                      ) : theme.id === 'nature' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="4.5vh" height="4.5vh" viewBox="0 0 49 49" fill="none">
                          <g clipPath="url(#clip0_5036_10360)">
                            <path d="M24.5383 4.55547C24.1172 4.55547 23.7727 4.21094 23.7727 3.78984V0.957031C23.7727 0.535937 24.1172 0.191406 24.5383 0.191406C24.9594 0.191406 25.3039 0.535937 25.3039 0.957031V3.78984C25.3039 4.21094 24.9594 4.55547 24.5383 4.55547ZM28.6344 48.8086C25.9547 48.8086 23.7344 46.6266 23.7344 43.9086V26.95C23.7344 26.5289 24.0789 26.1844 24.5 26.1844C24.9211 26.1844 25.2656 26.5289 25.2656 26.95V43.9086C25.2656 45.7461 26.7586 47.2773 28.6344 47.2773C30.4719 47.2773 32.0031 45.7844 32.0031 43.9086C32.0031 43.4875 32.3477 43.143 32.7687 43.143C33.1898 43.143 33.5344 43.4875 33.5344 43.9086C33.5344 46.6266 31.3141 48.8086 28.6344 48.8086Z" fill="#687949" stroke="#687949"/>
                            <path d="M12.7467 27.7157C12.5553 27.7157 12.3639 27.5625 12.3639 27.3711C12.3639 27.1797 11.4451 9.37895 24.3459 3.44535C24.5373 3.36879 24.767 3.44535 24.8436 3.63676C24.9201 3.82817 24.8436 4.05785 24.6522 4.13442C12.249 9.83832 13.1295 27.1414 13.1295 27.3329C13.1295 27.5243 12.9764 27.7157 12.7467 27.7157Z" fill="#687949"/>
                            <path d="M36.2145 27.7157C35.9848 27.7157 35.8316 27.5243 35.8316 27.2946C35.8316 27.1032 36.7121 9.83832 24.2707 4.13442C24.1176 4.05785 24.0027 3.82817 24.1176 3.63676C24.1941 3.44535 24.4238 3.36879 24.6152 3.44535C37.516 9.37895 36.6355 27.1797 36.5973 27.3711C36.5973 27.5625 36.4441 27.7157 36.2145 27.7157ZM12.748 27.7157C12.5566 27.7157 12.3652 27.5625 12.3652 27.3711V27.2946C12.3652 27.1032 12.5184 26.9118 12.748 26.9118C12.9395 26.9118 13.1309 27.0649 13.1309 27.2946V27.3711C13.1309 27.5625 12.9777 27.7157 12.748 27.7157Z" fill="#687949"/>
                            <path d="M24.4992 4.59297C24.3844 4.59297 24.2695 4.55469 24.193 4.51641C23.8867 4.36328 23.657 4.01875 23.7336 3.63594C23.8102 3.29141 24.1164 3.02344 24.4609 3.02344H24.5375C24.882 3.02344 25.1883 3.29141 25.3031 3.63594C25.3797 3.98047 25.1883 4.325 24.882 4.47812C24.882 4.47812 24.8437 4.47813 24.8437 4.51641C24.6906 4.55469 24.5758 4.59297 24.4992 4.59297Z" fill="#687949"/>
                            <path d="M24.501 4.59434C24.3861 4.59434 24.3096 4.55606 24.1947 4.51778H24.1564C23.8885 4.40294 23.6971 4.09669 23.7353 3.82872C23.7353 3.52247 23.8885 3.2545 24.1564 3.13965C24.3861 3.02481 24.6924 3.06309 24.9221 3.17794C25.1518 3.33106 25.3049 3.56075 25.3049 3.82872C25.3049 4.09669 25.1518 4.36465 24.9603 4.4795C24.8072 4.55606 24.6541 4.59434 24.501 4.59434Z" fill="#687949"/>
                            <path d="M24.5391 27.7162C24.3094 27.7162 24.1562 27.563 24.1562 27.3333V3.82866C24.1562 3.71382 24.2328 3.56069 24.3477 3.52241C24.4625 3.44585 24.6156 3.44585 24.7305 3.48413C36.2531 8.8435 36.7125 23.6966 36.6742 26.606C36.6742 26.7974 36.5211 26.9888 36.3297 26.9888C36.1383 26.9888 35.9469 26.8357 35.9469 26.6443C35.6023 23.888 33.2672 21.8208 30.4727 21.8208C27.4484 21.8208 24.9602 24.2708 24.9602 27.3333C24.9219 27.563 24.7305 27.7162 24.5391 27.7162ZM24.9219 4.44116V24.3474C25.9937 22.3951 28.0609 21.0935 30.4344 21.0935C32.693 21.0935 34.6836 22.2802 35.7937 24.1177C35.4109 19.0263 33.5352 8.8435 24.9219 4.44116Z" fill="#687949" stroke="#687949"/>
                            <path d="M12.7469 27.7158C12.5172 27.7158 12.364 27.5627 12.364 27.333V27.2947C12.3258 26.5674 11.675 9.30254 24.3078 3.48379C24.4226 3.44551 24.5375 3.44551 24.614 3.48379H24.6523C24.7672 3.56035 24.882 3.6752 24.882 3.82832V27.333C24.882 27.5627 24.7289 27.7158 24.4992 27.7158C24.2695 27.7158 24.1164 27.5627 24.1164 27.333C24.1164 24.3088 21.6664 21.8205 18.6039 21.8205C15.5797 21.8205 13.0914 24.2705 13.0914 27.333C13.1297 27.5627 12.9765 27.7158 12.7469 27.7158ZM18.6422 21.0549C21.0156 21.0549 23.0828 22.3947 24.1547 24.3088V4.40254C15.3883 8.80488 13.5508 19.0643 13.2062 24.2322C14.2781 22.3564 16.307 21.0549 18.6422 21.0549Z" fill="#687949" stroke="#687949"/>
                            <path d="M36.2899 28.0977C35.8689 28.0977 35.5243 27.7531 35.5243 27.332C35.5243 24.4992 33.2274 22.2023 30.3946 22.2023C27.5618 22.2023 25.2649 24.4992 25.2649 27.332C25.2649 27.7531 24.9204 28.0977 24.4993 28.0977C24.0782 28.0977 23.7337 27.7531 23.7337 27.332C23.7337 24.4992 21.4368 22.2023 18.604 22.2023C15.7712 22.2023 13.4743 24.4992 13.4743 27.332C13.4743 27.7531 13.1298 28.0977 12.7087 28.0977C12.2876 28.0977 11.9431 27.7531 11.9431 27.332C11.9431 24.4992 9.6462 22.2023 6.81339 22.2023C4.24854 22.2023 2.06651 24.1164 1.72198 26.643C1.6837 27.0641 1.30089 27.332 0.879793 27.2938C0.458699 27.2555 0.152449 26.9109 0.190731 26.4898C0.420418 20.1734 3.02354 14.2781 7.57901 9.87578C12.1345 5.47344 18.1446 3.02344 24.4993 3.02344C30.854 3.02344 36.8642 5.47344 41.4196 9.87578C45.9751 14.2781 48.5782 20.1734 48.8079 26.4898C48.8079 26.9109 48.5017 27.2555 48.1189 27.2938C47.6978 27.332 47.3532 27.0258 47.2767 26.643C46.9321 24.1164 44.7501 22.2023 42.1853 22.2023C39.3524 22.2023 37.0556 24.4992 37.0556 27.332C37.0556 27.7531 36.711 28.0977 36.2899 28.0977ZM6.81339 20.6711C9.37823 20.6711 11.5985 22.1258 12.7087 24.2312C13.8189 22.1258 16.0392 20.6711 18.604 20.6711C21.1689 20.6711 23.3892 22.1258 24.4993 24.2312C25.6095 22.1258 27.8298 20.6711 30.3946 20.6711C32.9595 20.6711 35.1798 22.1258 36.2899 24.2312C37.4001 22.1258 39.6204 20.6711 42.1853 20.6711C43.9462 20.6711 45.554 21.3602 46.779 22.5086C44.597 12.1727 35.486 4.55469 24.4993 4.55469C13.5126 4.55469 4.43995 12.1727 2.21964 22.5086C3.44464 21.3602 5.05245 20.6711 6.81339 20.6711Z" fill="#687949" stroke="#687949"/>
                          </g>
                          <defs>
                            <clipPath id="clip0_5036_10360">
                              <rect width="49" height="49" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                      ) : theme.id === 'culture' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="4.5vh" height="2.7vh" viewBox="0 0 81 48" fill="none">
                          <path d="M23.9879 9.74194C24.1132 10.0075 24.2356 10.2791 24.352 10.5611C24.6295 11.2102 25.3771 11.5087 26.0202 11.2296C26.6634 10.9506 26.9678 10.1971 26.6858 9.54945C26.5529 9.23162 26.4127 8.92423 26.2739 8.62579C25.9695 7.98863 25.2115 7.72452 24.5773 8.0334C23.9431 8.33929 23.6805 9.10776 23.9879 9.74194Z" fill="#687949"/>
                          <path d="M39.1657 5.33488C39.1762 5.62884 39.1822 5.92727 39.1792 6.23168C39.1822 6.93748 39.7566 7.50451 40.455 7.49854C41.1578 7.49406 41.7293 6.91659 41.7263 6.21079C41.7278 5.86759 41.7189 5.53035 41.7054 5.20058C41.6741 4.49627 41.0787 3.9561 40.3744 3.99192C39.6716 4.02773 39.1299 4.63057 39.1657 5.33488Z" fill="#687949"/>
                          <path d="M26.372 15.6889C25.7573 14.2444 25.8334 12.8254 26.5481 12.5225C27.2584 12.2181 28.3357 13.1507 28.9461 14.5936L40.7731 42.4302C41.3863 43.8746 41.3102 45.2907 40.597 45.5936C39.8852 45.8965 38.8108 44.9684 38.1976 43.524L26.372 15.6889Z" fill="#687949"/>
                          <path d="M13.6361 16.7949C13.8136 17.0322 13.9897 17.2799 14.1583 17.5366C14.5627 18.126 15.3685 18.2737 15.949 17.8678C16.5339 17.4634 16.6831 16.6562 16.2787 16.0668C16.0832 15.7788 15.8818 15.5012 15.6863 15.2326C15.2566 14.6596 14.4523 14.5477 13.8838 14.979C13.3153 15.4117 13.2048 16.2249 13.6361 16.7949Z" fill="#687949"/>
                          <path d="M17.4327 21.9789C16.4046 20.7926 16.042 19.4213 16.6284 18.9125C17.2134 18.4051 18.522 18.9617 19.5486 20.1435L39.3543 42.9888C40.3809 44.1751 40.745 45.5464 40.1571 46.0537C39.5737 46.5596 38.2635 46.0105 37.2399 44.8212L17.4327 21.9789Z" fill="#687949"/>
                          <path d="M39.0767 11.3872C39.0841 9.77718 39.7228 8.476 40.4957 8.48048C41.2687 8.48346 41.885 9.79658 41.8775 11.4022L41.6969 42.3679C41.688 43.9749 41.0553 45.2761 40.2824 45.2716C39.5079 45.2687 38.8872 43.96 38.9006 42.3529L39.0767 11.3872Z" fill="#687949"/>
                          <path d="M53.3684 8.40031C53.2774 8.67934 53.1804 8.96137 53.073 9.24637C52.8327 9.9089 53.1744 10.6401 53.834 10.8743C54.495 11.1131 55.2337 10.7684 55.4724 10.1044C55.5933 9.78207 55.6992 9.46274 55.8022 9.14789C56.017 8.47492 55.6455 7.76315 54.971 7.55424C54.2981 7.34832 53.5803 7.72584 53.3684 8.40031Z" fill="#687949"/>
                          <path d="M50.803 13.9663C51.376 12.4339 52.4295 11.4088 53.1547 11.6803C53.8799 11.9519 53.9963 13.4187 53.4248 14.9482L42.3722 44.4665C41.7977 45.9989 40.7472 47.0211 40.0235 46.7495C39.2983 46.4779 39.176 45.0171 39.752 43.4846L50.803 13.9663Z" fill="#687949"/>
                          <path d="M65.1166 15.2409C64.9286 15.4662 64.7287 15.69 64.5242 15.9139C64.0512 16.4361 64.09 17.2419 64.6108 17.7104C65.1345 18.1805 65.9448 18.1417 66.4193 17.6164C66.6506 17.3658 66.8714 17.1106 67.0848 16.8584C67.5369 16.3168 67.4623 15.5169 66.9177 15.0678C66.3745 14.6201 65.5658 14.6992 65.1166 15.2409Z" fill="#687949"/>
                          <path d="M61.1385 20.0218C62.2158 18.8564 63.5528 18.3357 64.1228 18.8609C64.6928 19.3862 64.2705 20.759 63.1962 21.9214L42.4295 44.3712C41.3522 45.5381 40.0182 46.0574 39.4511 45.5321C38.8811 45.0069 39.2959 43.6356 40.3748 42.4717L61.1385 20.0218Z" fill="#687949"/>
                          <path d="M0.138672 23.0669C0.138672 23.0669 38.5548 -29.0191 80.4283 23.3459L77.9409 25.2425C77.9409 25.2425 45.2607 -25.0589 2.47542 24.6337L0.138672 23.0669Z" fill="#687949"/>
                          <path d="M27.6934 37.9674C27.6934 37.9674 39.8651 21.6191 52.9962 38.039L52.0293 38.5374C52.0293 38.5374 42.0168 23.647 28.4648 38.4076L27.6934 37.9674Z" fill="#687949"/>
                          <path d="M41.9184 46.7395C40.956 47.2842 39.8577 47.1633 39.4653 46.4709C39.0773 45.7815 39.5399 44.7788 40.5053 44.2342L77.9739 23.081C78.9349 22.5364 80.0346 22.6587 80.4256 23.3466C80.8136 24.0375 80.3495 25.0418 79.3855 25.5849L41.9184 46.7395Z" fill="#687949"/>
                          <path d="M38.6443 46.4607C39.6068 47.0053 40.705 46.883 41.0975 46.1906C41.4854 45.5012 41.0229 44.5 40.0589 43.9553L2.58731 22.8022C1.62635 22.2576 0.526614 22.3784 0.138648 23.0678C-0.252303 23.7587 0.211764 24.7629 1.17571 25.3061L38.6443 46.4607Z" fill="#687949"/>
                        </svg>
                      ) : theme.id === 'random' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="4.5vh" height="4.5vh" viewBox="0 0 59 59" fill="none">
                          <path d="M23.7182 51.0943L17.1397 36.0788L5.07422 29.5003L17.1397 22.9218L23.7182 7.90633L30.2967 22.9218L42.3622 29.5003L30.2967 36.0788L23.7182 51.0943ZM46.4922 21.0928L43.8667 15.1338L39.0877 12.5083L43.8667 9.88283L46.4922 3.92383L49.1177 9.88283L53.9262 12.5083L49.1177 15.1338L46.4922 21.0928ZM46.4922 55.0768L43.8667 49.1178L39.0877 46.4923L43.8667 43.8668L46.4922 37.9078L49.1177 43.8668L53.9262 46.4923L49.1177 49.1178L46.4922 55.0768Z" stroke="#687949" strokeWidth="3"/>
                        </svg>
                      ) : (
                        <span style={{ fontSize: '3.5vh' }}>{theme.icon}</span>
                      )}
                    </div>
                    <h3 className="font-bold mb-[0.4vh]" style={{ color: '#687949', fontSize: '3vh' }}>
                      {language === 'zh' ? theme.name : theme.nameEn}
                    </h3>
                    <p className="text-gray-500 leading-tight" style={{ fontSize: '1.4vh' }}>
                      {language === 'zh' ? theme.description : theme.descriptionEn}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 确认按钮 */}
          <div className="text-center mt-[3vh]">
            <button
              onClick={() => {
                if (selectedTheme) {
                  handleThemeSelect(selectedTheme)
                } else {
                  toast.error(language === 'zh' ? '请先选择一个主题' : 'Please select a theme first')
                }
              }}
              disabled={isGenerating || !selectedTheme}
              style={{
                ...getUnifiedButtonStyle(),
                opacity: isGenerating || !selectedTheme ? 0.6 : 1,
                cursor: isGenerating || !selectedTheme ? 'not-allowed' : 'pointer',
                background: isGenerating || !selectedTheme 
                  ? 'linear-gradient(to right, #9ca3af, #6b7280)' 
                  : getUnifiedButtonStyle().background
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && selectedTheme) {
                  handleButtonHover(e, true)
                }
              }}
              onMouseLeave={(e) => {
                if (!isGenerating && selectedTheme) {
                  handleButtonHover(e, false)
                }
              }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'zh' ? '正在生成中...' : 'Generating...'}</span>
                </div>
              ) : (
                language === 'zh' ? '生成计划' : 'Generate Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    </WarmBg>
  )
}

export default TripThemesView 