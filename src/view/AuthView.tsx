import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { WarmBg } from '@/components/bg/WarmBg'

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToLogin = () => setIsLogin(true)
  const switchToRegister = () => setIsLogin(false)

  return (
    <WarmBg showDecorations={true}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* 主要认证卡片 */}
          <div 
            className="relative"
            style={{
              borderRadius: '38px',
              background: '#FDF8F3',
              boxShadow: '0 2px 34.9px 3px rgba(123, 66, 15, 0.11)',
            }}
          >
            {/* 虚线边框 */}
            <div 
              className="absolute top-[22px] left-[22px] right-[22px] bottom-[22px] pointer-events-none"
              style={{
                borderRadius: '21px',
                border: '2px dashed #D1BA9E',
              }}
            />
            
            {/* 内容区域 */}
            <div className="relative z-10 p-8">
              {/* 顶部品牌区域 */}
              <div className="text-center mb-8">
                <h1 className="wanderpaw-title text-4xl md:text-5xl font-bold text-[#687949] mb-2">
                  WanderPaw
                </h1>
                <p className="text-sm text-[#687949] opacity-70">
                  探索世界，记录生活 🐾
                </p>
              </div>

              {/* 切换标签 */}
              <div 
                className="flex rounded-2xl p-1 mb-6"
                style={{ backgroundColor: '#F0E6D6' }}
              >
                <button
                  onClick={switchToLogin}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isLogin
                      ? 'bg-[#687949] text-white shadow-sm'
                      : 'text-[#687949] hover:text-[#505D39]'
                  }`}
                >
                  登录
                </button>
                <button
                  onClick={switchToRegister}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    !isLogin
                      ? 'bg-[#687949] text-white shadow-sm'
                      : 'text-[#687949] hover:text-[#505D39]'
                  }`}
                >
                  注册
                </button>
              </div>

              {/* 表单内容 */}
              <div className="transition-all duration-300 ease-in-out">
                {isLogin ? (
                  <LoginForm onSwitchToRegister={switchToRegister} />
                ) : (
                  <RegisterForm onSwitchToLogin={switchToLogin} />
                )}
              </div>

              {/* 底部信息 */}
              <div className="mt-6 text-center">
                <p className="text-xs text-[#687949] opacity-60 mb-3">
                  安全可靠 • 隐私保护 • 开源透明
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="text-xs text-[#687949] opacity-50 hover:opacity-70 transition-opacity"
                  >
                    帮助中心
                  </a>
                  <a
                    href="#"
                    className="text-xs text-[#687949] opacity-50 hover:opacity-70 transition-opacity"
                  >
                    联系我们
                  </a>
                  <a
                    href="#"
                    className="text-xs text-[#687949] opacity-50 hover:opacity-70 transition-opacity"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WarmBg>
  )
} 