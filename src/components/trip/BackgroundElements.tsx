import React from 'react'
import { MapboxMap } from '@/components/map/MapboxMap'

interface BackgroundElementsProps {
  currentTripPlan: any
  language: 'zh' | 'en'
  getMapCenter: () => [number, number]
  mapPoints: any[]
  mapRoutes: any[]
}

export const BackgroundElements: React.FC<BackgroundElementsProps> = ({
  currentTripPlan,
  language,
  getMapCenter,
  mapPoints,
  mapRoutes
}) => {
  return (
    <>
      {/* 始终显示地图背景 */}
      <div className="fixed inset-0 w-full h-full z-0">
        <MapboxMap
          className="w-full h-full"
          center={getMapCenter()}
          zoom={14}
          maxZoom={16}
          disableZoom={false}
          disableInteraction={false}
          points={mapPoints}
          routes={mapRoutes}
        />
      </div>

      {/* 地球宠物装饰 - 在地图之上，UI之下 */}
      <div className="fixed bottom-[-80vh] left-1/2 transform -translate-x-1/2 z-5 w-[50vw] h-[50vw] pointer-events-none">
        <img 
          src="/decorations/earth.jpeg" 
          alt={language === 'zh' ? '地球装饰' : 'Earth decoration'} 
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            animation: 'earthRotate 60s linear infinite'
          }}
        />
        {/* 宠物在地球上 */}
        <div className={`absolute top-[-15%] left-1/2 transform -translate-x-1/2 animate-pulse ${
          currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog' 
            ? 'w-[12vw] h-[12vw]' 
            : 'w-[15vw] h-[15vw]'
        }`}
        style={{
          animation: 'petSwing 4s ease-in-out infinite'
        }}>
          <img 
            src={
              currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat.png' :
              currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox.png' :
              '/decorations/capybara.jpeg'
            }
            alt={
              language === 'zh' ? (
                currentTripPlan.petCompanion.type === 'cat' ? '猫咪' :
                currentTripPlan.petCompanion.type === 'dog' ? '狗狗' : '水豚'
              ) : (
                currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                currentTripPlan.petCompanion.type === 'dog' ? 'Dog' : 'Capybara'
              )
            }
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 动画样式定义 */}
      <style>{`
        @keyframes earthRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes petSwing {
          0%, 100% { transform: translate(-50%, 0) rotate(-3deg); }
          50% { transform: translate(-50%, 0) rotate(3deg); }
        }
      `}</style>
    </>
  )
} 