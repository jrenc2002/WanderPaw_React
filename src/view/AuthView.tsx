import React, { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToLogin = () => setIsLogin(true)
  const switchToRegister = () => setIsLogin(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        
        {/* 顶部品牌区域 */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">🐾</span>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              WanderPaw
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              探索世界，记录生活
            </p>
          </div>
        </div>

        {/* 认证表单区域 */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* 切换标签 */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={switchToLogin}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              登录
            </button>
            <button
              onClick={switchToRegister}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            安全可靠 • 隐私保护 • 开源透明
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              帮助中心
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              联系我们
            </a>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* 样式定义 */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 