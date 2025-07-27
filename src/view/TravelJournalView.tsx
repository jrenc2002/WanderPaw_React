import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { selectedLanguageAtom } from '@/store/MapState'
import { WarmBg } from '@/components/bg/WarmBg'
import { EarthWithCapybara, BottomGradientMask } from '@/components/decorations'

// 信件数据类型
interface Letter {
  id: string
  title: string
  date: string
  location: string
  weather: string
  content: string
  petImage: string
  backgroundImage: string
  rating: number
  surprise: string
  petName: string
  cardImage: string
}

const TravelJournalView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [isExiting, setIsExiting] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [showLetterModal, setShowLetterModal] = useState(false)

  const { currentActivity: _currentActivity } = location.state || {}

  // 模拟信件数据
  const letters: Letter[] = [
    {
      id: '1',
      title: '鸟居前的自拍',
      date: '2025.2.6',
      location: '京都 伏见稻荷大社',
      weather: '阳光明媚 ☀️',
      content: '今天在伏见稻荷大社拍了好多照片！戴着新买的棒球帽，在鸟居前自拍了一张。阳光透过鸟居洒下来，感觉特别神圣。还遇到了一只可爱的小猫，它好像也在享受这美好的时光。',
      petImage: '/decorations/photo.png',
      backgroundImage: '/decorations/letter_paper.jpeg',
      rating: 4,
      surprise: '/decorations/image 93.png',
      petName: '豚豚',
      cardImage: '/decorations/polaroid1.png' // 橙色猫咪戴着黑色棒球帽
    },
    {
      id: '2',
      title: '冰淇淋时光',
      date: '2025.2.5',
      location: '京都 岚山',
      weather: '秋高气爽 🍂',
      content: '在岚山散步时发现了一家超好吃的冰淇淋店！拿着冰淇淋在传统建筑前拍照，感觉特别有秋天的味道。建筑上的大眼睛装饰让我想起了童话故事，整个场景都充满了魔幻色彩。',
      petImage: '/decorations/photo.png',
      backgroundImage: '/decorations/letter_paper.jpeg',
      rating: 5,
      surprise: '/decorations/image 93.png',
      petName: '豚豚',
      cardImage: '/decorations/polaroid2.png' // 黑白猫咪拿着冰淇淋
    },
    {
      id: '3',
      title: '宝塔奇遇',
      date: '2025.2.4',
      location: '奈良 东大寺',
      weather: '温暖如春 🌸',
      content: '在东大寺看到了这座美丽的宝塔！它的多层屋顶在阳光下闪闪发光，就像童话里的宫殿一样。我在这里拍了好多照片，每一张都美得像明信片。宝塔周围的环境特别宁静，让人心情很放松。',
      petImage: '/decorations/photo.png',
      backgroundImage: '/decorations/letter_paper.jpeg',
      rating: 4,
      surprise: '/decorations/image 93.png',
      petName: '豚豚',
      cardImage: '/decorations/polaroid3.png' // 黑白猫咪在日本宝塔前
    },
    {
      id: '4',
      title: '海边码头',
      date: '2025.2.3',
      location: '神户 美利坚公园',
      weather: '海风轻拂 🌊',
      content: '今天来到了神户的美利坚公园！这里的码头风景太美了，戴着黄色帽子在海边拍照，感觉特别有度假的感觉。海面波光粼粼，远处的传统建筑和现代码头形成了完美的对比。海鸥在天空中自由飞翔，整个画面都充满了活力。',
      petImage: '/decorations/photo.png',
      backgroundImage: '/decorations/letter_paper.jpeg',
      rating: 5,
      surprise: '/decorations/image 93.png',
      petName: '豚豚',
      cardImage: '/decorations/polaroid4.png' // 猫咪戴着黄色帽子在海边码头
    },
    {
      id: '5',
      title: '樱花季节',
      date: '2025.2.2',
      location: '东京 上野公园',
      weather: '樱花盛开 🌸',
      content: '上野公园的樱花太美了！在鸟居前拍照，粉色的樱花花瓣飘落，就像下着樱花雨一样。石板路两旁都是盛开的樱花树，空气中弥漫着淡淡的花香。这里的春天真的太美了，每一张照片都充满了浪漫的气息。',
      petImage: '/decorations/photo.png',
      backgroundImage: '/decorations/letter_paper.jpeg',
      rating: 5,
      surprise: '/decorations/image 93.png',
      petName: '豚豚',
      cardImage: '/decorations/polaroid5.png' // 蓝眼猫咪在日本鸟居和樱花前
    }
  ]

  const handleBack = () => {
    setIsExiting(true)
    // 等待动画完成后再导航
    setTimeout(() => {
      navigate(-1)
    }, 800) // 800ms 动画持续时间
  }

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter)
    setShowLetterModal(true)
  }

  const handleCloseLetterModal = () => {
    setShowLetterModal(false)
    setSelectedLetter(null)
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

  // 信件卡片动画变体
  const letterCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -5,
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
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
        className="min-h-screen relative"
      >
        {/* 页面标题 */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: '#687949' }}
          >
            {language === 'zh' ? '手账记录' : 'Travel Journal'}
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#A6A196' }}
          >
            {language === 'zh' ? '记录每一次美好的旅行回忆' : 'Record every beautiful travel memory'}
          </p>
        </div>

        {/* 信件网格 */}
        <div className="pt-32 pb-24 px-8">
          <div className="max-w-7xl mx-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {letters.map((letter, index) => (
                <motion.div
                  key={letter.id}
                  custom={index}
                  variants={letterCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="cursor-pointer"
                  onClick={() => handleLetterClick(letter)}
                >
                                     {/* Polaroid 风格的信件卡片 */}
                   <div className="relative">
                     {/* 主卡片 */}
                     <div 
                       className="relative bg-white shadow-xl overflow-hidden polaroid-card"
                       style={{
                         transform: `rotate(${Math.random() * 6 - 3}deg)`,
                         borderRadius: '8px',
                         border: '1px solid #e5e7eb',
                         maxWidth: '280px',
                         margin: '0 auto'
                       }}
                     >
                       {/* 直接使用提供的Polaroid图片 */}
                       <div className="relative">
                         <img 
                           src={letter.cardImage}
                           alt={letter.title}
                           className="w-full h-auto object-cover"
                           style={{ borderRadius: '8px 8px 0 0' }}
                         />
                       </div>

                       {/* 底部信息区域 */}
                       <div className="p-4 bg-white">
                         <div className="text-center">
                           <h3 
                             className="font-semibold text-lg mb-1"
                             style={{ color: '#687949' }}
                           >
                             {letter.title}
                           </h3>
                           <p 
                             className="text-sm mb-2"
                             style={{ color: '#A6A196' }}
                           >
                             {letter.date} · {letter.location}
                           </p>
                           <p 
                             className="text-xs"
                             style={{ color: '#A6A196' }}
                           >
                             {letter.weather}
                           </p>
                         </div>

                         {/* 社交互动图标 */}
                         <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
                           <div className="w-6 h-6 text-gray-400">
                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                             </svg>
                           </div>
                           <div className="w-6 h-6 text-gray-400">
                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                             </svg>
                           </div>
                           <div className="w-6 h-6 text-gray-400">
                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                             </svg>
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* 装饰元素 - 胶带 */}
                     <div 
                       className="absolute -top-2 -left-2 w-8 h-8 tape-decoration"
                       style={{
                         transform: 'rotate(-15deg)'
                       }}
                     ></div>
                     <div 
                       className="absolute -top-1 -right-1 w-6 h-6 tape-decoration"
                       style={{
                         transform: 'rotate(10deg)'
                       }}
                     ></div>

                     {/* 装饰元素 - 夹子 */}
                     <div className="absolute -top-3 right-4">
                       <div 
                         className="w-4 h-8 clothespin"
                       ></div>
                     </div>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 地球装饰和水豚 */}
        <div className='absolute bottom-[-60vh]'>
          <EarthWithCapybara />
        </div>
        
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

        {/* 信件详情弹窗 */}
        <AnimatePresence>
          {showLetterModal && selectedLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{
                background: 'rgba(92, 90, 76, 0.15)',
                backdropFilter: 'blur(9.399999618530273px)'
              }}
              onClick={handleCloseLetterModal}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-[65vw] h-[80vh] relative"
                style={{
                  backgroundImage: `url(${selectedLetter.backgroundImage})`,
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
                        ? `${selectedLetter.petName}的来信`
                        : `Letter from ${selectedLetter.petName}`
                      }
                    </h2>
                  </div>

                  {/* 下层：主要内容 */}
                  <div className="flex gap-6 h-[calc(100%-120px)]">
                                         {/* 左侧：宠物照片 */}
                     <div className="w-[50%] flex items-start">
                       <div className="w-full aspect-square p-1 transform relative">
                         <img 
                           src={selectedLetter.cardImage}
                           alt="宠物照片"
                           className="w-full h-full object-cover"
                           style={{ borderRadius: '8px' }}
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
                          {selectedLetter.title}
                        </h3>
                        <div 
                          className="text-sm"
                          style={{ color: '#A6A196' }}
                        >
                          {selectedLetter.date} {selectedLetter.location} · {selectedLetter.weather}
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
                          {selectedLetter.content}
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
                            {'⭐'.repeat(selectedLetter.rating)}
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
                            src={selectedLetter.surprise}
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
                          onClick={handleCloseLetterModal}
                        >
                          {language === 'zh' ? '关闭' : 'Close'}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 自定义样式 */}
      <style>{`
        .polaroid-card {
          background: white;
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.1),
            0 8px 16px rgba(0,0,0,0.1),
            0 16px 32px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .polaroid-card:hover {
          transform: translateY(-8px) rotate(0deg) !important;
          box-shadow: 
            0 8px 16px rgba(0,0,0,0.15),
            0 16px 32px rgba(0,0,0,0.15),
            0 32px 64px rgba(0,0,0,0.15);
        }
        
        .tape-decoration {
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          opacity: 0.7;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        
        .clothespin {
          background: linear-gradient(to bottom, #8b5a2b, #a0522d);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </WarmBg>
  )
}

export default TravelJournalView 