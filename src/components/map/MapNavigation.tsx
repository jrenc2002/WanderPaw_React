import { useAtom } from 'jotai'
import { ChevronRightIcon, HomeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import {
  mapNavigationAtom,
  regionsDataAtom,
  type MapLevel
} from '@/store/MapState'
import { mockRegionsData } from '@/data/mockData'

interface MapNavigationProps {
  onNavigate?: (regionId: string, level: MapLevel) => void
  className?: string
}

export const MapNavigation: React.FC<MapNavigationProps> = ({
  onNavigate,
  className = ""
}) => {
  const [navigation, setNavigation] = useAtom(mapNavigationAtom)
  const [, setRegionsData] = useAtom(regionsDataAtom)

  // 导航到指定地区
  const navigateToRegion = (regionId: string, level: MapLevel) => {
    const region = mockRegionsData[regionId]
    if (!region) return

    // 构建面包屑
    const newBreadcrumb = [...navigation.breadcrumb]
    
    // 如果是向下钻取
    if (level !== 'world') {
      // 检查是否已经在面包屑中
      const existingIndex = newBreadcrumb.findIndex(item => item.id === regionId)
      if (existingIndex >= 0) {
        // 如果存在，截取到该位置
        newBreadcrumb.splice(existingIndex + 1)
      } else {
        // 如果不存在，添加到面包屑
        newBreadcrumb.push({
          id: regionId,
          name: region.name,
          level: level
        })
      }
    } else {
      // 回到世界地图
      newBreadcrumb.splice(1)
    }

    setNavigation({
      currentLevel: level,
      currentRegion: regionId,
      breadcrumb: newBreadcrumb
    })

    // 更新地区数据
    setRegionsData(mockRegionsData)
    
    onNavigate?.(regionId, level)
  }

  // 面包屑点击处理
  const handleBreadcrumbClick = (item: any, index: number) => {
    if (index === navigation.breadcrumb.length - 1) return // 当前位置，不处理

    let targetLevel: MapLevel = 'world'
    if (item.level === 'world') targetLevel = 'world'
    else if (item.level === 'country') targetLevel = 'country'
    else if (item.level === 'province') targetLevel = 'province'

    navigateToRegion(item.id, targetLevel)
  }

  // 获取层级图标
  const getLevelIcon = (level: MapLevel) => {
    switch (level) {
      case 'world':
        return <GlobeAltIcon className="w-4 h-4" />
      case 'country':
        return <HomeIcon className="w-4 h-4" />
      default:
        return <div className="w-4 h-4 rounded bg-blue-500" />
    }
  }

  // 获取层级显示名称
  const getLevelName = (level: MapLevel) => {
    switch (level) {
      case 'world': return '世界'
      case 'country': return '国家'
      case 'province': return '省份'
      case 'city': return '城市'
      default: return '未知'
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      {/* 面包屑导航 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">当前位置</h3>
        <nav className="flex items-center space-x-1 text-sm">
          {navigation.breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(item, index)}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                  index === navigation.breadcrumb.length - 1
                    ? 'bg-blue-100 text-blue-700 cursor-default'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                disabled={index === navigation.breadcrumb.length - 1}
              >
                {getLevelIcon(item.level)}
                <span>{item.name}</span>
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* 快速导航 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">快速导航</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigateToRegion('world', 'world')}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              navigation.currentLevel === 'world'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            🌍 世界地图
          </button>
          
          {navigation.currentLevel !== 'world' && (
            <button
              onClick={() => navigateToRegion('CN', 'country')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                navigation.currentRegion === 'CN'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              🇨🇳 中国
            </button>
          )}
        </div>
      </div>

      {/* 当前层级信息 */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">当前层级:</span>
          <div className="flex items-center space-x-1 text-gray-700">
            {getLevelIcon(navigation.currentLevel)}
            <span className="font-medium">{getLevelName(navigation.currentLevel)}</span>
          </div>
        </div>
        
        {navigation.currentLevel !== 'world' && (
          <div className="mt-2 text-xs text-gray-500">
            💡 点击地图上的区域可以进入下一级
          </div>
        )}
      </div>
    </div>
  )
} 