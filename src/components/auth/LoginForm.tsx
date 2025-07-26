import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  loginFormAtom, 
  authLoadingAtom, 
  authErrorAtom, 
  setAuthDataAtom,
  updateUserAtom
} from '@/store/AuthState'
import { AuthService } from '@/services/authService'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess,
  onSwitchToRegister 
}) => {
  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useAtom(loginFormAtom)
  const [loading, setLoading] = useAtom(authLoadingAtom)
  const [, setError] = useAtom(authErrorAtom)
  const [, setAuthData] = useAtom(setAuthDataAtom)
  const [, updateUser] = useAtom(updateUserAtom)
  
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: keyof typeof loginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginForm({ ...loginForm, [field]: e.target.value })
    setError(null) // 清除错误信息
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginForm.username || !loginForm.password) {
      setError('请填写完整的登录信息')
      toast.error('请填写完整的登录信息')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login(loginForm)
      
      // 设置认证状态
      setAuthData({
        user: {
          id: response.id,
          username: response.username,
          phoneNumber: response.phoneNumber,
          lastLogin: response.lastLogin,
          isInitialized: false, // 默认为未初始化，后续会通过API获取实际状态
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      // 获取用户详细信息（包括初始化状态）
      try {
        const userProfile = await AuthService.getUserProfile(response.accessToken)
        updateUser({
          isInitialized: userProfile.isInitialized ?? false,
          petInfo: userProfile.petInfo,
        })
      } catch (profileError) {
        console.error('获取用户资料失败:', profileError)
        // 即使获取资料失败，也不影响登录流程
      }

      toast.success(`欢迎回来，${response.username}！`)
      
      // 清空表单
      setLoginForm({ username: '', password: '' })
      
      // 调用成功回调或导航到首页
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/home')
      }
    } catch (error: any) {
      const errorMessage = error.message || '登录失败，请稍后重试'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#687949] mb-2">
          欢迎回来
        </h2>
        <p className="text-sm text-[#687949] opacity-60">
          登录您的账户继续使用
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名输入框 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#687949] mb-2">
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={loginForm.username}
              onChange={handleInputChange('username')}
              className="w-full px-4 py-3 rounded-xl bg-[#F0E6D6] text-[#687949] placeholder-[#687949]/50
                       border-2 border-transparent focus:border-[#687949] focus:bg-white
                       transition-all duration-200"
              placeholder="请输入用户名"
              disabled={loading}
              required
            />
          </div>

          {/* 密码输入框 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#687949] mb-2">
              密码
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={handleInputChange('password')}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F0E6D6] text-[#687949] placeholder-[#687949]/50
                         border-2 border-transparent focus:border-[#687949] focus:bg-white
                         transition-all duration-200"
                placeholder="请输入密码"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-[#687949]/50 hover:text-[#687949] transition-colors duration-200"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#687949] hover:bg-[#505D39] disabled:bg-[#687949]/50
                     text-white font-medium rounded-xl transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-[#687949]/50 focus:ring-offset-2
                     disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>登录中...</span>
              </div>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* 切换到注册 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#687949] opacity-70">
            还没有账户？{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#687949] hover:text-[#505D39] font-medium 
                       transition-colors duration-200 underline"
              disabled={loading}
            >
              立即注册
            </button>
          </p>
        </div>
    </div>
  )
} 