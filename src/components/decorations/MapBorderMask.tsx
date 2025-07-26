import React from 'react'
import { WANDERPAW_COLORS } from '@/config/wanderpaw-map-style'

interface MapBorderMaskProps {
  className?: string
  maskWidth?: string
  backgroundColor?: string
  opacity?: number
  zIndex?: number
  variant?: 'subtle' | 'soft' | 'strong'
  responsive?: boolean
}

const MapBorderMask: React.FC<MapBorderMaskProps> = ({ 
  className = '', 
  maskWidth = '40px', // 缩减默认宽度从60px到40px
  backgroundColor,
  opacity = 1,
  zIndex = 25,
  variant = 'soft',
  responsive = true
}) => {
  // 根据变体设置默认颜色和透明度
  const getVariantConfig = () => {
    switch (variant) {
      case 'subtle':
        return {
          bgColor: backgroundColor || WANDERPAW_COLORS.pure,
          baseOpacity: 0.5 // 降低subtle的透明度
        }
      case 'soft':
        return {
          bgColor: backgroundColor || WANDERPAW_COLORS.snow,
          baseOpacity: 0.7 // 降低soft的透明度
        }
      case 'strong':
        return {
          bgColor: backgroundColor || WANDERPAW_COLORS.cream,
          baseOpacity: 0.85 // 降低strong的透明度
        }
      default:
        return {
          bgColor: backgroundColor || WANDERPAW_COLORS.snow,
          baseOpacity: 0.7
        }
    }
  }

  const { bgColor, baseOpacity } = getVariantConfig()
  const finalOpacity = opacity * baseOpacity

  // 响应式蒙版宽度
  const getResponsiveMaskWidth = () => {
    if (!responsive) return maskWidth
    
    // 移动端使用较小的蒙版宽度
    return `min(${maskWidth}, 6vw)` // 从8vw改为6vw
  }

  const responsiveMaskWidth = getResponsiveMaskWidth()

  // 提取RGB值用于渐变
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 253, g: 249, b: 239 } // 默认为 snow 色
  }

  const rgb = hexToRgb(bgColor)
  const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`

  const gradientStyle = (direction: string) => {
    const gradients = {
      top: `linear-gradient(180deg, rgba(${rgbString}, ${finalOpacity}) 0%, rgba(${rgbString}, 0) 100%)`,
      bottom: `linear-gradient(0deg, rgba(${rgbString}, ${finalOpacity}) 0%, rgba(${rgbString}, 0) 100%)`,
      left: `linear-gradient(90deg, rgba(${rgbString}, ${finalOpacity}) 0%, rgba(${rgbString}, 0) 100%)`,
      right: `linear-gradient(270deg, rgba(${rgbString}, ${finalOpacity}) 0%, rgba(${rgbString}, 0) 100%)`
    }
    return gradients[direction as keyof typeof gradients]
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex }}>
      {/* 顶部蒙版 */}
      <div 
        className="absolute top-0 left-0 w-full"
        style={{
          height: responsiveMaskWidth,
          background: gradientStyle('top')
        }}
      />
      
      {/* 底部蒙版 */}
      <div 
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: responsiveMaskWidth,
          background: gradientStyle('bottom')
        }}
      />
      
      {/* 左侧蒙版 */}
      <div 
        className="absolute top-0 left-0 h-full"
        style={{
          width: responsiveMaskWidth,
          background: gradientStyle('left')
        }}
      />
      
      {/* 右侧蒙版 */}
      <div 
        className="absolute top-0 right-0 h-full"
        style={{
          width: responsiveMaskWidth,
          background: gradientStyle('right')
        }}
      />

      {/* 优化的四个角落蒙版，避免重合问题 */}
      <div 
        className="absolute top-0 left-0"
        style={{
          width: `calc(${responsiveMaskWidth} * 1.5)`,
          height: `calc(${responsiveMaskWidth} * 1.5)`,
          background: `radial-gradient(ellipse at top left, rgba(${rgbString}, ${finalOpacity * 0.8}) 0%, rgba(${rgbString}, ${finalOpacity * 0.4}) 60%, rgba(${rgbString}, 0) 100%)`,
          transform: 'translate(-25%, -25%)'
        }}
      />
      <div 
        className="absolute top-0 right-0"
        style={{
          width: `calc(${responsiveMaskWidth} * 1.5)`,
          height: `calc(${responsiveMaskWidth} * 1.5)`,
          background: `radial-gradient(ellipse at top right, rgba(${rgbString}, ${finalOpacity * 0.8}) 0%, rgba(${rgbString}, ${finalOpacity * 0.4}) 60%, rgba(${rgbString}, 0) 100%)`,
          transform: 'translate(25%, -25%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0"
        style={{
          width: `calc(${responsiveMaskWidth} * 1.5)`,
          height: `calc(${responsiveMaskWidth} * 1.5)`,
          background: `radial-gradient(ellipse at bottom left, rgba(${rgbString}, ${finalOpacity * 0.8}) 0%, rgba(${rgbString}, ${finalOpacity * 0.4}) 60%, rgba(${rgbString}, 0) 100%)`,
          transform: 'translate(-25%, 25%)'
        }}
      />
      <div 
        className="absolute bottom-0 right-0"
        style={{
          width: `calc(${responsiveMaskWidth} * 1.5)`,
          height: `calc(${responsiveMaskWidth} * 1.5)`,
          background: `radial-gradient(ellipse at bottom right, rgba(${rgbString}, ${finalOpacity * 0.8}) 0%, rgba(${rgbString}, ${finalOpacity * 0.4}) 60%, rgba(${rgbString}, 0) 100%)`,
          transform: 'translate(25%, 25%)'
        }}
      />
    </div>
  )
}

export default MapBorderMask 