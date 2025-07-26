// 地理编码助手 - 专门处理活动地点的坐标获取
import { GeocodingService, type GeocodingResult } from '@/services/geocodingService'

/**
 * 简单的地理编码接口
 * 给定地点名称，返回大概的地址和坐标
 */
export interface SimpleGeocodingResult {
  name: string
  address: string
  coordinates: [number, number] | null
  confidence: number
  source: string
}

/**
 * 获取单个地点的坐标信息
 * @param locationName 地点名称
 * @returns 地理编码结果
 */
export async function getLocationCoordinates(locationName: string): Promise<SimpleGeocodingResult> {
  try {
    console.log(`正在获取地点坐标: ${locationName}`)
    
    const result = await GeocodingService.geocodeAddress(locationName, {
      timeout: 5000,
      useStaticData: true,
      fallbackCoordinates: [139.6917, 35.6895] // 东京中心坐标作为默认值
    })
    
    return {
      name: locationName,
      address: result.address,
      coordinates: result.coordinates,
      confidence: result.confidence,
      source: result.source
    }
  } catch (error) {
    console.error(`获取地点坐标失败 ${locationName}:`, error)
    return {
      name: locationName,
      address: locationName,
      coordinates: null,
      confidence: 0,
      source: 'error'
    }
  }
}

/**
 * 批量获取多个地点的坐标信息
 * @param locationNames 地点名称数组
 * @returns 地理编码结果数组
 */
export async function batchGetLocationCoordinates(locationNames: string[]): Promise<SimpleGeocodingResult[]> {
  console.log(`正在批量获取 ${locationNames.length} 个地点的坐标`)
  
  const results: SimpleGeocodingResult[] = []
  
  // 使用并发处理，但限制并发数
  const concurrency = 3
  for (let i = 0; i < locationNames.length; i += concurrency) {
    const batch = locationNames.slice(i, i + concurrency)
    
    const batchResults = await Promise.all(
      batch.map(locationName => getLocationCoordinates(locationName))
    )
    
    results.push(...batchResults)
    
    // 避免API限频
    if (i + concurrency < locationNames.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  // 统计结果
  const successCount = results.filter(r => r.coordinates !== null).length
  console.log(`坐标获取完成: ${successCount}/${locationNames.length} 个地点获取成功`)
  
  return results
}

/**
 * 为活动数组添加坐标信息
 * @param activities 活动数组
 * @returns 包含坐标信息的活动数组
 */
export async function enrichActivitiesWithCoordinates<T extends { location: string; coordinates?: [number, number] }>(
  activities: T[]
): Promise<T[]> {
  console.log(`正在为 ${activities.length} 个活动添加坐标信息`)
  
  // 提取需要地理编码的地点
  const locationsToGeocode = activities
    .filter(activity => !activity.coordinates)
    .map(activity => activity.location)
  
  if (locationsToGeocode.length === 0) {
    console.log('所有活动都已有坐标信息')
    return activities
  }
  
  // 批量获取坐标
  const geocodingResults = await batchGetLocationCoordinates(locationsToGeocode)
  
  // 创建地点坐标映射
  const coordinatesMap = new Map<string, [number, number] | null>()
  geocodingResults.forEach(result => {
    coordinatesMap.set(result.name, result.coordinates)
  })
  
  // 为活动添加坐标
  const enrichedActivities = activities.map(activity => {
    if (activity.coordinates) {
      return activity // 已有坐标，跳过
    }
    
    const coordinates = coordinatesMap.get(activity.location)
    return {
      ...activity,
      coordinates: coordinates || undefined
    }
  })
  
  const coordinatesAddedCount = enrichedActivities.filter(a => a.coordinates).length
  console.log(`坐标添加完成: ${coordinatesAddedCount}/${activities.length} 个活动获得坐标`)
  
  return enrichedActivities
}

/**
 * 直接测试地理编码API的辅助函数
 * @param locationName 地点名称
 */
export async function testGeocoding(locationName: string): Promise<void> {
  console.log(`\n=== 测试地理编码: ${locationName} ===`)
  
  const result = await getLocationCoordinates(locationName)
  
  console.log('结果:', {
    地点: result.name,
    地址: result.address,
    坐标: result.coordinates ? `${result.coordinates[1]}, ${result.coordinates[0]}` : '未找到',
    置信度: `${(result.confidence * 100).toFixed(1)}%`,
    数据源: result.source
  })
  
  if (result.coordinates) {
    const [lng, lat] = result.coordinates
    console.log(`Google Maps链接: https://www.google.com/maps?q=${lat},${lng}`)
  }
}

// 可以在控制台使用的测试函数
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testGeocoding = testGeocoding
  // @ts-ignore
  window.getLocationCoordinates = getLocationCoordinates
} 