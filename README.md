# WanderPaw 🐾

一个智能的旅行规划和地图探索应用，帮助用户发现全球最佳的"躺平"城市和旅行目的地。

## 🌟 特性

- 🗺️ **全球地图支持**: 使用 Mapbox GL JS，支持全球详细地图数据
- 🏙️ **城市评分系统**: 基于躺平指数的智能城市推荐
- 🎯 **交互式地图**: 丰富的标记点、路线规划和信息窗体
- 🌍 **多语言支持**: 支持中文、英文等多种语言
- 📱 **响应式设计**: 适配桌面端和移动端设备
- ✨ **动画效果**: 流畅的 GSAP 动画和交互体验

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖
```bash
pnpm install
```

### 配置 Mapbox Token
1. 访问 [Mapbox 官网](https://www.mapbox.com/) 注册账号
2. 获取 Access Token
3. 参考 [MAPBOX_SETUP.md](./MAPBOX_SETUP.md) 进行配置

### 启动开发服务器
```bash
pnpm dev
```

## 📦 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Jotai
- **地图服务**: Mapbox GL JS (替代高德地图)
- **UI组件**: Tailwind CSS + DaisyUI
- **动画库**: GSAP + Framer Motion
- **路由**: React Router DOM
- **构建工具**: Vite

## 🗺️ 地图功能

### Mapbox 优势
- ✅ **全球覆盖**: 支持全球详细地图数据，包括国外地图
- ✅ **高质量**: 矢量地图，缩放清晰
- ✅ **自定义样式**: 丰富的地图样式选择
- ✅ **现代化**: WebGL 渲染，性能优秀
- ✅ **国际化**: 支持多语言标注

### 功能特色
- 🏠 城市躺平指数可视化
- 💰 生活成本数据展示
- 🛣️ 智能路线规划
- 📍 个性化标记点
- 🖼️ 动态信息窗体

## 📁 项目结构

```
src/
├── components/          # 组件库
│   ├── map/            # 地图相关组件
│   │   └── MapboxMap.tsx  # Mapbox 地图组件
│   ├── auth/           # 认证组件
│   ├── pet/            # 宠物相关组件
│   └── ...
├── view/               # 页面视图
├── store/              # 状态管理
├── data/               # 数据文件
└── services/           # 服务层
```

## 🔧 开发说明

### 地图组件使用
```tsx
import { MapboxMap } from '@/components/map/MapboxMap'

<MapboxMap
  center={[39.9042, 116.4074]}
  zoom={5}
  points={mapPoints}
  routes={mapRoutes}
  onRegionClick={handleClick}
/>
```

### 部署配置
1. 配置 Mapbox Access Token
2. 构建生产版本：`pnpm build`
3. 部署到服务器或 CDN

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 许可证

[MIT License](LICENSE)
