import React from 'react'

interface GlassBgProps {
  children?: React.ReactNode
  className?: string
  variant?: 'warm' | 'cool' | 'neutral' | 'sunset' | 'ocean'
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  opacity?: number
  showDecorations?: boolean
  gradientDirection?: 'vertical' | 'horizontal' | 'diagonal' | 'radial'
}

export const GlassBg: React.FC<GlassBgProps> = ({ 
  children, 
  className = '', 
  variant = 'warm',
  blurIntensity = 'lg',
  opacity = 0.8,
  showDecorations = true,
  gradientDirection = 'diagonal'
}) => {
  
  // 定义不同的渐变主题
  const gradientThemes = {
    warm: {
      background: 'linear-gradient(135deg, #fef7e4 0%, #f9f2e2 25%, #f4e8d0 50%, #ede2c8 75%, #e8d5b7 100%)',
      overlayColors: 'rgba(254, 247, 228, 0.3), rgba(249, 242, 226, 0.5), rgba(244, 232, 208, 0.3)'
    },
    cool: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)',
      overlayColors: 'rgba(240, 249, 255, 0.3), rgba(224, 242, 254, 0.5), rgba(186, 230, 253, 0.3)'
    },
    neutral: {
      background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 25%, #e7e5e4 50%, #d6d3d1 75%, #c7c2bd 100%)',
      overlayColors: 'rgba(250, 250, 249, 0.3), rgba(245, 245, 244, 0.5), rgba(231, 229, 228, 0.3)'
    },
    sunset: {
      background: 'linear-gradient(135deg, #fef3e2 0%, #fed7aa 25%, #fdba74 50%, #fb923c 75%, #f97316 100%)',
      overlayColors: 'rgba(254, 243, 226, 0.3), rgba(254, 215, 170, 0.5), rgba(253, 186, 116, 0.3)'
    },
    ocean: {
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)',
      overlayColors: 'rgba(240, 253, 250, 0.3), rgba(204, 251, 241, 0.5), rgba(153, 246, 228, 0.3)'
    }
  }

  // 定义渐变方向
  const gradientDirections = {
    vertical: '180deg',
    horizontal: '90deg', 
    diagonal: '135deg',
    radial: 'radial-gradient(ellipse at center'
  }

  // 构建渐变样式
  const getGradientStyle = () => {
    const theme = gradientThemes[variant]
    if (gradientDirection === 'radial') {
      return `radial-gradient(ellipse at center, ${theme.overlayColors})`
    }
    return theme.background.replace('135deg', gradientDirections[gradientDirection])
  }

  // 构建毛玻璃叠加层
  const getGlassOverlay = () => {
    const theme = gradientThemes[variant]
    return `linear-gradient(${gradientDirections[gradientDirection] || '135deg'}, ${theme.overlayColors})`
  }

  return (
    <div
      className={`relative h-screen w-full overflow-hidden ${className}`}
      style={{ 
        background: getGradientStyle()
      }}
    >
      {/* 毛玻璃效果叠加层 */}
      <div 
        className={`absolute inset-0 backdrop-blur-${blurIntensity}`}
        style={{
          background: getGlassOverlay(),
          opacity: opacity
        }}
      />

      {/* 额外的细节纹理层 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* 背景装饰元素 */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {/* 左上角叶子装饰 */}
          <div className="absolute top-0 left-[-60px] w-[350px] h-[350px] blur-[1px]">
            <img 
              src="/decorations/leaves-dark.jpeg" 
              alt="Left decoration" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* 右上角叶子装饰 */}
          <div className="absolute top-0 right-[-20px] w-[250px] h-[250px] blur-[1px]">
            <img 
              src="/decorations/leaves-light.jpeg" 
              alt="Right decoration" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
} 