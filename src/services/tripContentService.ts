import axios, { type AxiosResponse } from 'axios'

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
const API_PREFIX = '/chat'

// 调试信息 - 用于排查环境判断问题
if (typeof window !== 'undefined') {
  console.log('🔍 TripContentService 环境判断:')
  console.log('- hostname:', window.location.hostname)
  console.log('- port:', window.location.port)
  console.log('- isDevelopment:', isDevelopment)
  console.log('- isProductionDomain:', isProductionDomain)
  console.log('- 最终 API_BASE_URL:', API_BASE_URL)
  console.log('- 完整 baseURL:', `${API_BASE_URL}${API_PREFIX}`)
}

// 创建axios实例
const tripContentApi = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 120000, // 图片生成可能需要更长时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 图片生成请求接口
export interface ImageGenerationRequest {
  sessionId: string
  taskType: 'image_generation'
  imageGeneration: {
    prompt: string
    style?: string
    parameters?: {
      size?: string
      quality?: string
      seed?: number
    }
    images?: Array<{
      data: string
      mimeType: string
    }>
  }
  config?: {
    preferredModelId?: string
  }
  streaming: boolean
}

// 故事生成请求接口
export interface StoryGenerationRequest {
  sessionId: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  taskType: 'ai_roleplay_dialogue'
  streaming: boolean
  config?: {
    preferredModelId?: string
  }
}

// API响应接口
export interface ContentGenerationResponse {
  status: 'completed' | 'failed'
  response: any
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
}

// 旅行内容服务类
export class TripContentService {
  /**
   * 生成旅行图片
   * @param prompt 图片生成提示词
   * @param accessToken 用户访问令牌
   * @returns 图片URL
   */
  static async generateTravelImage(
    prompt: string,
    accessToken: string
  ): Promise<string> {
    try {
      const requestData: ImageGenerationRequest = {
        sessionId: `temp_image_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        taskType: 'image_generation',
        imageGeneration: {
          prompt,
          style: 'realistic',
          parameters: {
            size: '1024x1024',
            quality: 'hd'
          }
        },
        streaming: false
      }

      const response: AxiosResponse<ContentGenerationResponse> = await tripContentApi.post(
        '/generate-image',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (response.data.status === 'completed') {
        // 尝试从不同可能的响应格式中提取图片URL
        const result = response.data.response
        
        // 支持多种可能的字段名
        if (result?.imageUrl) {
          return result.imageUrl
        }
        
        if (result?.image_url) {
          return result.image_url
        }
        
        if (typeof result === 'string') {
          // 如果响应是字符串，尝试提取URL
          const urlMatch = result.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)
          if (urlMatch) {
            return urlMatch[0]
          }
          
          // 如果字符串看起来像是base64或data URL
          if (result.startsWith('data:image/') || result.match(/^[A-Za-z0-9+/=]+$/)) {
            return result.startsWith('data:') ? result : `data:image/png;base64,${result}`
          }
        }
        
        throw new Error('无法从API响应中提取图片URL')
      } else {
        throw new Error(response.data.error || '图片生成失败')
      }
    } catch (error: any) {
      console.error('图片生成API调用失败:', error)
      if (error.response?.status === 401) {
        throw new Error('用户未登录或登录已过期')
      }
      throw new Error(error.response?.data?.message || error.message || '图片生成失败')
    }
  }

  /**
   * 生成旅行故事
   * @param prompt 故事生成提示词
   * @param accessToken 用户访问令牌
   * @returns 故事内容
   */
  static async generateTravelStory(
    prompt: string,
    accessToken: string
  ): Promise<string> {
    try {
      const requestData: StoryGenerationRequest = {
        sessionId: `temp_story_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        taskType: 'ai_roleplay_dialogue',
        streaming: false
      }

      const response: AxiosResponse<ContentGenerationResponse> = await tripContentApi.post(
        '/message',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (response.data.status === 'completed') {
        const result = response.data.response
        
        // 尝试从不同可能的响应格式中提取故事内容
        if (result?.content) {
          return result.content
        }
        
        if (typeof result === 'string') {
          return result
        }
        
        // 如果响应有消息格式
        if (result?.message?.content) {
          return result.message.content
        }
        
        throw new Error('无法从API响应中提取故事内容')
      } else {
        throw new Error(response.data.error || '故事生成失败')
      }
    } catch (error: any) {
      console.error('故事生成API调用失败:', error)
      if (error.response?.status === 401) {
        throw new Error('用户未登录或登录已过期')
      }
      throw new Error(error.response?.data?.message || error.message || '故事生成失败')
    }
  }

  /**
   * 构建旅行图片生成提示词
   * @param activity 活动信息
   * @param petInfo 宠物信息
   * @param language 语言设置
   * @returns 图片提示词
   */
  static buildImagePrompt(
    activity: any,
    petInfo: any,
    language: 'zh' | 'en'
  ): string {
    const petTypeMap = {
      'cat': '猫',
      'dog': '狗', 
      'other': '水豚'
    }
    const petTypeCn = petTypeMap[petInfo.type as keyof typeof petTypeMap] || '宠物'
    const location = language === 'zh' ? activity.location : activity.locationEn

    return `请你画一张极其平凡无奇的iPhone自拍照，没有明确的主体或者构图感——就像是随手一拍的快照。照片运动模糊，阳光或者店内灯光不均导致轻微曝光过度。角度尴尬，构图混乱，整体呈现出一种刻意的平庸感——就像是从口袋里拿手机时不小心拍到的一张自拍，有电影感氛围感。主角是一只可爱的${petTypeCn}，在${location}前，${petTypeCn}在画面中大约占三分之一，天气晴朗。图片需要1:1的尺寸，${petTypeCn}表现得非常开心，非常可爱，眼睛是睁开的。${petTypeCn}在${location}的目的是${activity.description}，时间是${activity.time}`
  }

  /**
   * 构建旅行故事生成提示词
   * @param activity 活动信息
   * @param petInfo 宠物信息
   * @param cityName 城市名称
   * @param language 语言设置
   * @returns 故事提示词
   */
  static buildStoryPrompt(
    activity: any,
    petInfo: any,
    cityName: string,
    language: 'zh' | 'en'
  ): string {
    const petName = petInfo.name || '豚豚'
    const petTypeDesc = petInfo.type === 'cat' ? '猫咪' : 
                       petInfo.type === 'dog' ? '小狗' : '水豚'
    const location = language === 'zh' ? activity.location : activity.locationEn

    return `你是${petName}，一只可爱的${petTypeDesc}。你刚刚在${cityName}的${location}体验了${activity.description}。请以第一人称的角度写一段简短的旅行感受，字数控制在50-80字以内，语气要可爱、生动、有个性。要包含你在这个地方的具体感受、遇到的有趣事情或者意外发现。`
  }
} 