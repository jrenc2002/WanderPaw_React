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
    </>
  )
} 