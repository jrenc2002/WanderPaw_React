import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/GlobalMapState'

// 修复默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface InteractivePoint {
  id: string
  position: [number, number] // [lat, lng]
  title: string
  description: string
  tangpingIndex: number
  data?: any // 额外数据
}

interface LeafletMapProps {
  onRegionClick?: (regionId: string, data?: any) => void
  onRegionHover?: (regionId: string | null, data?: any) => void
  className?: string
  center?: [number, number]
  zoom?: number
  points?: InteractivePoint[]
  mapStyle?: 'standard' | 'satellite' | 'terrain' | 'light' // 增加地图样式选项
}

// 自定义交互式标记组件
const InteractiveMarker: React.FC<{
  point: InteractivePoint
  onMarkerClick?: (id: string, data?: any) => void
  onMarkerHover?: (id: string, data?: any) => void
  onMarkerLeave?: () => void
}> = ({ point, onMarkerClick, onMarkerHover, onMarkerLeave }) => {
  const [language] = useAtom(selectedLanguageAtom)
  
  // 创建自定义图标
  const createCustomIcon = (index: number) => {
    // 增强颜色对比度和清晰度
    const color = index >= 80 ? '#10b981' : index >= 60 ? '#f59e0b' : index >= 40 ? '#f97316' : '#ef4444'
    
    // 根据设备像素比调整大小
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const baseSize = index >= 70 ? 46 : index >= 50 ? 42 : index >= 30 ? 38 : 34;
    // 对高DPI屏幕稍微扩大图标尺寸以保持视觉一致性
    const size = devicePixelRatio > 1 ? Math.floor(baseSize * 1.25) : baseSize;
    
    // 进一步优化文字大小，特别是为了中文显示
    const fontSize = devicePixelRatio > 1 ? '16px' : '14px';
    const fontWeight = 700;
    
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 cursor-pointer" 
               style="background-color: ${color}; width: ${size}px; height: ${size}px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <div class="flex flex-col items-center justify-center">
              <span class="leaflet-custom-marker-text" style="font-size: ${fontSize}; font-weight: ${fontWeight}; line-height: 1.2; letter-spacing: 0.02em;">${Math.round(index)}</span>
            </div>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0" 
               style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${color};"></div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [size, size + 8],
      iconAnchor: [size/2, size + 8],
      popupAnchor: [0, -size]
    })
  }

  const customIcon = createCustomIcon(point.tangpingIndex)

  return (
    <Marker
      position={point.position}
      icon={customIcon}
      eventHandlers={{
        click: () => onMarkerClick?.(point.id, point.data),
        mouseover: () => onMarkerHover?.(point.id, point.data),
        mouseout: () => onMarkerLeave?.()
      }}
    >
      <Popup className="custom-popup">
        <div className="p-3 max-w-xs">
          <h3 className="font-bold text-lg mb-2 text-gray-800 zh-text">{point.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-sm zh-text">
                {language === 'zh' ? '躺平指数' : 'Lying Flat Index'}: 
                <span className="font-semibold ml-1">{point.tangpingIndex}</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 zh-text">{point.description}</p>
            {point.data && (
              <div className="text-xs text-gray-500 space-y-1 zh-text">
                {point.data.averageSalary && (
                  <div className="zh-text">💰 {language === 'zh' ? '平均工资' : 'Average Salary'}: {point.data.averageSalary.toLocaleString()} {point.data.currency}</div>
                )}
                {point.data.rentPrice && (
                  <div className="zh-text">🏡 {language === 'zh' ? '房租' : 'Rent'}: {point.data.rentPrice.toLocaleString()} {point.data.currency}</div>
                )}
                {point.data.workLifeBalance && (
                  <div className="zh-text">⚖️ {language === 'zh' ? '工作生活平衡' : 'Work-Life Balance'}: {point.data.workLifeBalance}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// 地图控制组件
const MapController: React.FC<{
  center: [number, number]
  zoom: number
}> = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

// 地图样式选择器 - 升级到更高质量的地图源
const getMapTileLayer = (style: 'standard' | 'satellite' | 'terrain' | 'light') => {
  switch (style) {
    case 'satellite':
      return (
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          tileSize={256}
          zoomOffset={0}
        />
      )
    case 'terrain':
      // 使用Stadia高质量瓦片 (原Stamen)
      return (
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          tileSize={256}
          zoomOffset={0}
        />
      )
    case 'light':
      // 使用JAWG高清瓦片 - 免费且对中文支持良好
      return (
        <TileLayer
          attribution='© <a href="https://www.jawg.io" target="_blank">Jawg</a> - © <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
          url="https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png"
          tileSize={256}
          zoomOffset={0}
          detectRetina={true}
        />
      )
    default:
      // 使用高清的OSM瓦片
      return (
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
          tileSize={256}
          detectRetina={true}
        />
      )
  }
}

// 更优化的中文标签渲染组件
const ChineseLabelsLayer: React.FC<{ points: InteractivePoint[] }> = ({ points }) => {
  const map = useMap();
  
  // 使用自定义标记代替SVG渲染
  useEffect(() => {
    // 创建标记数组
    const markers: L.Marker[] = [];
    
    // 为每个点位创建高清文本标签
    points.forEach(point => {
      // 创建自定义图标
      const customLabelIcon = L.divIcon({
        className: 'chinese-map-label-container',
        html: `<div class="chinese-map-label">${point.title}</div>`,
        iconSize: [120, 40],
        iconAnchor: [0, 0]
      });
      
      // 创建标记并添加到地图
      const marker = L.marker([point.position[0], point.position[1]], {
        icon: customLabelIcon,
        interactive: false, // 不响应鼠标事件
        zIndexOffset: -1000 // 置于其他标记下方
      }).addTo(map);
      
      markers.push(marker);
    });
    
    // 清理函数
    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, points]);
  
  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  onRegionClick,
  onRegionHover,
  className = "w-full h-full",
  center = [39.9042, 116.4074], // 默认北京
  zoom = 5,
  points = [],
  mapStyle = 'standard' // 默认使用亮色地图
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [language] = useAtom(selectedLanguageAtom)

  const handleMarkerClick = (id: string, data?: any) => {
    onRegionClick?.(id, data)
  }

  const handleMarkerHover = (id: string, data?: any) => {
    setHoveredPoint(id)
    onRegionHover?.(id, data)
  }

  const handleMarkerLeave = () => {
    setHoveredPoint(null)
    onRegionHover?.(null)
  }

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // 禁用默认缩放控件
        scrollWheelZoom={true}
        className="rounded-lg overflow-hidden shadow-xl"
        minZoom={2}
        maxZoom={18}
        worldCopyJump={true} // 允许在地图边缘无缝移动
        preferCanvas={true} // 使用Canvas渲染提高性能
      >
        {getMapTileLayer(mapStyle)}
        
        <ZoomControl position="bottomright" /> {/* 重新定位缩放控件 */}
        
        <MapController center={center} zoom={zoom} />
        
        {/* 添加自定义SVG中文标签层 */}
        <ChineseLabelsLayer points={points} />
        
        {points.map((point) => (
          <InteractiveMarker
            key={point.id}
            point={point}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
            onMarkerLeave={handleMarkerLeave}
          />
        ))}
      </MapContainer>
      
      {/* 悬浮信息显示 */}
      {hoveredPoint && (
        <div className="absolute top-4 left-4 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <div className="text-sm font-medium text-gray-800">
            {language === 'zh' ? '悬浮中' : 'Hovering'}: {hoveredPoint}
          </div>
        </div>
      )}
    </div>
  )
} 