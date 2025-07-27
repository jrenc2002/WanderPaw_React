import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LetterAnimationProps {
  letterAnimationStage: 'hidden' | 'appearing' | 'disappearing' | 'reappearing' | 'final'
  language: 'zh' | 'en'
  onLetterClick: () => void
}

export const LetterAnimation: React.FC<LetterAnimationProps> = ({
  letterAnimationStage,
  language,
  onLetterClick
}) => {
  return (
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
            onClick={(letterAnimationStage === 'reappearing' || letterAnimationStage === 'final') ? onLetterClick : undefined}
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
  )
} 