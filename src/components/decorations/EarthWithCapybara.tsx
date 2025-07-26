import React from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

interface EarthWithCapybaraProps {
  className?: string
  petType?: 'cat' | 'dog' | 'other'
}

const EarthWithCapybara: React.FC<EarthWithCapybaraProps> = ({ className = '', petType = 'other' }) => {
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
    <div className={`fixed bottom-[-15vw] left-1/2 transform -translate-x-1/2 z-20 w-[50vw] h-[50vw] pointer-events-none relative ${className}`}>
      <img 
        src="/decorations/earth.jpeg" 
        alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
        className="w-full h-full object-contain drop-shadow-lg"
      />
      {/* 宠物在地球上 */}
      <div className={`absolute top-[-15%] left-1/2 transform -translate-x-1/2 animate-pulse ${
        petType === 'cat' || petType === 'dog' ? 'w-[12vw] h-[12vw]' : 'w-[15vw] h-[15vw]'
      }`}>
        <img 
          src={getPetImage()}
          alt={getPetAlt()} 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
    </div>
  )
}

export default EarthWithCapybara 