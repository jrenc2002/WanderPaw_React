import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
  registerFormAtom, 
  authLoadingAtom, 
  authErrorAtom, 
  setAuthDataAtom 
} from '@/store/AuthState'
import { AuthService } from '@/services/authService'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess,
  onSwitchToLogin 
}) => {
  const navigate = useNavigate()
  const [registerForm, setRegisterForm] = useAtom(registerFormAtom)
  const [loading, setLoading] = useAtom(authLoadingAtom)
  const [, setError] = useAtom(authErrorAtom)
  const [, setAuthData] = useAtom(setAuthDataAtom)
  
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleInputChange = (field: keyof typeof registerForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterForm({ ...registerForm, [field]: e.target.value })
    setError(null) // 清除错误信息
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setError(null)
  }

  const validateForm = () => {
    if (!registerForm.username || !registerForm.password) {
      setError('请填写完整的注册信息')
      toast.error('请填写完整的注册信息')
      return false
    }

    if (registerForm.username.length < 3) {
      setError('用户名至少需要3个字符')
      toast.error('用户名至少需要3个字符')
      return false
    }

    if (registerForm.password.length < 8) {
      setError('密码至少需要8个字符')
      toast.error('密码至少需要8个字符')
      return false
    }

    if (registerForm.password !== confirmPassword) {
      setError('两次输入的密码不一致')
      toast.error('两次输入的密码不一致')
      return false
    }



    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.register(registerForm)
      
      // 设置认证状态
      setAuthData({
        user: {
          id: response.id,
          username: response.username,
          phoneNumber: response.phoneNumber,
          lastLogin: response.lastLogin,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      toast.success(`注册成功，欢迎 ${response.username}！`)
      
      // 清空表单
      setRegisterForm({ username: '', password: '' })
      setConfirmPassword('')
      
      // 调用成功回调或导航到首页
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/home')
      }
    } catch (error: any) {
      const errorMessage = error.message || '注册失败，请稍后重试'
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
          创建账户
        </h2>
        <p className="text-sm text-[#687949] opacity-60">
          加入我们，开始探索世界
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* 用户名输入框 */}
          <div>
            <label htmlFor="register-username" className="block text-sm font-medium text-[#687949] mb-2">
              用户名 *
            </label>
            <input
              id="register-username"
              type="text"
              value={registerForm.username}
              onChange={handleInputChange('username')}
              className="w-full px-4 py-3 rounded-xl bg-[#F0E6D6] text-[#687949] placeholder-[#687949]/50
                       border-2 border-transparent focus:border-[#687949] focus:bg-white
                       transition-all duration-200"
              placeholder="请输入用户名（至少3个字符）"
              disabled={loading}
              required
              minLength={3}
              maxLength={30}
            />
          </div>



          {/* 密码输入框 */}
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-[#687949] mb-2">
              密码 *
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={handleInputChange('password')}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F0E6D6] text-[#687949] placeholder-[#687949]/50
                         border-2 border-transparent focus:border-[#687949] focus:bg-white
                         transition-all duration-200"
                placeholder="请输入密码（至少8个字符）"
                disabled={loading}
                required
                minLength={8}
                maxLength={100}
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

          {/* 确认密码输入框 */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-[#687949] mb-2">
              确认密码 *
            </label>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full px-4 py-3 rounded-xl bg-[#F0E6D6] text-[#687949] placeholder-[#687949]/50
                       border-2 border-transparent focus:border-[#687949] focus:bg-white
                       transition-all duration-200"
              placeholder="请再次输入密码"
              disabled={loading}
              required
            />
          </div>

          {/* 注册按钮 */}
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
                <span>注册中...</span>
              </div>
            ) : (
              '创建账户'
            )}
          </button>
        </form>

        {/* 切换到登录 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#687949] opacity-70">
            已有账户？{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#687949] hover:text-[#505D39] font-medium 
                       transition-colors duration-200 underline"
              disabled={loading}
            >
              立即登录
            </button>
          </p>
        </div>

        {/* 使用条款提示 */}
        <div className="mt-3 text-center">
          <p className="text-xs text-[#687949] opacity-50">
            注册即表示您同意我们的{' '}
            <a href="#" className="text-[#687949] hover:text-[#505D39] underline">
              服务条款
            </a>{' '}
            和{' '}
            <a href="#" className="text-[#687949] hover:text-[#505D39] underline">
              隐私政策
            </a>
          </p>
        </div>
    </div>
  )
} 