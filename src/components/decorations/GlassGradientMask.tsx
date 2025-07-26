import React from 'react'

interface GlassGradientMaskProps {
  className?: string
  height?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'warm' | 'cool' | 'neutral' | 'sunset' | 'ocean'
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  opacity?: number
  zIndex?: number
}

export const GlassGradientMask: React.FC<GlassGradientMaskProps> = ({ 
  className = '', 
  height = 'calc(100vh / 13)',
  position = 'bottom',
  variant = 'warm',
  blurIntensity = 'lg',
  opacity = 0.9,
  zIndex = 30
}) => {
  
  // 定义不同的渐变主题
  const gradientThemes = {
    warm: {
      transparent: 'rgba(254, 247, 228, 0)',
      semi: 'rgba(244, 232, 208, 0.3)',
      opaque: 'rgba(232, 213, 183, 0.95)'
    },
    cool: {
      transparent: 'rgba(240, 249, 255, 0)',
      semi: 'rgba(186, 230, 253, 0.3)', 
      opaque: 'rgba(56, 189, 248, 0.95)'
    },
    neutral: {
      transparent: 'rgba(250, 250, 249, 0)',
      semi: 'rgba(231, 229, 228, 0.3)',
      opaque: 'rgba(199, 194, 189, 0.95)'
    },
    sunset: {
      transparent: 'rgba(254, 243, 226, 0)',
      semi: 'rgba(253, 186, 116, 0.3)',
      opaque: 'rgba(249, 115, 22, 0.95)'
    },
    ocean: {
      transparent: 'rgba(240, 253, 250, 0)',
      semi: 'rgba(153, 246, 228, 0.3)',
      opaque: 'rgba(45, 212, 191, 0.95)'
    }
  }

  // 定义位置样式
  const positionStyles = {
    top: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      background: `linear-gradient(180deg, ${gradientThemes[variant].opaque} 0%, ${gradientThemes[variant].semi} 50%, ${gradientThemes[variant].transparent} 100%)`
    },
    bottom: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      background: `linear-gradient(0deg, ${gradientThemes[variant].opaque} 0%, ${gradientThemes[variant].semi} 50%, ${gradientThemes[variant].transparent} 100%)`
    },
    left: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      height: '100%',
      width: height, // 使用height作为width
      background: `linear-gradient(90deg, ${gradientThemes[variant].opaque} 0%, ${gradientThemes[variant].semi} 50%, ${gradientThemes[variant].transparent} 100%)`
    },
    right: {
      position: 'fixed' as const,
      top: 0,
      right: 0,
      height: '100%',
      width: height, // 使用height作为width
      background: `linear-gradient(270deg, ${gradientThemes[variant].opaque} 0%, ${gradientThemes[variant].semi} 50%, ${gradientThemes[variant].transparent} 100%)`
    }
  }

  const baseStyle = positionStyles[position]
  
  // 为垂直位置设置高度，为水平位置设置宽度
  const sizeStyle = position === 'top' || position === 'bottom' 
    ? { height }
    : { width: height }

  return (
    <>
      {/* 主要毛玻璃渐变层 */}
      <div 
        className={`pointer-events-none ${className}`}
        style={{
          ...baseStyle,
          ...sizeStyle,
          zIndex,
          opacity
        }}
      />
      
      {/* 毛玻璃模糊层 */}
      <div 
        className={`pointer-events-none backdrop-blur-${blurIntensity}`}
        style={{
          ...baseStyle,
          ...sizeStyle,
          zIndex: zIndex + 1,
          background: 'transparent',
          opacity: 0.8
        }}
      />
      
      {/* 细节纹理层 */}
      <div 
        className="pointer-events-none"
        style={{
          ...baseStyle,
          ...sizeStyle,
          zIndex: zIndex + 2,
          background: `
            radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
          `,
          opacity: 0.6
        }}
      />
    </>
  )
} 