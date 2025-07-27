import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GeneratedContent } from './types'

interface ContentModalProps {
  showContentModal: boolean
  selectedContent: GeneratedContent | null
  currentTripPlan: any
  language: 'zh' | 'en'
  onClose: () => void
}

export const ContentModal: React.FC<ContentModalProps> = ({
  showContentModal,
  selectedContent,
  currentTripPlan,
  language,
  onClose
}) => {
  return (
    <AnimatePresence>
      {showContentModal && selectedContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[30000]"
          onClick={onClose}
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
              onClick={onClose}
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
                onClick={onClose}
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
  )
} 