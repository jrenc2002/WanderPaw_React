import React from 'react'

interface BottomGradientMaskProps {
  className?: string
  height?: string
}

const BottomGradientMask: React.FC<BottomGradientMaskProps> = ({ 
  className = '', 
  height = 'calc(100vh / 13)' 
}) => {
  return (
    <div 
      className={`fixed bottom-0 left-0 w-full z-30 pointer-events-none ${className}`}
      style={{
        height,
        background: 'linear-gradient(180deg, rgba(237, 232, 222, 0.00) 0%, #F4F0E7 94.71%)'
      }}
    />
  )
}

export default BottomGradientMask