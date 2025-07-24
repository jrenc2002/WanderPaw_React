import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { Navigate, useLocation } from 'react-router-dom'
import { authStateAtom, isUserInitializedAtom } from '@/store/AuthState'
import { AuthService } from '@/services/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean // 是否需要认证，默认为true
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const [authState, setAuthState] = useAtom(authStateAtom)
  const [isInitialized] = useAtom(isUserInitializedAtom)
  const location = useLocation()

  // 验证令牌有效性
  useEffect(() => {
    const validateUserToken = async () => {
      if (authState.accessToken && authState.isAuthenticated) {
        try {
          const isValid = await AuthService.validateToken(authState.accessToken)
          if (!isValid) {
            // 令牌无效，清除认证状态
            setAuthState({
              isAuthenticated: false,
              user: null,
              accessToken: null,
              refreshToken: null,
              loading: false,
              error: 'Token expired',
            })
          }
        } catch (error) {
          console.error('Token validation failed:', error)
          // 验证失败，清除认证状态
          setAuthState({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,
            loading: false,
            error: 'Token validation failed',
          })
        }
      }
    }

    if (requireAuth && authState.accessToken) {
      validateUserToken()
    }
  }, [authState.accessToken, authState.isAuthenticated, requireAuth, setAuthState])

  // 如果不需要认证，直接返回子组件
  if (!requireAuth) {
    return <>{children}</>
  }

  // 如果正在加载，显示加载界面
  if (authState.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">验证登录状态...</p>
        </div>
      </div>
    )
  }

  // 如果用户未登录，重定向到登录页面
  if (!authState.isAuthenticated) {
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          from: location.pathname,
          message: '请先登录以访问此页面'
        }} 
        replace 
      />
    )
  }

  // 如果用户已登录但未完成初始化，重定向到初始化页面
  // 但不包括初始化页面本身和设置页面（允许用户跳过后再设置）
  if (!isInitialized && 
      location.pathname !== '/pet-initialization' && 
      location.pathname !== '/setting') {
    return <Navigate to="/pet-initialization" replace />
  }

  // 用户已登录，返回子组件
  return <>{children}</>
}

// 反向保护路由：已登录用户不应该访问的页面（如登录页）
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState] = useAtom(authStateAtom)
  const location = useLocation()

  // 如果用户已登录，重定向到首页或来源页面
  if (authState.isAuthenticated) {
    const from = (location.state as any)?.from || '/home'
    return <Navigate to={from} replace />
  }

  // 用户未登录，显示页面内容
  return <>{children}</>
} 