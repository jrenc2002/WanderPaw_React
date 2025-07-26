import axios, { type AxiosResponse } from 'axios'
import type { PetInfo } from '@/store/PetState'
import type { XhsSearchResponse } from './xhsService'
import { XhsService } from './xhsService'
import { parseAITripResponse, parseAITripResponseWithCoordinates, type AIRawResponse } from '@/utils/aiResponseParser'

// WanderPaw Fastify后端API配置 - 使用vite代理 [[memory:4342674]]
const TRIP_API_BASE_URL = '/api' // 使用vite代理访问后端API
const TRIP_API_PREFIX = '/chat'

// 创建axios实例
const tripApi = axios.create({
  baseURL: `${TRIP_API_BASE_URL}${TRIP_API_PREFIX}`,
  timeout: 60000, // 60秒超时，AI生成可能需要较长时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // 不发送cookies
})

// 旅行计划生成请求接口
export interface TripPlanningRequest {
  cityName: string
  cityNameEn: string
  themes: string[]
  themeNames: string[]
  duration?: number // 旅行天数
  petInfo: PetInfo
  xhsData?: {
    travelTips: string[]
    popularSpots: string[]
    recommendations: string[]
    totalNotes: number
  }
  language: 'zh' | 'en'
}

// 旅行活动接口
export interface GeneratedTripActivity {
  id: string
  time: string
  title: string
  titleEn: string
  location: string
  locationEn: string
  theme: string
  duration: number // 分钟
  description: string
  descriptionEn: string
  coordinates?: [number, number]
  tips?: string[]
  estimatedCost?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

// 旅行计划响应接口
export interface TripPlanningResponse {
  success: boolean
  message: string
  data?: {
    planTitle: string
    planTitleEn: string
    activities: GeneratedTripActivity[]
    summary: string
    summaryEn: string
    totalDuration: number
    estimatedBudget?: number
    notes: string[]
    xhsSourceCount: number
  }
  error?: string
}

// Dify工作流响应接口
interface DifyWorkflowResponse {
  status: 'completed' | 'failed' | 'pending'
  response?: any
  error?: string
  usage?: {
    total_tokens: number
    prompt_tokens: number
    completion_tokens: number
  }
}

// 旅行规划服务类
export class TripPlanningService {
  /**
   * 处理AI特定格式的旅行计划响应
   * @param aiResponse AI返回的原始响应数据
   * @param language 语言设置
   * @returns 标准化的旅行计划响应
   */
  static async parseAITripPlanResponse(
    aiResponse: AIRawResponse,
    language: 'zh' | 'en' = 'zh'
  ): Promise<TripPlanningResponse> {
    try {
      console.log('开始解析AI旅行计划响应...')
      
      // 使用带坐标的专用解析器解析AI响应
      const parseResult = await parseAITripResponseWithCoordinates(aiResponse, true)
      
      if (!parseResult.success || !parseResult.data) {
        return {
          success: false,
          message: '解析AI响应失败',
          error: parseResult.error || '未知解析错误'
        }
      }

      const { data } = parseResult
      
      // 转换为标准化格式
      const planTitle = language === 'zh' 
        ? `${data.city}一日游计划`
        : `${data.city} Day Trip Plan`
      
      const planTitleEn = `${data.city} Day Trip Plan`
      
      const summary = language === 'zh'
        ? `为您精心规划了${data.city}的${data.travelStyle}，包含${data.activities.length}个精选活动。`
        : `A carefully planned ${data.travelStyle} in ${data.city} with ${data.activities.length} selected activities.`
      
      const summaryEn = `A carefully planned ${data.travelStyle} in ${data.city} with ${data.activities.length} selected activities.`
      
      // 计算总时长
      const totalDuration = data.activities.reduce((total: number, activity: any) => total + activity.duration, 0)
      
      // 生成旅行提示
      const notes = language === 'zh' ? [
        `本计划适合${data.travelStyle}`,
        '请根据实际情况调整时间安排',
        '建议提前查看各景点的开放时间',
        '注意天气变化，做好相应准备'
      ] : [
        `This plan is suitable for ${data.travelStyle}`,
        'Please adjust the schedule according to actual conditions',
        'It is recommended to check the opening hours of attractions in advance',
        'Pay attention to weather changes and make appropriate preparations'
      ]
      
      console.log('AI旅行计划解析完成:', {
        city: data.city,
        activitiesCount: data.activities.length,
        totalDuration: totalDuration,
        themes: data.themes
      })

      return {
        success: true,
        message: 'AI旅行计划解析成功',
        data: {
          planTitle,
          planTitleEn,
          activities: data.activities,
          summary,
          summaryEn,
          totalDuration,
          estimatedBudget: undefined, // AI响应中通常不包含预算信息
          notes,
          xhsSourceCount: 0 // AI响应不是基于小红书数据
        }
      }
      
    } catch (error) {
      console.error('解析AI旅行计划失败:', error)
      return {
        success: false,
        message: '解析AI旅行计划时发生错误',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 生成完整的旅行计划
   * @param request 旅行规划请求
   * @param accessToken 访问令牌
   * @returns 生成的旅行计划
   */
  static async generateTripPlan(
    request: TripPlanningRequest,
    accessToken: string
  ): Promise<TripPlanningResponse> {
    try {
      console.log('开始生成旅行计划:', {
        city: request.cityName,
        themes: request.themes,
        hasPetInfo: !!request.petInfo,
        hasXhsData: !!request.xhsData,
        language: request.language
      })

      // 第一步：搜索小红书内容（如果还没有的话）
      let xhsData = request.xhsData
      if (!xhsData) {
        try {
          console.log('搜索小红书旅行内容...')
          const xhsResponse = await XhsService.searchTravelContent(
            request.cityName,
            [...request.themeNames, '景点', '美食']
          )
          xhsData = XhsService.processTravelData(xhsResponse)
          console.log('小红书内容搜索完成:', {
            travelTips: xhsData.travelTips.length,
            popularSpots: xhsData.popularSpots.length,
            recommendations: xhsData.recommendations.length
          })
        } catch (error) {
          console.warn('小红书搜索失败，将使用默认数据:', error)
          xhsData = {
            travelTips: [],
            popularSpots: [],
            recommendations: [],
            totalNotes: 0
          }
        }
      }

      // 第二步：构建Dify工作流输入数据
      const difyInputs = {
        // 基础信息
        destination: request.cityName,
        destination_en: request.cityNameEn,
        travel_themes: request.themes.join(', '),
        travel_themes_names: request.themeNames.join(', '),
        language: request.language,
        duration: request.duration || 1,

        // 宠物信息
        pet_name: request.petInfo.name || '',
        pet_type: request.petInfo.type || '',
        pet_character: request.petInfo.personality?.join(', ') || '',
        pet_preferences: '', // PetInfo中暂无此字段
        pet_age: request.petInfo.age || '',
        pet_special_needs: '', // PetInfo中暂无此字段

        // 小红书数据
        xhs_travel_tips: xhsData.travelTips.join('\n'),
        xhs_popular_spots: xhsData.popularSpots.join(', '),
        xhs_recommendations: xhsData.recommendations.join('\n'),
        xhs_source_count: xhsData.totalNotes,

        // 生成要求
        generate_coordinates: true,
        include_timeline: true,
        include_pet_activities: true,
        output_format: 'structured_json'
      }

      console.log('准备调用Dify工作流:', {
        inputsKeys: Object.keys(difyInputs),
        destinationInfo: `${request.cityName} (${request.cityNameEn})`,
        petInfo: `${request.petInfo.name} (${request.petInfo.type})`,
        xhsDataStatus: xhsData.totalNotes > 0 ? '已获取' : '未获取'
      })

      // 第三步：调用Dify任务规划API
      const difyRequest = {
        origin_data: JSON.stringify(xhsData), // 小红书数据
        travel_style: `宠物友好旅行，${request.petInfo.name}(${request.petInfo.type})，持续${request.duration}天`,
        travel_theme: request.themeNames.join('、'),
        city: request.cityName,
        streaming: false
      }

      const response: AxiosResponse<DifyWorkflowResponse> = await tripApi.post('/generate-task-plan', difyRequest, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log('Dify工作流响应:', {
        status: response.data.status,
        hasResponse: !!response.data.response,
        hasError: !!response.data.error
      })

      // 第四步：处理响应数据
      if (response.data.status === 'completed' && response.data.response) {
        const planData = this.parseTripPlanFromDify(response.data.response, request.language)
        
        return {
          success: true,
          message: '旅行计划生成成功',
          data: {
            ...planData,
            xhsSourceCount: xhsData.totalNotes
          }
        }
      } else if (response.data.error) {
        throw new Error(response.data.error)
      } else {
        throw new Error('Dify工作流返回了意外的响应格式')
      }

    } catch (error: any) {
      console.error('旅行计划生成失败:', error)
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('无法连接到旅行规划服务，请检查网络连接')
      }
      
      // 处理认证错误
      if (error.response?.status === 401) {
        throw new Error('登录已过期，请重新登录')
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('旅行计划生成超时，请稍后重试')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      
      // 其他未知错误
      throw new Error(error.message || '旅行计划生成失败，请稍后重试')
    }
  }

  /**
   * 从Dify响应中解析旅行计划数据
   * @param difyResponse Dify工作流响应
   * @param language 语言
   * @returns 解析后的旅行计划数据
   */
  private static parseTripPlanFromDify(difyResponse: any, language: 'zh' | 'en'): {
    planTitle: string
    planTitleEn: string
    activities: GeneratedTripActivity[]
    summary: string
    summaryEn: string
    totalDuration: number
    estimatedBudget?: number
    notes: string[]
  } {
    try {
      console.log('开始解析Dify响应:', difyResponse)
      
      // 尝试解析JSON格式的响应
      let planData = difyResponse
      if (typeof difyResponse === 'string') {
        // 如果是字符串，尝试提取JSON部分
        const jsonMatch = difyResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          planData = JSON.parse(jsonMatch[0])
        } else {
          // 如果没有JSON，使用简单文本解析
          return this.parseTextTripPlan(difyResponse, language)
        }
      }

      // 检查是否是新的AI响应格式（包含 content.text 结构）
      if (planData.content && planData.content.text) {
        console.log('检测到AI响应格式，使用专用解析器')
        const aiParseResult = parseAITripResponse(planData as any)
        if (aiParseResult.success && aiParseResult.data) {
          const { data } = aiParseResult
          return {
            planTitle: language === 'zh' ? `${data.city}一日游计划` : `${data.city} Day Trip Plan`,
            planTitleEn: `${data.city} Day Trip Plan`,
            activities: data.activities,
            summary: language === 'zh' 
              ? `为您精心规划了${data.city}的${data.travelStyle}，包含${data.activities.length}个精选活动。`
              : `A carefully planned ${data.travelStyle} in ${data.city} with ${data.activities.length} selected activities.`,
            summaryEn: `A carefully planned ${data.travelStyle} in ${data.city} with ${data.activities.length} selected activities.`,
            totalDuration: data.activities.reduce((total, activity) => total + activity.duration, 0),
            estimatedBudget: undefined,
            notes: language === 'zh' ? [
              `本计划适合${data.travelStyle}`,
              '请根据实际情况调整时间安排',
              '建议提前查看各景点的开放时间',
              '注意天气变化，做好相应准备'
            ] : [
              `This plan is suitable for ${data.travelStyle}`,
              'Please adjust the schedule according to actual conditions',
              'It is recommended to check the opening hours of attractions in advance',
              'Pay attention to weather changes and make appropriate preparations'
            ]
          }
        }
      }

      // 提取活动列表 - 支持更多字段名
      const activities: GeneratedTripActivity[] = []
      const activitiesData = planData.activities || planData.itinerary || planData.schedule || planData.plan || []
      
      activitiesData.forEach((activity: any, index: number) => {
        const activityId = activity.id || `activity_${index + 1}`
        
        // 处理时间格式 - 支持 "08:00-09:00" 格式
        let timeStr = activity.time
        let duration = activity.duration || 120
        
        if (timeStr && timeStr.includes('-')) {
          // 解析时间范围
          const [startTime, endTime] = timeStr.split('-')
          timeStr = startTime
          
          // 计算持续时间
          try {
            const [startHour, startMin] = startTime.split(':').map(Number)
            const [endHour, endMin] = endTime.split(':').map(Number)
            const startMinutes = startHour * 60 + startMin
            const endMinutes = endHour * 60 + endMin
            duration = endMinutes - startMinutes > 0 ? endMinutes - startMinutes : 120
          } catch {
            duration = 120
          }
        } else if (!timeStr) {
          // 默认时间
          const baseTime = 9 + index * 2
          timeStr = `${baseTime.toString().padStart(2, '0')}:00`
        }

        // 处理地点信息 - 去除前缀
        const place = activity.place || activity.location || '待定'
        const location = place.replace(/^.*?·/, '') // 去除 "日本·" 等前缀
        
        // 根据标签推断主题
        const inferThemeFromTags = (tags: string[]): string => {
          const themeMap: Record<string, string> = {
            '自然': 'nature',
            '人文': 'culture',
            '美食': 'food',
            '购物': 'shopping',
            '拍照': 'photography',
            '发呆': 'relaxation',
            '遛弯': 'walking',
            '夜游': 'nightlife',
            '猫友好': 'pet-friendly',
            '互动': 'interactive',
            '奇遇': 'adventure',
            '复古': 'vintage',
            '突发事件': 'surprise'
          }
          
          for (const tag of tags) {
            if (themeMap[tag]) {
              return themeMap[tag]
            }
          }
          return 'culture'
        }
        
        const theme = activity.theme || activity.category || 
          (activity.tags ? inferThemeFromTags(activity.tags) : 'culture')

        activities.push({
          id: activityId,
          time: timeStr,
          title: activity.title || activity.name || location || `活动 ${index + 1}`,
          titleEn: activity.titleEn || activity.nameEn || activity.title || location || `Activity ${index + 1}`,
          location: location,
          locationEn: activity.locationEn || activity.placeEn || location || 'TBD',
          theme: theme,
          duration: duration,
          description: activity.description || activity.details || '',
          descriptionEn: activity.descriptionEn || activity.detailsEn || activity.description || '',
          coordinates: activity.coordinates || activity.location_coords,
          tips: activity.tips || activity.tags || [],
          estimatedCost: activity.cost || activity.price,
          difficulty: activity.difficulty || 'easy'
        })
      })

      return {
        planTitle: planData.title || planData.planTitle || (language === 'zh' ? '我的旅行计划' : 'My Trip Plan'),
        planTitleEn: planData.titleEn || planData.planTitleEn || planData.title || 'My Trip Plan',
        activities,
        summary: planData.summary || planData.description || '',
        summaryEn: planData.summaryEn || planData.descriptionEn || planData.summary || '',
        totalDuration: activities.reduce((total, activity) => total + activity.duration, 0),
        estimatedBudget: planData.budget || planData.estimatedCost,
        notes: planData.notes || planData.tips || []
      }
    } catch (error) {
      console.error('解析Dify响应失败:', error)
      // 降级到文本解析
      return this.parseTextTripPlan(difyResponse, language)
    }
  }

  /**
   * 简单文本解析（降级方案）
   * @param textResponse 文本响应
   * @param language 语言
   * @returns 解析后的旅行计划数据
   */
  private static parseTextTripPlan(textResponse: string, language: 'zh' | 'en'): {
    planTitle: string
    planTitleEn: string
    activities: GeneratedTripActivity[]
    summary: string
    summaryEn: string
    totalDuration: number
    estimatedBudget?: number
    notes: string[]
  } {
    // 简单的文本解析逻辑
    const lines = textResponse.split('\n').filter(line => line.trim())
    const activities: GeneratedTripActivity[] = []
    
    let currentTime = 9
    lines.forEach((line, index) => {
      if (line.includes('：') || line.includes(':')) {
        const timeStr = `${currentTime.toString().padStart(2, '0')}:00`
        activities.push({
          id: `activity_${index + 1}`,
          time: timeStr,
          title: line.split('：')[0] || line.split(':')[0] || `活动 ${index + 1}`,
          titleEn: `Activity ${index + 1}`,
          location: '待定',
          locationEn: 'TBD',
          theme: 'culture',
          duration: 120,
          description: line,
          descriptionEn: line,
        })
        currentTime += 2
      }
    })

    return {
      planTitle: language === 'zh' ? '我的旅行计划' : 'My Trip Plan',
      planTitleEn: 'My Trip Plan',
      activities,
      summary: textResponse.slice(0, 200),
      summaryEn: textResponse.slice(0, 200),
      totalDuration: activities.reduce((total, activity) => total + activity.duration, 0),
      notes: []
    }
  }

  /**
   * 检查旅行规划服务健康状态
   * @returns 服务状态
   */
  static async checkHealth(): Promise<{ status: 'ok' | 'error', message: string }> {
    try {
      // 直接尝试访问任务规划端点来检查服务状态
      // 这会返回400但表明服务是运行的
      const response = await axios.post(`${TRIP_API_BASE_URL}${TRIP_API_PREFIX}/generate-task-plan`, {
        origin_data: 'test',
        travel_style: 'test', 
        travel_theme: 'test',
        city: 'test'
      }, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      })
      return { status: 'ok', message: 'Trip planning service is running' }
    } catch (error: any) {
      console.error('旅行规划服务健康检查:', error.response?.status, error.message)
      // 401 (未授权) 或 400 (请求格式错误) 表明服务是运行的
      if (error.response?.status === 401 || error.response?.status === 400) {
        return { status: 'ok', message: 'Trip planning service is running (auth required)' }
      }
      return { 
        status: 'error', 
        message: error.code === 'ECONNREFUSED' 
          ? '旅行规划服务未启动' 
          : '旅行规划服务检查失败' 
      }
    }
  }
}

// 导出API实例供其他地方使用
export { tripApi } 