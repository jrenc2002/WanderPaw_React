# Mapbox 设置说明

## 获取 Mapbox Access Token

⚠️ **重要**: 只能使用 **Public Token** (以 `pk.` 开头)，绝不能使用 Secret Token (以 `sk.` 开头)

1. 访问 [Mapbox 官网](https://www.mapbox.com/)
2. 注册并登录账号
3. 前往 [Access Tokens 页面](https://account.mapbox.com/access-tokens/)
4. 复制你的 **Default public token** (以 `pk.` 开头)，或创建一个新的 Public Token

### Token 类型说明
- **Public Token** (`pk.*`) ✅ - 用于客户端应用，安全且必需
- **Secret Token** (`sk.*`) ❌ - 仅用于服务器端，绝不能在前端使用

## 配置 Token

### 方式 1: 直接修改代码 (开发环境)
在 `src/components/map/MapboxMap.tsx` 文件中，将以下行：

```typescript
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
```

替换为你的 token：

```typescript
mapboxgl.accessToken = 'your-mapbox-token-here'
```

### 方式 2: 环境变量 (推荐)
1. 在项目根目录创建 `.env` 文件
2. 添加以下内容：
```
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token-here
```

3. 在 `MapboxMap.tsx` 中使用：
```typescript
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'fallback-token'
```

## Mapbox vs 高德地图的优势

- ✅ **全球覆盖**: 支持全球详细地图数据
- ✅ **高质量**: 矢量地图，缩放清晰
- ✅ **自定义样式**: 丰富的地图样式选择
- ✅ **现代化**: WebGL 渲染，性能优秀
- ✅ **国际化**: 支持多语言标注
- ✅ **开发友好**: 完善的文档和社区支持

## 注意事项

- 免费账号每月有 50,000 次地图加载的限制
- 超出限制后会产生费用，请关注使用量
- 商业项目建议购买付费计划 