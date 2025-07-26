import React from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

interface EarthWithCapybaraProps {
  className?: string
}

const EarthWithCapybara: React.FC<EarthWithCapybaraProps> = ({ className = '' }) => {
  const [language] = useAtom(selectedLanguageAtom)

  return (
    <div className={`fixed bottom-[-15vw] left-1/2 transform -translate-x-1/2 z-30 w-[50vw] h-[50vw] pointer-events-none relative ${className}`}>
      <img 
        src="/decorations/earth.jpeg" 
        alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
        className="w-full h-full object-contain drop-shadow-lg"
      />
      {/* 水豚在地球上 */}
      <div className="absolute top-[-15%] left-1/2 transform -translate-x-1/2 w-[15vw] h-[15vw] animate-pulse">
        <img 
          src="/decorations/capybara.jpeg" 
          alt={language === 'zh' ? '水豚' : 'Capybara'} 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
    </div>
  )
}

export default EarthWithCapybara 