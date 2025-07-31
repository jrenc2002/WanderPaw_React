import axios, { type AxiosResponse } from 'axios'
import type { PetInfo } from '@/store/PetState'

// API基础配置 - 根据环境选择不同的基础URL
// 使用更可靠的环境判断：检查当前域名
const isDevelopment = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' ||
   window.location.port === '5173')

// 对于生产域名，强制使用生产环境API
const isProductionDomain = typeof window !== 'undefined' && 
  (window.location.hostname === 'wanderpaw.cn' ||
   window.location.hostname === 'winderpawweb.zeabur.app' ||
   window.location.hostname.endsWith('.zeabur.app'))

const API_BASE_URL = (isDevelopment && !isProductionDomain)
  ? '/api' // 开发环境使用vite代理
  : 'https://backeenee.zeabur.app' // 生产环境直接访问后端服务
const API_PREFIX = '/users' // 后端实际路径

// 创建axios实例
const petApi = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应接口定义
export interface PetInitializationResponse {
  success: boolean
  message: string
  petInfo?: PetInfo
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
}

// 宠物服务类
export class PetService {
  /**
   * 初始化宠物信息
   * @param petInfo 宠物信息数据
   * @param accessToken 访问令牌
   * @returns 初始化响应
   */
  static async initializePetInfo(petInfo: PetInfo, accessToken: string): Promise<PetInitializationResponse> {
    try {
      const response: AxiosResponse<PetInitializationResponse> = await petApi.post('/pet-info', petInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      return response.data
    } catch (error: any) {
      console.error('宠物信息初始化失败:', error)
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK') {
        throw new Error('无法连接到服务器，请检查网络连接或稍后重试')
      }
      
      // 处理CORS错误
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        throw new Error('服务器连接失败，请联系管理员检查服务器配置')
      }
      
      // 处理认证错误
      if (error.response?.status === 401) {
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理权限错误
      if (error.response?.status === 403) {
        throw new Error('没有权限执行此操作')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '宠物信息初始化失败'
        throw new Error(message)
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接后重试')
      }
      
      // 其他未知错误
      throw new Error('宠物信息初始化失败，请稍后重试')
    }
  }

  /**
   * 获取宠物信息
   * @param accessToken 访问令牌
   * @returns 宠物信息
   */
  static async getPetInfo(accessToken: string): Promise<PetInfo> {
    try {
      const response: AxiosResponse<{ petInfo: PetInfo }> = await petApi.get('/pet-info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      return response.data.petInfo
    } catch (error: any) {
      console.error('获取宠物信息失败:', error)
      
      // 处理认证错误
      if (error.response?.status === 401) {
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理404错误（用户还没有宠物信息）
      if (error.response?.status === 404) {
        return {} // 返回空对象表示没有宠物信息
      }
      
      // 处理其他错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '获取宠物信息失败'
        throw new Error(message)
      }
      
      throw new Error('获取宠物信息失败，请稍后重试')
    }
  }

  /**
   * 更新宠物信息
   * @param petInfo 宠物信息数据
   * @param accessToken 访问令牌
   * @returns 更新响应
   */
  static async updatePetInfo(petInfo: PetInfo, accessToken: string): Promise<PetInitializationResponse> {
    try {
      const response: AxiosResponse<PetInitializationResponse> = await petApi.put('/pet-info', petInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      return response.data
    } catch (error: any) {
      console.error('宠物信息更新失败:', error)
      
      // 处理认证错误
      if (error.response?.status === 401) {
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '宠物信息更新失败'
        throw new Error(message)
      }
      
      throw new Error('宠物信息更新失败，请稍后重试')
    }
  }

  /**
   * 删除宠物信息
   * @param accessToken 访问令牌
   * @returns 删除响应
   */
  static async deletePetInfo(accessToken: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; message: string }> = await petApi.delete('/pet-info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      
      return response.data
    } catch (error: any) {
      console.error('删除宠物信息失败:', error)
      
      // 处理认证错误
      if (error.response?.status === 401) {
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '删除宠物信息失败'
        throw new Error(message)
      }
      
      throw new Error('删除宠物信息失败，请稍后重试')
    }
  }

  /**
   * 设置请求拦截器，自动添加认证头
   * @param getToken 获取token的函数
   */
  static setupInterceptors(getToken: () => string | null) {
    // 请求拦截器
    petApi.interceptors.request.use(
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
    petApi.interceptors.response.use(
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
export { petApi } 