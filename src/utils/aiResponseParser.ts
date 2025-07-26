// AI响应数据解析器
import type { GeneratedTripActivity } from '@/services/tripPlanningService'
import { GeocodingService } from '@/services/geocodingService'

// AI返回的原始数据结构
export interface AIRawResponse {
  content: {
    text: string
  }
}

// AI返回的计划项目结构
export interface AIPlanItem {
  time: string
  place: string
  tags: string[]
  description: string
}

// AI返回的解析后数据结构
export interface AIParsedData {
  city: string
  travel_style: string
  travel_theme: string[]
  plan: AIPlanItem[]
}

/**
 * 解析AI返回的旅行计划数据
 * @param aiResponse AI原始响应数据
 * @param includeCoordinates 是否获取坐标信息
 * @returns 解析后的标准化旅行活动数组
 */
export function parseAITripResponse(
  aiResponse: AIRawResponse,
  includeCoordinates: boolean = true
): {
  success: boolean
  data?: {
    city: string
    travelStyle: string
    themes: string[]
    activities: GeneratedTripActivity[]
  }
  error?: string
} {
  try {
    // 提取JSON字符串
    const jsonText = aiResponse.content.text
    
    // 解析JSON
    const parsedData: AIParsedData = JSON.parse(jsonText)
    
    // 验证必要字段
    if (!parsedData.city || !parsedData.plan || !Array.isArray(parsedData.plan)) {
      return {
        success: false,
        error: '数据格式不完整，缺少必要字段'
      }
    }

    // 转换为标准化的活动数组
    const activities: GeneratedTripActivity[] = parsedData.plan.map((item, index) => {
      const activityId = `ai_activity_${index + 1}`
      
      // 解析时间范围，如 "08:00-09:00"
      const timeRange = item.time.split('-')
      const startTime = timeRange[0] || '09:00'
      const endTime = timeRange[1] || '10:00'
      
      // 计算持续时间（分钟）
      const duration = calculateDuration(startTime, endTime)
      
      // 提取地点信息，去掉前缀如"日本·"
      const location = item.place.replace(/^.*?·/, '')
      
      // 根据标签推断主题
      const theme = inferThemeFromTags(item.tags)
      
      return {
        id: activityId,
        time: startTime,
        title: location,
        titleEn: translateToEnglish(location),
        location: location,
        locationEn: translateToEnglish(location),
        theme: theme,
        duration: duration,
        description: item.description,
        descriptionEn: translateToEnglish(item.description),
        coordinates: undefined, // AI数据中没有坐标信息
        tips: item.tags,
        estimatedCost: undefined,
        difficulty: 'easy'
      }
    })

    return {
      success: true,
      data: {
        city: parsedData.city,
        travelStyle: parsedData.travel_style,
        themes: parsedData.travel_theme,
        activities: activities
      }
    }
    
  } catch (error) {
    console.error('解析AI响应失败:', error)
    return {
      success: false,
      error: `解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

/**
 * 异步解析AI返回的旅行计划数据（包含坐标获取）
 * @param aiResponse AI原始响应数据
 * @param includeCoordinates 是否获取坐标信息
 * @returns 解析后的标准化旅行活动数组（包含坐标）
 */
export async function parseAITripResponseWithCoordinates(
  aiResponse: AIRawResponse,
  includeCoordinates: boolean = true
): Promise<{
  success: boolean
  data?: {
    city: string
    travelStyle: string
    themes: string[]
    activities: GeneratedTripActivity[]
  }
  error?: string
}> {
  try {
    // 先进行基础解析
    const basicParseResult = parseAITripResponse(aiResponse, false)
    
    if (!basicParseResult.success || !basicParseResult.data) {
      return basicParseResult
    }

    const { data } = basicParseResult

    // 如果不需要坐标，直接返回基础解析结果
    if (!includeCoordinates) {
      return basicParseResult
    }

    console.log('开始获取地点坐标信息...')

    // 提取所有需要地理编码的地址
    const addresses = data.activities.map(activity => activity.location)
    
    // 批量获取坐标
    const geocodingResults = await GeocodingService.batchGeocode(addresses, {
      timeout: 3000, // 3秒超时
      useStaticData: true
    })

    console.log('地理编码结果:', geocodingResults)

    // 将坐标信息添加到活动中
    const activitiesWithCoordinates = data.activities.map((activity, index) => {
      const geocodingResult = geocodingResults[index]
      
      return {
        ...activity,
        coordinates: geocodingResult ? geocodingResult.coordinates : undefined
      } as GeneratedTripActivity
    })

    // 统计坐标获取成功率
    const successfulCoordinates = geocodingResults.filter(result => 
      result && result.confidence > 0.5
    ).length
    
    console.log(`坐标获取完成: ${successfulCoordinates}/${addresses.length} 个地点获取到高质量坐标`)

    return {
      success: true,
      data: {
        ...data,
        activities: activitiesWithCoordinates
      }
    }
    
  } catch (error) {
    console.error('异步解析AI响应失败:', error)
    
    // 如果坐标获取失败，降级到基础解析
    const fallbackResult = parseAITripResponse(aiResponse, false)
    
    if (fallbackResult.success) {
      console.warn('坐标获取失败，使用基础解析结果')
      return fallbackResult
    }
    
    return {
      success: false,
      error: `异步解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    }
  }
}

/**
 * 计算时间持续长度（分钟）
 * @param startTime 开始时间 "HH:MM"
 * @param endTime 结束时间 "HH:MM"
 * @returns 持续时间（分钟）
 */
function calculateDuration(startTime: string, endTime: string): number {
  try {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    const duration = endMinutes - startMinutes
    return duration > 0 ? duration : 60 // 默认60分钟
  } catch {
    return 60 // 解析失败时默认60分钟
  }
}

/**
 * 根据标签推断旅行主题
 * @param tags 标签数组
 * @returns 主题字符串
 */
function inferThemeFromTags(tags: string[]): string {
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
  
  // 找到第一个匹配的主题
  for (const tag of tags) {
    if (themeMap[tag]) {
      return themeMap[tag]
    }
  }
  
  // 默认主题
  return 'culture'
}

/**
 * 简单的中英文翻译（临时方案）
 * @param text 中文文本
 * @returns 英文文本
 */
function translateToEnglish(text: string): string {
  // 这里可以后续集成翻译API，现在先用简单映射
  const translationMap: Record<string, string> = {
    '中目黑河畔': 'Nakameguro Riverside',
    '代官山蔦屋书店': 'Daikanyama T-Site',
    '下北泽街头小巷': 'Shimokitazawa Streets',
    '原宿猫咪咖啡馆MoCHA': 'Harajuku Cat Cafe MoCHA',
    '原宿街头': 'Harajuku Street',
    '代代木公园草地': 'Yoyogi Park Lawn',
    '涩谷站前': 'Shibuya Station',
    '涩谷猫街': 'Shibuya Cat Street',
    '池袋Sunshine City屋顶花园': 'Ikebukuro Sunshine City Rooftop Garden',
    '池袋站便利店门口': 'Ikebukuro Station Convenience Store',
    '想沿河边慢慢走喵～': 'Want to walk slowly along the river meow~',
    '想钻进书架睡一觉～': 'Want to sleep in the bookshelf~',
    '想穿进巷子找猫咪～': 'Want to explore alleys to find cats~',
    '想边吃饭边蹭猫猫！': 'Want to eat while cuddling cats!',
    '被路人夸是可爱喵～': 'Praised by passersby as cute meow~',
    '要去草地翻滚喵喵！': 'Going to roll on the grass meow meow!',
    '走错路看到跳舞喵！': 'Got lost and saw dancing meow!',
    '想买猫耳发箍戴～': 'Want to buy cat ear headband~',
    '想看星星发呆喵～': 'Want to stargaze and daydream meow~',
    '吃到芝士饭团跳脚啦！': 'Got excited eating cheese rice ball!'
  }
  
  return translationMap[text] || text
}

/**
 * 格式化AI解析结果为显示友好的格式
 * @param parsedResult 解析结果
 * @returns 格式化的数据
 */
export function formatAIResultForDisplay(parsedResult: ReturnType<typeof parseAITripResponse>) {
  if (!parsedResult.success || !parsedResult.data) {
    return null
  }
  
  const { data } = parsedResult
  
  return {
    planInfo: {
      city: data.city,
      style: data.travelStyle,
      themes: data.themes.join(', '),
      totalActivities: data.activities.length
    },
    schedule: data.activities.map(activity => ({
      id: activity.id,
      time: activity.time,
      title: activity.title,
      location: activity.location,
      description: activity.description,
      tags: activity.tips || [],
      duration: `${activity.duration}分钟`,
      theme: activity.theme
    }))
  }
} 