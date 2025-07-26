// 地理编码API使用示例
import { getLocationCoordinates, batchGetLocationCoordinates, testGeocoding } from './geocodingHelper'

/**
 * 示例：为你的活动数据获取坐标
 */
export async function demoGeocodingForActivities() {
  console.log('=== 地理编码示例：为活动获取坐标 ===\n')
  
  // 你的活动地点列表
  const locations = [
    '谷中银座商店街',
    '根津神社', 
    '上野公园草地',
    '上野·むぎとオリーブ拉面店',
    '东京国立博物馆',
    '上野公园喷泉旁',
    '浅草寺',
    '仲见世商店街',
    '隅田川河畔',
    '回民宿路上遇到橘猫'
  ]
  
  // 批量获取坐标
  const results = await batchGetLocationCoordinates(locations)
  
  // 显示结果
  console.log('\n📍 获取到的坐标信息：')
  results.forEach((result, index) => {
    const { name, coordinates, confidence, source } = result
    
    if (coordinates) {
      const [lng, lat] = coordinates
      console.log(`${index + 1}. ${name}`)
      console.log(`   坐标: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      console.log(`   置信度: ${(confidence * 100).toFixed(1)}%`)
      console.log(`   数据源: ${source}`)
      console.log(`   Google Maps: https://www.google.com/maps?q=${lat},${lng}`)
      console.log('')
    } else {
      console.log(`${index + 1}. ${name} - ❌ 未找到坐标`)
    }
  })
  
  return results
}

/**
 * 可用的免费地理编码API端点
 */
export const GEOCODING_APIS = {
  // 1. Nominatim (OpenStreetMap) - 完全免费
  nominatim: {
    name: 'Nominatim (OpenStreetMap)',
    url: 'https://nominatim.openstreetmap.org/search',
    free: true,
    dailyLimit: '无限制 (但有使用政策)',
    apiKeyRequired: false,
    description: '基于OpenStreetMap数据，完全免费，支持中文地名',
    example: (location: string) => 
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&accept-language=zh,en`,
    usage: `
// 使用示例：
const response = await fetch('https://nominatim.openstreetmap.org/search?q=谷中银座商店街&format=json&limit=1');
const data = await response.json();
if (data.length > 0) {
  const { lat, lon } = data[0];
  console.log('坐标:', lat, lon);
}`
  },
  
  // 2. Geoapify - 免费额度
  geoapify: {
    name: 'Geoapify',
    url: 'https://api.geoapify.com/v1/geocode/search',
    free: true,
    dailyLimit: '3,000 次/天',
    apiKeyRequired: true,
    description: '高质量地理编码服务，支持中文，有慷慨的免费额度',
    example: (location: string, apiKey: string) => 
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}&limit=1&lang=zh`,
    usage: `
// 需要注册获取API Key: https://www.geoapify.com/
const apiKey = 'your-api-key';
const response = await fetch(\`https://api.geoapify.com/v1/geocode/search?text=谷中银座商店街&apiKey=\${apiKey}\`);
const data = await response.json();
if (data.features.length > 0) {
  const [lng, lat] = data.features[0].geometry.coordinates;
  console.log('坐标:', lat, lng);
}`
  },
  
  // 3. LocationIQ - 免费额度
  locationiq: {
    name: 'LocationIQ',
    url: 'https://us1.locationiq.com/v1/search',
    free: true,
    dailyLimit: '5,000 次/天',
    apiKeyRequired: true,
    description: '基于Nominatim的商业服务，更稳定，有免费额度',
    example: (location: string, apiKey: string) => 
      `https://us1.locationiq.com/v1/search?q=${encodeURIComponent(location)}&key=${apiKey}&format=json&limit=1`,
    usage: `
// 需要注册获取API Key: https://locationiq.com/
const apiKey = 'your-api-key';
const response = await fetch(\`https://us1.locationiq.com/v1/search?q=谷中银座商店街&key=\${apiKey}&format=json\`);
const data = await response.json();
if (data.length > 0) {
  const { lat, lon } = data[0];
  console.log('坐标:', lat, lon);
}`
  },
  
  // 4. Mapbox (已在项目中使用)
  mapbox: {
    name: 'Mapbox',
    url: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    free: true,
    dailyLimit: '100,000 次/月',
    apiKeyRequired: true,
    description: '高质量地理编码，你的项目中已经在使用',
    example: (location: string, apiKey: string) => 
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${apiKey}&limit=1&language=zh`,
    usage: `
// 项目中已配置
const apiKey = 'your-mapbox-token';
const response = await fetch(\`https://api.mapbox.com/geocoding/v5/mapbox.places/谷中银座商店街.json?access_token=\${apiKey}\`);
const data = await response.json();
if (data.features.length > 0) {
  const [lng, lat] = data.features[0].center;
  console.log('坐标:', lat, lng);
}`
  }
}

/**
 * 显示所有可用API的信息
 */
export function showAvailableAPIs() {
  console.log('🌍 可用的地理编码API端点：\n')
  
  Object.values(GEOCODING_APIS).forEach((api, index) => {
    console.log(`${index + 1}. ${api.name}`)
    console.log(`   🔗 URL: ${api.url}`)
    console.log(`   💰 费用: ${api.free ? '免费' : '付费'}`)
    console.log(`   📊 限制: ${api.dailyLimit}`)
    console.log(`   🔑 API Key: ${api.apiKeyRequired ? '需要' : '不需要'}`)
    console.log(`   📝 说明: ${api.description}`)
    console.log('')
  })
  
  console.log('💡 推荐使用顺序：')
  console.log('1. Nominatim (完全免费，无需注册)')
  console.log('2. Geoapify (注册后每天3000次免费)')
  console.log('3. LocationIQ (注册后每天5000次免费)')
  console.log('4. Mapbox (项目中已有，每月10万次免费)')
}

/**
 * 测试单个地点的地理编码
 */
export async function testSingleLocation(locationName: string = '谷中银座商店街') {
  console.log(`🧪 测试地理编码: ${locationName}`)
  await testGeocoding(locationName)
}

// 在浏览器控制台中可用的函数
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.demoGeocodingForActivities = demoGeocodingForActivities
  // @ts-ignore  
  window.showAvailableAPIs = showAvailableAPIs
  // @ts-ignore
  window.testSingleLocation = testSingleLocation
  
  console.log('🎯 地理编码工具已加载！在控制台中可以使用：')
  console.log('- demoGeocodingForActivities() // 批量测试你的活动地点')
  console.log('- showAvailableAPIs() // 显示所有可用API')
  console.log('- testSingleLocation("地点名称") // 测试单个地点')
  console.log('- testGeocoding("地点名称") // 详细测试')
} 