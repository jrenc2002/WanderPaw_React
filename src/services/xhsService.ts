import axios, { type AxiosResponse } from 'axios'

/**
 * 小红书爬取服务 - 当前已禁用
 * 
 * 注意：由于小红书反爬策略更新，此服务当前无法正常工作，已在以下位置禁用：
 * 1. tripPlanningService.ts - 跳过小红书搜索，使用空数据
 * 2. vite.config.ts - 注释掉代理配置
 * 
 * 如需重新启用，请：
 * 1. 取消注释 vite.config.ts 中的 '/xhs-api' 代理配置
 * 2. 修改 tripPlanningService.ts 中的小红书搜索逻辑
 * 3. 确保后端爬虫服务可正常运行
 */

// 小红书API基础配置 - 根据环境选择不同的基础URL
const isDevelopment = import.meta.env.DEV
const XHS_API_BASE_URL = isDevelopment 
  ? '/xhs-api' // 开发环境使用vite代理
  : 'https://xhsxhs.zeabur.app' // 生产环境直接访问后端服务
const XHS_API_PREFIX = '/spider' // 小红书API路径前缀

// 创建axios实例
const xhsApi = axios.create({
  baseURL: `${XHS_API_BASE_URL}${XHS_API_PREFIX}`,
  timeout: 30000, // 30秒超时，因为爬虫可能需要较长时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // 不发送cookies
})

// 小红书搜索响应接口
export interface XhsSearchResponse {
  success: boolean
  message: string
  data?: {
    notes: Array<{
      note_id: string
      title: string
      desc: string
      type: string
      user: {
        nickname: string
        user_id: string
      }
      interact_info: {
        liked_count: string
        collected_count: string
        comment_count: string
        share_count: string
      }
      tag_list?: Array<{
        name: string
        type: string
      }>
      image_list?: Array<{
        url: string
        width: number
        height: number
      }>
      video_info?: {
        url: string
        duration: number
      }
    }>
    total_count: number
    search_query: string
  }
  error?: string
}

// 小红书服务类
export class XhsService {
  /**
   * 专门搜索城市路线相关内容
   * @param cityName 城市名称
   * @param routeType 路线类型（可选）如: "一日游", "三日游", "经典路线"等
   * @returns 路线相关的搜索结果
   */
  static async searchCityRoutes(
    cityName: string, 
    routeType: string = "路线"
  ): Promise<XhsSearchResponse> {
    try {
      // 构建专注于路线的搜索关键词
      const routeKeywords = [
        cityName,
        routeType
      ]
      const query = routeKeywords.join(' ')
      
      console.log('开始搜索城市路线:', { cityName, routeType, query })
      
      const requestData = {
        query: query,
        require_num: 5, // 获取更多笔记以便筛选路线内容
        save_choice: "none",
        sort_type_choice: 0, // 综合排序
        note_type: 0, // 不限笔记类型
        note_time: 0, // 不限时间
        note_range: 0, // 不限范围
        pos_distance: 0 // 不限距离
      }
      
      const response: AxiosResponse<XhsSearchResponse> = await xhsApi.post('/search', requestData)
      
      console.log('城市路线搜索完成:', {
        success: response.data.success,
        noteCount: response.data.data?.notes?.length || 0
      })
      
      return response.data
    } catch (error: any) {
      console.error('城市路线搜索失败:', error)
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('无法连接到小红书服务，请确保小红书后端服务正在运行')
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('小红书搜索超时，请稍后重试')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '城市路线搜索失败'
        throw new Error(message)
      }
      
      // 其他未知错误
      throw new Error('城市路线搜索失败，请稍后重试')
    }
  }

  /**
   * 处理城市路线数据，提取路线相关信息
   * @param xhsData 小红书搜索结果
   * @returns 处理后的路线信息
   */
  static processRouteData(xhsData: XhsSearchResponse): {
    routes: Array<{
      title: string
      description: string
      author: string
      tags: string[]
      interactionCount: number
    }>
    routeSummary: {
      popularRoutes: string[]
      recommendedDuration: string[]
      mustVisitSpots: string[]
    }
    totalNotes: number
  } {
    if (!xhsData.success || !xhsData.data?.notes) {
      return {
        routes: [],
        routeSummary: {
          popularRoutes: [],
          recommendedDuration: [],
          mustVisitSpots: []
        },
        totalNotes: 0
      }
    }

    const notes = xhsData.data.notes
    const routes: Array<{
      title: string
      description: string
      author: string
      tags: string[]
      interactionCount: number
    }> = []
    
    const popularRoutes: string[] = []
    const recommendedDuration: string[] = []
    const mustVisitSpots: string[] = []

    notes.forEach(note => {
      // 筛选包含路线关键词的笔记
      const content = `${note.title} ${note.desc}`.toLowerCase()
      const routeKeywords = ['路线', '行程', '攻略', '天游', '一日', '两日', '三日', '游玩']
      
      if (routeKeywords.some(keyword => content.includes(keyword))) {
        // 计算互动总数
        const interactionCount = 
          parseInt(note.interact_info.liked_count || '0') +
          parseInt(note.interact_info.collected_count || '0') +
          parseInt(note.interact_info.comment_count || '0')

        routes.push({
          title: note.title,
          description: note.desc,
          author: note.user.nickname,
          tags: note.tag_list?.map(tag => tag.name) || [],
          interactionCount
        })

        // 提取路线信息
        if (note.title.includes('路线')) {
          popularRoutes.push(note.title)
        }

        // 提取时长信息
        const durationMatch = content.match(/([一二三四五六七八九十1-9]+[日天])/g)
        if (durationMatch) {
          recommendedDuration.push(...durationMatch)
        }

        // 提取必游景点
        if (note.tag_list) {
          note.tag_list.forEach(tag => {
            if (tag.name && tag.name.length > 1 && !tag.name.includes('攻略')) {
              mustVisitSpots.push(tag.name)
            }
          })
        }
      }
    })

    // 按互动数排序路线
    routes.sort((a, b) => b.interactionCount - a.interactionCount)

    return {
      routes: routes.slice(0, 10), // 返回前10个最受欢迎的路线
      routeSummary: {
        popularRoutes: [...new Set(popularRoutes)].slice(0, 5),
        recommendedDuration: [...new Set(recommendedDuration)].slice(0, 3),
        mustVisitSpots: [...new Set(mustVisitSpots)].slice(0, 8)
      },
      totalNotes: routes.length
    }
  }

  /**
   * 搜索小红书旅行相关内容
   * @param cityName 城市名称
   * @param additionalKeywords 额外关键词（如主题）
   * @returns 搜索结果
   */
  static async searchTravelContent(
    cityName: string, 
    additionalKeywords: string[] = []
  ): Promise<XhsSearchResponse> {
    try {
      // 构建搜索查询词
      const keywords = [cityName, '旅行', '攻略', ...additionalKeywords]
      const query = keywords.join(' ')
      
      console.log('开始搜索小红书内容:', { cityName, additionalKeywords, query })
      
      const requestData = {
        query: query,
        require_num: 10, // 获取10条笔记
        save_choice: "none", // 不保存到本地文件
        sort_type_choice: 0, // 综合排序
        note_type: 0, // 不限笔记类型
        note_time: 0, // 不限时间
        note_range: 0, // 不限范围
        pos_distance: 0 // 不限距离
      }
      
      const response: AxiosResponse<XhsSearchResponse> = await xhsApi.post('/search', requestData)
      
      console.log('小红书搜索完成:', {
        success: response.data.success,
        noteCount: response.data.data?.notes?.length || 0
      })
      
      return response.data
    } catch (error: any) {
      console.error('小红书搜索失败:', error)
      
      // 处理网络错误
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        throw new Error('无法连接到小红书服务，请确保小红书后端服务正在运行')
      }
      
      // 处理超时错误
      if (error.code === 'ECONNABORTED') {
        throw new Error('小红书搜索超时，请稍后重试')
      }
      
      // 处理HTTP响应错误
      if (error.response?.data) {
        const message = error.response.data.message || error.response.data.error || '小红书搜索失败'
        throw new Error(message)
      }
      
      // 其他未知错误
      throw new Error('小红书搜索失败，请稍后重试')
    }
  }

  /**
   * 处理小红书数据，提取旅行相关信息
   * @param xhsData 小红书搜索结果
   * @returns 处理后的旅行信息
   */
  static processTravelData(xhsData: XhsSearchResponse): {
    travelTips: string[]
    popularSpots: string[]
    recommendations: string[]
    totalNotes: number
  } {
    if (!xhsData.success || !xhsData.data?.notes) {
      return {
        travelTips: [],
        popularSpots: [],
        recommendations: [],
        totalNotes: 0
      }
    }

    const notes = xhsData.data.notes
    const travelTips: string[] = []
    const popularSpots: string[] = []
    const recommendations: string[] = []

    notes.forEach(note => {
      // 提取标题和描述中的信息
      const content = `${note.title} ${note.desc}`.toLowerCase()
      
      // 添加笔记内容作为推荐
      if (note.title && note.title.length > 5) {
        recommendations.push(`${note.title}（来自：${note.user.nickname}）`)
      }
      
      // 提取地点信息
      if (note.tag_list) {
        note.tag_list.forEach(tag => {
          if (tag.name && tag.name.length > 1) {
            popularSpots.push(tag.name)
          }
        })
      }
      
      // 提取旅行小贴士
      if (content.includes('攻略') || content.includes('推荐') || content.includes('必去')) {
        travelTips.push(`${note.title}：${note.desc.slice(0, 100)}`)
      }
    })

    return {
      travelTips: [...new Set(travelTips)].slice(0, 5), // 去重并限制数量
      popularSpots: [...new Set(popularSpots)].slice(0, 8),
      recommendations: [...new Set(recommendations)].slice(0, 6),
      totalNotes: notes.length
    }
  }

  /**
   * 检查小红书服务健康状态
   * @returns 服务状态
   */
  static async checkHealth(): Promise<{ status: 'ok' | 'error', message: string }> {
    try {
      // 尝试发送一个测试搜索请求来检查服务状态
      const response = await xhsApi.post('/search', {
        query: 'test',
        require_num: 1,
        save_choice: "none",
        sort_type_choice: 0,
        note_type: 0,
        note_time: 0,
        note_range: 0,
        pos_distance: 0
      }, { 
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.status === 200) {
        return { status: 'ok', message: 'XHS service is running through proxy' }
      } else {
        return { status: 'error', message: `XHS service returned status ${response.status}` }
      }
    } catch (error: any) {
      console.error('小红书服务健康检查失败:', error)
      
      // 如果是400错误，说明服务是运行的，只是参数不对
      if (error.response?.status === 400) {
        return { status: 'ok', message: 'XHS service is running (test request rejected but service available)' }
      }
      
      return { 
        status: 'error', 
        message: error.response?.status === 404 
          ? '代理配置错误或服务端点不存在'
          : error.code === 'ECONNREFUSED' 
            ? '小红书服务未启动' 
            : '小红书服务检查失败' 
      }
    }
  }
}

// 导出API实例供其他地方使用
export { xhsApi } 