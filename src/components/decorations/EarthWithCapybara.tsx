import React from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

interface EarthWithCapybaraProps {
  className?: string
}

const EarthWithCapybara: React.FC<EarthWithCapybaraProps> = ({ className = '' }) => {
  const [language] = useAtom(selectedLanguageAtom)

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
        
        @keyframes capybaraSwing {
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
        
        .capybara-swinging {
          animation: capybaraSwing 4s ease-in-out infinite;
        }
      `}</style>
      
      <div className={`fixed bottom-[-15vw] left-1/2 transform -translate-x-1/2 z-30 w-[50vw] h-[50vw] pointer-events-none relative ${className}`}>
        <img 
          src="/decorations/earth.jpeg" 
          alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
          className="w-full h-full object-contain drop-shadow-lg earth-rotating"
        />
        {/* 水豚在地球上 */}
        <div className="absolute top-[-15%] left-1/2 w-[15vw] h-[15vw] capybara-swinging">
          <img 
            src="/decorations/capybara.jpeg" 
            alt={language === 'zh' ? '水豚' : 'Capybara'} 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    </>
  )
}

export default EarthWithCapybara 