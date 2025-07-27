import React from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

interface EarthWithCapybaraProps {
  className?: string
  petType?: 'cat' | 'dog' | 'other'
  onClick?: () => void
}

const EarthWithCapybara: React.FC<EarthWithCapybaraProps> = ({ className = '', petType = 'other', onClick }) => {
  const [language] = useAtom(selectedLanguageAtom)

  // 根据宠物类型选择图片和描述
  const getPetImage = () => {
    switch (petType) {
      case 'cat':
        return "/decorations/cat.png"
      case 'dog':
        return "/decorations/fox.png"
      default:
        return "/decorations/capybara.jpeg"
    }
  }

  const getPetAlt = () => {
    if (language === 'zh') {
      switch (petType) {
        case 'cat':
          return '猫咪'
        case 'dog':
          return '狗狗'
        default:
          return '水豚'
      }
    } else {
      switch (petType) {
        case 'cat':
          return 'Cat'
        case 'dog':
          return 'Dog'
        default:
          return 'Capybara'
      }
    }
  }

  return (
    <>
      {/* 动画样式定义 */}
      <style>{`
        @keyframes earthRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes petSwing {
          0%, 100% {
            transform: translate(-50%, 0) rotate(-3deg);
          }
          50% {
            transform: translate(-50%, 0) rotate(3deg);
          }
        }
        
        .earth-rotating {
          animation: earthRotate 60s linear infinite;
        }
        
        .pet-swinging {
          animation: petSwing 4s ease-in-out infinite;
        }
      `}</style>
      
      <div 
        className={`fixed bottom-[-15vw] left-1/2 transform -translate-x-1/2 z-30 w-[50vw] h-[50vw] relative ${className} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : 'pointer-events-none'}`}
        onClick={onClick}
      >
        <img 
          src="/decorations/earth.jpeg" 
          alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
          className="w-full h-full object-contain drop-shadow-lg earth-rotating"
        />
        {/* 宠物在地球上 */}
        <div className={`absolute top-[-15%] left-1/2 animate-pulse pet-swinging ${
          petType === 'cat' || petType === 'dog' ? 'w-[12vw] h-[12vw]' : 'w-[15vw] h-[15vw]'
        }`}>
          <img 
            src={getPetImage()}
            alt={getPetAlt()} 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    </>
  )
}

export default EarthWithCapybara 