import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Tag } from 'lucide-react'
import type { AIRawResponse } from '@/utils/aiResponseParser'
import { parseAITripResponse, formatAIResultForDisplay } from '@/utils/aiResponseParser'

interface AIPlanDisplayProps {
  aiResponse: AIRawResponse
  className?: string
}

/**
 * AI旅行计划显示组件
 * 用于解析和展示AI返回的旅行计划数据
 */
export const AIPlanDisplay: React.FC<AIPlanDisplayProps> = ({ 
  aiResponse, 
  className = '' 
}) => {
  // 解析AI响应数据
  const parsedResult = parseAITripResponse(aiResponse)
  
  // 如果解析失败，显示错误信息
  if (!parsedResult.success) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardHeader>
          <CardTitle className="text-red-600">解析失败</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{parsedResult.error}</p>
        </CardContent>
      </Card>
    )
  }

  // 格式化显示数据
  const displayData = formatAIResultForDisplay(parsedResult)
  
  if (!displayData) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="pt-6">
          <p className="text-gray-500">暂无数据显示</p>
        </CardContent>
      </Card>
    )
  }

  const { planInfo, schedule } = displayData

  // 根据主题获取颜色
  const getThemeColor = (theme: string): string => {
    const themeColors: Record<string, string> = {
      'nature': 'bg-green-100 text-green-800',
      'culture': 'bg-blue-100 text-blue-800',
      'food': 'bg-orange-100 text-orange-800',
      'shopping': 'bg-purple-100 text-purple-800',
      'photography': 'bg-pink-100 text-pink-800',
      'relaxation': 'bg-gray-100 text-gray-800',
      'walking': 'bg-teal-100 text-teal-800',
      'nightlife': 'bg-indigo-100 text-indigo-800',
      'pet-friendly': 'bg-yellow-100 text-yellow-800',
      'interactive': 'bg-red-100 text-red-800',
      'adventure': 'bg-emerald-100 text-emerald-800',
      'vintage': 'bg-amber-100 text-amber-800',
      'surprise': 'bg-violet-100 text-violet-800'
    }
    return themeColors[theme] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 计划概览卡片 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {planInfo.city} 一日游计划
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">旅行风格</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {planInfo.style}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">旅行主题</p>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {planInfo.themes}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>共 {planInfo.totalActivities} 个活动</span>
          </div>
        </CardContent>
      </Card>

      {/* 活动时间线 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">行程安排</h3>
        
        {schedule.map((activity, index) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* 时间标签 */}
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {activity.time}
                  </Badge>
                </div>
                
                {/* 活动内容 */}
                <div className="flex-grow space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <Badge className={getThemeColor(activity.theme)}>
                      {activity.theme}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.location}</span>
                    <span className="text-gray-400">•</span>
                    <Clock className="h-4 w-4" />
                    <span>{activity.duration}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm">{activity.description}</p>
                  
                  {/* 标签 */}
                  {activity.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-4 w-4 text-gray-400" />
                      {activity.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex}
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 序号 */}
                <div className="flex-shrink-0 hidden md:block">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AIPlanDisplay 