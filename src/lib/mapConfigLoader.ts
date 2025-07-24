import type { MapConfig, MapPoint, MapRoute } from '@/data/mapData'

/**
 * 从JSON配置加载地图数据
 */
export interface MapConfigJSON {
  center: [number, number]
  zoom: number
  points: MapPoint[]
  routes: MapRoute[]
}

/**
 * 从JSON文件URL加载地图配置
 * @param url JSON文件的URL
 * @returns Promise<MapConfig>
 */
export async function loadMapConfigFromURL(url: string): Promise<MapConfig> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const config: MapConfigJSON = await response.json()
    return validateAndTransformConfig(config)
  } catch (error) {
    console.error('Failed to load map config from URL:', error)
    throw error
  }
}

/**
 * 从JSON字符串加载地图配置
 * @param jsonString JSON字符串
 * @returns MapConfig
 */
export function loadMapConfigFromString(jsonString: string): MapConfig {
  try {
    const config: MapConfigJSON = JSON.parse(jsonString)
    return validateAndTransformConfig(config)
  } catch (error) {
    console.error('Failed to parse map config JSON:', error)
    throw error
  }
}

/**
 * 验证并转换配置数据
 * @param config 原始配置对象
 * @returns MapConfig
 */
function validateAndTransformConfig(config: MapConfigJSON): MapConfig {
  // 验证基本结构
  if (!config.center || !Array.isArray(config.center) || config.center.length !== 2) {
    throw new Error('Invalid center coordinates')
  }
  
  if (typeof config.zoom !== 'number' || config.zoom < 1 || config.zoom > 20) {
    throw new Error('Invalid zoom level')
  }
  
  if (!Array.isArray(config.points)) {
    throw new Error('Points must be an array')
  }
  
  if (!Array.isArray(config.routes)) {
    throw new Error('Routes must be an array')
  }
  
  // 验证点位数据
  config.points.forEach((point, index) => {
    if (!point.id || typeof point.id !== 'string') {
      throw new Error(`Point ${index}: id is required and must be a string`)
    }
    
    if (!point.position || !Array.isArray(point.position) || point.position.length !== 2) {
      throw new Error(`Point ${index}: invalid position coordinates`)
    }
    
    if (!point.title || typeof point.title !== 'string') {
      throw new Error(`Point ${index}: title is required and must be a string`)
    }
    
    if (typeof point.tangpingIndex !== 'number' || point.tangpingIndex < 0 || point.tangpingIndex > 100) {
      throw new Error(`Point ${index}: tangpingIndex must be a number between 0 and 100`)
    }
  })
  
  // 验证路线数据
  config.routes.forEach((route, index) => {
    if (!route.id || typeof route.id !== 'string') {
      throw new Error(`Route ${index}: id is required and must be a string`)
    }
    
    if (!route.name || typeof route.name !== 'string') {
      throw new Error(`Route ${index}: name is required and must be a string`)
    }
    
    if (!Array.isArray(route.waypoints) || route.waypoints.length < 2) {
      throw new Error(`Route ${index}: waypoints must be an array with at least 2 points`)
    }
    
    route.waypoints.forEach((waypoint, wpIndex) => {
      if (!waypoint.position || !Array.isArray(waypoint.position) || waypoint.position.length !== 2) {
        throw new Error(`Route ${index}, waypoint ${wpIndex}: invalid position coordinates`)
      }
    })
    
    // 验证交通方式
    if (route.travelMode && !['driving', 'walking', 'transit', 'bicycling'].includes(route.travelMode)) {
      throw new Error(`Route ${index}: invalid travelMode`)
    }
  })
  
  // 检查ID唯一性
  const pointIds = new Set()
  const routeIds = new Set()
  
  config.points.forEach(point => {
    if (pointIds.has(point.id)) {
      throw new Error(`Duplicate point ID: ${point.id}`)
    }
    pointIds.add(point.id)
  })
  
  config.routes.forEach(route => {
    if (routeIds.has(route.id)) {
      throw new Error(`Duplicate route ID: ${route.id}`)
    }
    routeIds.add(route.id)
  })
  
  return config as MapConfig
}

/**
 * 将地图配置导出为JSON字符串
 * @param config 地图配置
 * @param pretty 是否格式化输出
 * @returns JSON字符串
 */
export function exportMapConfigToString(config: MapConfig, pretty: boolean = true): string {
  try {
    return JSON.stringify(config, null, pretty ? 2 : 0)
  } catch (error) {
    console.error('Failed to export map config:', error)
    throw error
  }
}

/**
 * 创建一个空的地图配置模板
 * @returns MapConfig
 */
export function createEmptyMapConfig(): MapConfig {
  return {
    center: [35.0, 110.0],
    zoom: 5,
    points: [],
    routes: []
  }
}

/**
 * 合并多个地图配置
 * @param configs 配置数组
 * @returns 合并后的配置
 */
export function mergeMapConfigs(...configs: MapConfig[]): MapConfig {
  if (configs.length === 0) {
    return createEmptyMapConfig()
  }
  
  if (configs.length === 1) {
    return configs[0]
  }
  
  const mergedConfig = createEmptyMapConfig()
  
  // 使用第一个配置的中心点和缩放级别
  mergedConfig.center = configs[0].center
  mergedConfig.zoom = configs[0].zoom
  
  // 合并所有点位和路线
  const allPointIds = new Set()
  const allRouteIds = new Set()
  
  configs.forEach(config => {
    config.points.forEach(point => {
      if (!allPointIds.has(point.id)) {
        mergedConfig.points.push(point)
        allPointIds.add(point.id)
      }
    })
    
    config.routes.forEach(route => {
      if (!allRouteIds.has(route.id)) {
        mergedConfig.routes.push(route)
        allRouteIds.add(route.id)
      }
    })
  })
  
  return mergedConfig
}

/**
 * 根据边界框过滤地图配置
 * @param config 原始配置
 * @param bounds 边界框 [南纬, 西经, 北纬, 东经]
 * @returns 过滤后的配置
 */
export function filterMapConfigByBounds(
  config: MapConfig, 
  bounds: [number, number, number, number]
): MapConfig {
  const [southLat, westLng, northLat, eastLng] = bounds
  
  const filteredPoints = config.points.filter(point => {
    const [lat, lng] = point.position
    return lat >= southLat && lat <= northLat && lng >= westLng && lng <= eastLng
  })
  
  const filteredRoutes = config.routes.filter(route => {
    return route.waypoints.some(waypoint => {
      const [lat, lng] = waypoint.position
      return lat >= southLat && lat <= northLat && lng >= westLng && lng <= eastLng
    })
  })
  
  return {
    ...config,
    points: filteredPoints,
    routes: filteredRoutes
  }
} 