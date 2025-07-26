import React from 'react'

// 主要按钮样式
export const getUnifiedButtonStyle = (disabled: boolean = false) => ({
  padding: '1vh 4vw',
  background: disabled 
    ? 'linear-gradient(to right, #9ca3af, #6b7280)'
    : 'linear-gradient(to right, #687949, #687949)',
  color: 'white',
  borderRadius: '0.7vw',
  fontWeight: 'bold',
  fontSize: '1.2vw',
  transition: 'all 0.2s',
  boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.3)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: 'none'
})

// 次要按钮样式
export const getSecondaryButtonStyle = (disabled: boolean = false) => ({
  padding: '1vh 4vw',
  background: disabled 
    ? 'linear-gradient(to right, #d1d5db, #9ca3af)'
    : 'linear-gradient(to right, #6b7280, #6b7280)',
  color: 'white',
  borderRadius: '0.7vw',
  fontWeight: 'bold',
  fontSize: '1.2vw',
  transition: 'all 0.2s',
  boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.3)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: 'none'
})

// 主要按钮hover处理
export const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, disabled: boolean = false) => {
  if (disabled) return
  
  if (isEnter) {
    e.currentTarget.style.background = 'linear-gradient(to right, #C7AA6C, #C7AA6C)'
    e.currentTarget.style.transform = 'scale(1.05)'
  } else {
    e.currentTarget.style.background = 'linear-gradient(to right, #687949, #687949)'
    e.currentTarget.style.transform = 'scale(1)'
  }
}

// 次要按钮hover处理
export const handleSecondaryButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, disabled: boolean = false) => {
  if (disabled) return
  
  if (isEnter) {
    e.currentTarget.style.background = 'linear-gradient(to right, #9ca3af, #9ca3af)'
    e.currentTarget.style.transform = 'scale(1.05)'
  } else {
    e.currentTarget.style.background = 'linear-gradient(to right, #6b7280, #6b7280)'
    e.currentTarget.style.transform = 'scale(1)'
  }
} 