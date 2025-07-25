import React from 'react'

interface WarmBgProps {
  children?: React.ReactNode
  className?: string
  showDecorations?: boolean
}

export const WarmBg: React.FC<WarmBgProps> = ({ 
  children, 
  className = '', 
  showDecorations = true 
}) => {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ backgroundColor: '#FFF6E4' }}
    >
      {/* 背景装饰元素 */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 左上角叶子装饰 */}
          <div className="absolute top-0 left-[-60px] w-[350px] h-[350px]">
            <img 
              src="/decorations/leaves-dark.jpeg" 
              alt="Left decoration" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* 右上角叶子装饰 */}
          <div className="absolute top-0 right-[-20px] w-[250px] h-[250px]">
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