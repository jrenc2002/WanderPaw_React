import React from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

interface DressUpItem {
  id: string
  name: string
  nameEn: string
  image: string
  type: 'hat' | 'accessory' | 'background'
}

interface EarthWithCapybaraProps {
  className?: string
  petType?: 'cat' | 'dog' | 'other'
  onClick?: () => void
  dressUpItem?: DressUpItem | null
}

const EarthWithCapybara: React.FC<EarthWithCapybaraProps> = ({ className = '', petType = 'other', onClick, dressUpItem }) => {
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
        
        .decoration-float {
          animation: decorationFloat 3s ease-in-out infinite;
        }
        
        @keyframes decorationFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .decoration-sparkle {
          animation: sparkle 2s ease-in-out infinite alternate;
        }
        
        @keyframes sparkle {
          0% {
            filter: brightness(1) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          }
          100% {
            filter: brightness(1.2) drop-shadow(0 4px 8px rgba(255,255,255,0.5));
          }
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
          
          {/* 装饰品显示 */}
          {dressUpItem && (
            <div className={`absolute ${
              dressUpItem.type === 'background' 
                ? '-top-8 -left-8 w-[180%] h-[180%] -z-10' 
                : dressUpItem.type === 'hat'
                ? '-top-16 left-1/2 transform -translate-x-1/2 w-[100%] h-[60%]'
                : dressUpItem.id === 'hand_roast' || dressUpItem.id === 'green_tea'
                ? 'top-[-30%] right-[-40%] w-[80%] h-[80%]' // 饮品配饰放在右上
                : dressUpItem.id === 'leaf_tag' || dressUpItem.id === 'chinese_knot'
                ? 'top-[-15%] left-[-40%] w-[75%] h-[75%]' // 标签装饰放在左上
                : 'top-[-25%] right-[-35%] w-[70%] h-[70%]' // 默认配饰位置
            } ${dressUpItem.type === 'background' ? 'decoration-float' : 'decoration-sparkle decoration-float'}`}>
              <img 
                src={dressUpItem.image}
                alt={language === 'zh' ? dressUpItem.name : dressUpItem.nameEn}
                className="w-full h-full object-contain"
                style={{
                  filter: dressUpItem.type === 'background' 
                    ? 'opacity(0.6) drop-shadow(0 6px 20px rgba(0,0,0,0.15))' 
                    : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  transform: dressUpItem.type === 'accessory' && dressUpItem.id !== 'green_tea'
                    ? 'rotate(-8deg)' 
                    : dressUpItem.id === 'green_tea' 
                    ? 'rotate(5deg)' 
                    : 'none'
                }}
              />
              
              {/* 装饰品特效 */}
              {dressUpItem.type !== 'background' && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* 主要闪光点 */}
                  <div 
                    className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-80"
                    style={{
                      animation: 'sparkle 1.8s ease-in-out infinite alternate',
                      animationDelay: '0.3s',
                      boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)'
                    }}
                  />
                  {/* 次要闪光点 */}
                  <div 
                    className="absolute top-1/3 left-0 w-2 h-2 bg-gradient-to-br from-white to-blue-100 rounded-full opacity-70"
                    style={{
                      animation: 'sparkle 2.2s ease-in-out infinite alternate',
                      animationDelay: '0.8s',
                      boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                    }}
                  />
                  {/* 小星星效果 */}
                  <div 
                    className="absolute bottom-0 right-1/4 w-1 h-1 bg-pink-300 rounded-full opacity-90"
                    style={{
                      animation: 'sparkle 1.2s ease-in-out infinite alternate',
                      animationDelay: '1.2s'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default EarthWithCapybara 