import axios, { type AxiosResponse } from 'axios'
import type { LoginForm, RegisterForm, User } from '@/store/AuthState'

// API基础配置
const API_BASE_URL = 'http://localhost:6655' // 后端服务地址
const API_PREFIX = '/auth'

// 创建axios实例
const authApi = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应接口定义
export interface AuthResponse {
  id: string
  username: string
  phoneNumber?: string
  accessToken: string
  refreshToken: string
  lastLogin?: string
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
}

// 认证服务类
export class AuthService {
  /**
   * 用户注册
   * @param registerData 注册数据
   * @returns 注册响应
   */
  static async register(registerData: RegisterForm): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/register', {
        username: registerData.username,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber || undefined,
      })
      
      return response.data
    } catch (error: any) {
      console.error('注册失败:', error)
      
      if (error.response?.data) {
        throw new Error(error.response.data.message || '注册失败')
      }
      
      throw new Error('网络错误，请稍后重试')
    }
  }

  /**
   * 用户登录
   * @param loginData 登录数据
   * @returns 登录响应
   */
  static async login(loginData: LoginForm): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/login', {
        username: loginData.username,
        password: loginData.password,
      })
      
      return response.data
    } catch (error: any) {
      console.error('登录失败:', error)
      
      if (error.response?.data) {
        throw new Error(error.response.data.message || '登录失败')
      }
      
      throw new Error('网络错误，请稍后重试')
    }
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const response: AxiosResponse<{ accessToken: string }> = await authApi.post('/refresh-token', {
        refreshToken,
      })
      
      return response.data
    } catch (error: any) {
      console.error('刷新令牌失败:', error)
      throw new Error('令牌刷新失败，请重新登录')
    }
  }

  /**
   * 用户登出
   * @param accessToken 访问令牌
   */
  static async logout(accessToken: string): Promise<void> {
    try {
      await authApi.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch (error: any) {
      console.error('登出失败:', error)
      // 登出失败不抛出错误，因为可能是令牌已过期
    }
  }

  /**
   * 验证令牌有效性
   * @param token 访问令牌
   * @returns 是否有效
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      // 调用一个需要认证的接口来验证令牌
      await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * 设置请求拦截器，自动添加认证头
   * @param getToken 获取token的函数
   */
  static setupInterceptors(getToken: () => string | null) {
    // 请求拦截器
    authApi.interceptors.request.use(
      (config) => {
        const token = getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器
    authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // 如果是401错误且没有重试过
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          // 这里可以尝试刷新令牌
          // 具体实现需要根据应用状态管理来处理
          console.log('Token expired, need to refresh or redirect to login')
        }

        return Promise.reject(error)
      }
    )
  }
}

// 导出API实例供其他地方使用
export { authApi } 