// AI响应解析器使用示例
import { parseAITripResponse, formatAIResultForDisplay, type AIRawResponse } from './aiResponseParser'
import { TripPlanningService } from '@/services/tripPlanningService'

/**
 * 使用示例：解析AI返回的旅行计划数据
 */
export function exampleUsage() {
  // 示例1：基础解析使用
  const aiResponse: AIRawResponse = {
    content: {
      text: `{
        "city": "日本",
        "travel_style": "宠物友好旅行，小喵(cat)",
        "travel_theme": ["随机探索"],
        "plan": [
          {
            "time": "08:00-09:00",
            "place": "日本·中目黑河畔",
            "tags": ["自然", "发呆", "遛弯"],
            "description": "想沿河边慢慢走喵～"
          }
        ]
      }`
    }
  }

  // 解析AI响应
  const parseResult = parseAITripResponse(aiResponse)
  
  if (parseResult.success && parseResult.data) {
    console.log('解析成功:', parseResult.data)
    
    // 格式化为显示友好的格式
    const displayData = formatAIResultForDisplay(parseResult)
    console.log('显示数据:', displayData)
  } else {
    console.error('解析失败:', parseResult.error)
  }
}

/**
 * 使用示例：在服务中集成解析器
 */
export async function serviceIntegrationExample(aiResponse: AIRawResponse) {
  try {
    // 使用TripPlanningService的新方法解析AI响应
    const planningResponse = TripPlanningService.parseAITripPlanResponse(aiResponse, 'zh')
    
    if (planningResponse.success && planningResponse.data) {
      console.log('服务解析成功:', {
        title: planningResponse.data.planTitle,
        activitiesCount: planningResponse.data.activities.length,
        totalDuration: planningResponse.data.totalDuration
      })
      
      // 这里可以继续处理解析后的数据
      // 例如：保存到状态管理、更新UI等
      return planningResponse.data
    } else {
      throw new Error(planningResponse.error || '解析失败')
    }
  } catch (error) {
    console.error('服务集成失败:', error)
    throw error
  }
}

/**
 * 使用示例：在React组件中使用
 */
export function componentUsageExample() {
  return `
// 在React组件中使用示例

import React, { useState, useEffect } from 'react'
import { AIPlanDisplay } from '@/components/AIPlanDisplay'
import { parseAITripResponse, type AIRawResponse } from '@/utils/aiResponseParser'

const MyTripComponent: React.FC = () => {
  const [aiResponse, setAiResponse] = useState<AIRawResponse | null>(null)
  
  // 模拟从API获取AI响应
  useEffect(() => {
    const fetchAIResponse = async () => {
      try {
        // 这里是你实际的API调用
        const response = await fetch('/api/ai-trip-plan')
        const data = await response.json()
        setAiResponse(data)
      } catch (error) {
        console.error('获取AI响应失败:', error)
      }
    }
    
    fetchAIResponse()
  }, [])
  
  // 如果还没有数据，显示加载状态
  if (!aiResponse) {
    return <div>加载中...</div>
  }
  
  // 使用AIPlanDisplay组件渲染解析后的数据
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI生成的旅行计划</h1>
      <AIPlanDisplay aiResponse={aiResponse} />
    </div>
  )
}

export default MyTripComponent
  `
}

/**
 * 错误处理示例
 */
export function errorHandlingExample(aiResponse: AIRawResponse) {
  const parseResult = parseAITripResponse(aiResponse)
  
  if (!parseResult.success) {
    // 根据错误类型进行不同的处理
    if (parseResult.error?.includes('JSON')) {
      console.error('JSON格式错误，可能需要清理AI响应数据')
      // 可以尝试修复常见的JSON格式问题
    } else if (parseResult.error?.includes('必要字段')) {
      console.error('数据结构不完整，需要检查AI响应格式')
      // 可以提供默认值或请求重新生成
    } else {
      console.error('未知解析错误:', parseResult.error)
    }
    return null
  }
  
  return parseResult.data
}

/**
 * 批量处理示例
 */
export function batchProcessingExample(aiResponses: AIRawResponse[]) {
  const results = aiResponses.map((response, index) => {
    const parseResult = parseAITripResponse(response)
    
    return {
      index,
      success: parseResult.success,
      data: parseResult.data,
      error: parseResult.error
    }
  })
  
  // 统计成功和失败的数量
  const successCount = results.filter(r => r.success).length
  const failureCount = results.length - successCount
  
  console.log(`批量处理完成: ${successCount}成功, ${failureCount}失败`)
  
  return results
} 