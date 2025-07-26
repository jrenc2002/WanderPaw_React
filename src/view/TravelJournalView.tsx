import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { selectedLanguageAtom } from '@/store/MapState'
import { WarmBg } from '@/components/bg/WarmBg'
import { EarthWithCapybara, BottomGradientMask } from '@/components/decorations'

const TravelJournalView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [journalInput, setJournalInput] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const { tripPlan, currentActivity: _currentActivity } = location.state || {}

  const handleBack = () => {
    setIsExiting(true)
    // 等待动画完成后再导航
    setTimeout(() => {
      navigate(-1)
    }, 800) // 800ms 动画持续时间
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const getCurrentDate = () => {
    const now = new Date()
    return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`
  }


  // 页面动画变体
  const pageVariants = {
    initial: {
      clipPath: 'circle(0% at 88% 88%)', // 从右下角开始的圆形裁剪
      opacity: 0
    },
    animate: {
      clipPath: 'circle(150% at 88% 88%)', // 扩展到覆盖整个屏幕
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // 自定义缓动函数
      }
    },
    exit: {
      clipPath: 'circle(0% at 88% 88%)', // 收回到右下角
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <WarmBg>
      <motion.div
        key="travel-journal"
        variants={pageVariants}
        initial="initial"
        animate={isExiting ? "exit" : "animate"}
        className="min-h-screen"
      >
        

        

             {/* 地球装饰和水豚 */}
       <EarthWithCapybara />

       {/* 底部渐变遮罩 */}
       <BottomGradientMask />

      {/* 手帐按钮 - 右下角 */}
      <div 
        onClick={handleBack}
        className="fixed bottom-8 right-8 z-50 w-[12vw] h-[12vw] hover:scale-110 transition-transform cursor-pointer"
        aria-label={language === 'zh' ? '返回上一页' : 'Go Back'}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleBack()
          }
        }}
      >
        <img 
          src="/decorations/book.jpeg" 
          alt={language === 'zh' ? '手帐' : 'Journal'} 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      </motion.div>
    </WarmBg>
  )
}

export default TravelJournalView 