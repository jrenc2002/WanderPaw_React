// WanderPaw 主题 Mapbox 地图样式配置
export const wanderpawMapStyle = {
  version: 8,
  name: 'WanderPaw Theme',
  metadata: {
    'mapbox:autocomposite': false,
    'mapbox:type': 'template',
    'mapbox:groups': {}
  },
  sources: {
    'mapbox-streets': {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v8'
    },
    'mapbox-terrain': {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-terrain-v2'
    }
  },
  sprite: 'mapbox://sprites/mapbox/streets-v12',
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  layers: [
    // 背景层 - 使用 WanderPaw 的奶白色
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#FEFDF9'
      }
    },
    // 陆地区域 - 使用 WanderPaw 的米白色
    {
      id: 'landuse',
      type: 'fill',
      source: 'mapbox-streets',
      'source-layer': 'landuse',
      paint: {
        'fill-color': '#F0F3EA',
        'fill-opacity': 0.8
      }
    },
    // 水体 - 使用 WanderPaw 的浅绿色调
    {
      id: 'water',
      type: 'fill',
      source: 'mapbox-streets',
      'source-layer': 'water',
      paint: {
        'fill-color': '#B1C192',
        'fill-opacity': 0.6
      }
    },
    // 建筑物 - 使用 WanderPaw 的浅米色
    {
      id: 'building',
      type: 'fill',
      source: 'mapbox-streets',
      'source-layer': 'building',
      paint: {
        'fill-color': '#EADDC7',
        'fill-opacity': 0.7,
        'fill-outline-color': '#E5E2DC'
      }
    },
    // 道路 - 主要道路使用金黄色
    {
      id: 'road-primary',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'primary', 'trunk'],
      paint: {
        'line-color': '#E5D4A8',
        'line-width': {
          base: 1.2,
          stops: [[6, 1], [14, 6], [20, 20]]
        },
        'line-opacity': 0.4
      }
    },
    // 道路 - 次要道路使用浅棕色
    {
      id: 'road-secondary',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'secondary', 'tertiary'],
      paint: {
        'line-color': '#D5C6B0',
        'line-width': {
          base: 1.2,
          stops: [[6, 0.5], [14, 4], [20, 15]]
        },
        'line-opacity': 0.3
      }
    },
    // 道路 - 小路使用浅灰米色
    {
      id: 'road-minor',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'street', 'street_limited'],
      paint: {
        'line-color': '#F0EDEA',
        'line-width': {
          base: 1.2,
          stops: [[6, 0.5], [14, 2], [20, 8]]
        },
        'line-opacity': 0.25
      }
    },
    // 道路边框
    {
      id: 'road-primary-case',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'primary', 'trunk'],
      paint: {
        'line-color': '#B5A088',
        'line-width': {
          base: 1.2,
          stops: [[6, 1.5], [14, 8], [20, 24]]
        },
        'line-opacity': 0.15
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      }
    },
    // 边界线 - 使用森林绿
    {
      id: 'admin-boundaries',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'admin',
      paint: {
        'line-color': '#687949',
        'line-width': {
          base: 1,
          stops: [[4, 1], [8, 2], [12, 3]]
        },
        'line-opacity': 0.5,
        'line-dasharray': [2, 2]
      }
    },
    // 地名标签 - 城市 
    {
      id: 'place-city',
      type: 'symbol',
      source: 'mapbox-streets',
      'source-layer': 'place',
      filter: ['==', 'type', 'city'],
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
        'text-size': {
          base: 1.2,
          stops: [[6, 14], [14, 18], [20, 24]]
        },
        'text-anchor': 'center',
        'text-offset': [0, 0.5],
        'text-allow-overlap': false
      },
      paint: {
        'text-color': '#687949',
        'text-halo-color': '#FEFDF9',
        'text-halo-width': 2
      }
    },
    // 地名标签 - 区域
    {
      id: 'place-town',
      type: 'symbol',
      source: 'mapbox-streets',
      'source-layer': 'place',
      filter: ['in', 'type', 'town', 'village'],
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Pro Regular', 'Arial Unicode MS Regular'],
        'text-size': {
          base: 1.2,
          stops: [[6, 12], [14, 14], [20, 18]]
        },
        'text-anchor': 'center',
        'text-offset': [0, 0.5]
      },
      paint: {
        'text-color': '#8F6C53',
        'text-halo-color': '#FEFDF9',
        'text-halo-width': 1.5
      }
    },
    // 道路标签
    {
      id: 'road-label',
      type: 'symbol',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['has', 'name'],
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Pro Regular', 'Arial Unicode MS Regular'],
        'text-size': {
          base: 1,
          stops: [[9, 10], [16, 12], [20, 14]]
        },
        'symbol-placement': 'line',
        'text-rotation-alignment': 'map',
        'text-pitch-alignment': 'viewport'
      },
      paint: {
        'text-color': '#687949',
        'text-halo-color': '#FEFDF9',
        'text-halo-width': 1
      }
    }
  ]
}

// 简化版本的样式配置（用于轻量级应用）
export const wanderpawMapStyleSimple = {
  ...wanderpawMapStyle,
  layers: wanderpawMapStyle.layers.filter(layer => 
    ['background', 'water', 'landuse', 'road-primary', 'road-secondary', 'place-city'].includes(layer.id)
  )
}

// 颜色常量，与 tailwind.config.js 中的 WanderPaw 主题保持一致
export const WANDERPAW_COLORS = {
  forest: '#687949',    // 主绿色
  sage: '#B1C192',      // 浅绿色
  cream: '#F0F3EA',     // 米白色
  gold: '#C7AA6C',      // 金黄色
  earth: '#8F6C53',     // 棕色
  sand: '#BBA084',      // 浅棕色
  linen: '#EADDC7',     // 米色
  pearl: '#F9F2E2',     // 浅米色
  ivory: '#FDF5E8',     // 极浅米色
  snow: '#FDF9EF',      // 奶白色
  pure: '#FEFDF9',      // 纯白色
  mist: '#E5E2DC',      // 浅灰米色
} as const

// 地图主题配置函数
export const getWanderpawMapConfig = (theme: 'default' | 'simple' = 'default') => {
  return {
    style: theme === 'simple' ? wanderpawMapStyleSimple : wanderpawMapStyle,
    colors: WANDERPAW_COLORS,
    className: 'wanderpaw-map'
  }
} 