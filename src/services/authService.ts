import axios, { type AxiosResponse } from 'axios'
import type { LoginForm, RegisterForm, User } from '@/store/AuthState'

// API基础配置
const API_BASE_URL = 'http://localhost:8080' // 直接请求方式（已修复CORS）
// const API_BASE_URL = '' // 使用代理方式
const API_PREFIX = '/auth' // 后端实际路径

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
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK') {
        throw new Error('无法连接到服务器，请检查网络连接或稍后重试')
      }
      
      // 处理CORS错误
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        throw new Error('服务器连接失败，请联系管理员检查服务器配置')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '注册失败'
        throw new Error(message)
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接后重试')
      }
      
      // 其他未知错误
      throw new Error('注册失败，请稍后重试')
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
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK') {
        throw new Error('无法连接到服务器，请检查网络连接或稍后重试')
      }
      
      // 处理CORS错误
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        throw new Error('服务器连接失败，请联系管理员检查服务器配置')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '登录失败'
        throw new Error(message)
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接后重试')
      }
      
      // 其他未知错误
      throw new Error('登录失败，请稍后重试')
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
   * 获取用户资料
   * @param token 访问令牌
   * @returns 用户资料
   */
  static async getUserProfile(token: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('获取用户资料失败:', error)
      throw new Error('获取用户资料失败')
    }
  }

  /**
   * 测试服务器连接
   * @returns 连接是否成功
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // 使用认证相关的端点测试连接
      const response = await axios.options(`${API_BASE_URL}${API_PREFIX}/register`, {
        timeout: 5000,
      })
      
      return {
        success: true,
        message: '服务器连接正常'
      }
    } catch (error: any) {
      console.error('连接测试失败:', error)
      
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: '无法连接到服务器，请检查网络连接'
        }
      }
      
      if (error.message.includes('CORS')) {
        return {
          success: false,
          message: 'CORS配置问题，请联系管理员'
        }
      }
      
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          message: '连接超时，服务器可能繁忙'
        }
      }
      
      return {
        success: false,
        message: `连接失败: ${error.message || '未知错误'}`
      }
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