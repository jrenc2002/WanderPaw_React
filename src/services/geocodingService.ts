// 地理编码服务
import { CHINA_PROVINCES } from '@/data/geoData'

export interface GeocodingResult {
  address: string
  coordinates: [number, number] // [lng, lat]
  confidence: number // 0-1 的置信度
  source: 'static' | 'api' | 'fallback'
}

export interface GeocodingOptions {
  timeout?: number
  fallbackCoordinates?: [number, number]
  useStaticData?: boolean
}

/**
 * 地理编码服务类
 */
export class GeocodingService {
  private static readonly MAPBOX_TOKEN = 'pk.eyJ1IjoieHVuaXh3d2kiLCJhIjoiY21kOW92ODUyMGE1aDJscTNuaW55eWNocyJ9.sqfV_Ukyc6u9jgWeq3vukQ'
  private static readonly STATIC_LOCATIONS: Record<string, [number, number]> = {
    // 日本主要地点
    '中目黑河畔': [139.6969, 35.6439],
    '代官山蔦屋书店': [139.6956, 35.6503],
    '下北泽街头小巷': [139.6681, 35.6611],
    '原宿猫咪咖啡馆MoCHA': [139.7027, 35.6695],
    '原宿街头': [139.7027, 35.6695],
    '代代木公园草地': [139.6958, 35.6719],
    '涩谷站前': [139.7016, 35.6580],
    '涩谷猫街': [139.7016, 35.6580],
    '池袋Sunshine City屋顶花园': [139.7179, 35.7295],
    '池袋站便利店门口': [139.7108, 35.7297],
    
    // 中国主要城市
    '北京': [116.4074, 39.9042],
    '上海': [121.4737, 31.2304],
    '杭州': [120.1551, 30.2741],
    '深圳': [114.0579, 22.5431],
    '广州': [113.2644, 23.1291],
    '成都': [104.0668, 30.5728],
    '西安': [108.9398, 34.3412],
    '南京': [118.7969, 32.0603],
    '武汉': [114.3162, 30.5810],
    '重庆': [106.5104, 29.5647],
    '天津': [117.2008, 39.0842],
    '苏州': [120.5954, 31.2989],
    '青岛': [120.3826, 36.0668],
    '大连': [121.6147, 38.9140],
    '厦门': [118.1689, 24.4797],
    '宁波': [121.5440, 29.8683],
    
    // 国际城市
    '东京': [139.6503, 35.6762],
    '大阪': [135.5023, 34.6937],
    '京都': [135.7681, 35.0116],
    '名古屋': [136.9066, 35.1815],
    '福冈': [130.4017, 33.5904],
    '纽约': [-74.0060, 40.7128],
    '洛杉矶': [-118.2437, 34.0522],
    '旧金山': [-122.4194, 37.7749],
    '伦敦': [-0.1276, 51.5074],
    '巴黎': [2.3522, 48.8566],
    '柏林': [13.4050, 52.5200],
    '罗马': [12.4964, 41.9028],
    '悉尼': [151.2093, -33.8688],
    '墨尔本': [144.9631, -37.8136],
    '首尔': [126.9780, 37.5665],
    '新加坡': [103.8198, 1.3521],
    '曼谷': [100.5018, 13.7563],
    '吉隆坡': [101.6869, 3.1390]
  }

  /**
   * 获取地址的坐标
   * @param address 地址字符串
   * @param options 选项
   * @returns 地理编码结果
   */
  static async geocodeAddress(
    address: string, 
    options: GeocodingOptions = {}
  ): Promise<GeocodingResult> {
    const {
      timeout = 5000,
      fallbackCoordinates = [116.4074, 39.9042], // 默认北京
      useStaticData = true
    } = options

    try {
      // 清理地址文本
      const cleanAddress = this.cleanAddress(address)
      
      // 首先尝试静态数据匹配
      if (useStaticData) {
        const staticResult = this.searchStaticData(cleanAddress)
        if (staticResult) {
          return staticResult
        }
      }

      // 使用Mapbox Geocoding API
      const apiResult = await this.geocodeWithMapbox(cleanAddress, timeout)
      if (apiResult) {
        return apiResult
      }

      // 降级到静态数据模糊匹配
      const fuzzyResult = this.fuzzySearchStaticData(cleanAddress)
      if (fuzzyResult) {
        return fuzzyResult
      }

      // 最后使用回退坐标
      return {
        address: cleanAddress,
        coordinates: fallbackCoordinates,
        confidence: 0.1,
        source: 'fallback'
      }

    } catch (error) {
      console.error('地理编码失败:', error)
      return {
        address: address,
        coordinates: fallbackCoordinates,
        confidence: 0.1,
        source: 'fallback'
      }
    }
  }

  /**
   * 批量地理编码
   * @param addresses 地址列表
   * @param options 选项
   * @returns 地理编码结果列表
   */
  static async batchGeocode(
    addresses: string[],
    options: GeocodingOptions = {}
  ): Promise<GeocodingResult[]> {
    const results: GeocodingResult[] = []
    
    // 使用并发请求，但限制并发数量
    const concurrency = 3
    for (let i = 0; i < addresses.length; i += concurrency) {
      const batch = addresses.slice(i, i + concurrency)
      const batchResults = await Promise.all(
        batch.map(address => this.geocodeAddress(address, options))
      )
      results.push(...batchResults)
      
      // 避免API限频，添加短暂延迟
      if (i + concurrency < addresses.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    
    return results
  }

  /**
   * 清理地址文本
   */
  private static cleanAddress(address: string): string {
    return address
      .replace(/^.*?·/, '') // 去除前缀如"日本·"
      .replace(/[^\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\s-]/g, '') // 保留中文、日文、英文、数字、空格、连字符
      .trim()
  }

  /**
   * 搜索静态数据
   */
  private static searchStaticData(address: string): GeocodingResult | null {
    // 精确匹配
    if (this.STATIC_LOCATIONS[address]) {
      return {
        address,
        coordinates: this.STATIC_LOCATIONS[address],
        confidence: 1.0,
        source: 'static'
      }
    }

    // 搜索省份数据
    for (const provinceData of Object.values(CHINA_PROVINCES)) {
      if (provinceData.name === address || provinceData.nameEn === address) {
        return {
          address,
          coordinates: provinceData.coordinates,
          confidence: 0.9,
          source: 'static'
        }
      }
    }

    return null
  }

  /**
   * 模糊搜索静态数据
   */
  private static fuzzySearchStaticData(address: string): GeocodingResult | null {
    const addressLower = address.toLowerCase()
    
    // 模糊匹配静态位置
    for (const [location, coords] of Object.entries(this.STATIC_LOCATIONS)) {
      if (location.includes(address) || address.includes(location)) {
        return {
          address,
          coordinates: coords,
          confidence: 0.7,
          source: 'static'
        }
      }
    }

    // 模糊匹配省份
    for (const provinceData of Object.values(CHINA_PROVINCES)) {
      if (provinceData.name.includes(address) || 
          provinceData.nameEn.toLowerCase().includes(addressLower)) {
        return {
          address,
          coordinates: provinceData.coordinates,
          confidence: 0.6,
          source: 'static'
        }
      }
    }

    return null
  }

  /**
   * 使用Mapbox API进行地理编码
   */
  private static async geocodeWithMapbox(
    address: string, 
    timeout: number
  ): Promise<GeocodingResult | null> {
    try {
      const encodedAddress = encodeURIComponent(address)
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.MAPBOX_TOKEN}&limit=1&language=zh`
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`Mapbox API错误: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0]
        const [lng, lat] = feature.center
        
        return {
          address,
          coordinates: [lng, lat],
          confidence: feature.relevance || 0.8,
          source: 'api'
        }
      }
      
      return null
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Mapbox地理编码超时:', address)
      } else {
        console.warn('Mapbox地理编码失败:', error)
      }
      return null
    }
  }

  /**
   * 验证坐标是否合理
   */
  static isValidCoordinates(coordinates: [number, number]): boolean {
    const [lng, lat] = coordinates
    return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
  }

  /**
   * 计算两点之间的距离（公里）
   */
  static calculateDistance(
    coord1: [number, number], 
    coord2: [number, number]
  ): number {
    const [lng1, lat1] = coord1
    const [lng2, lat2] = coord2
    
    const R = 6371 // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }
} 