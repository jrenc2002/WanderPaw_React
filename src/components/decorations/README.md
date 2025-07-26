# 装饰组件 (Decorations)

本目录包含了WanderPaw项目中用于视觉装饰的组件。

## MapBorderMask - 地图边界蒙版

为地图添加优雅的四周渐变蒙版效果，增强视觉美观性。

### 功能特性

- ✨ 四周渐变蒙版效果
- 🎨 支持多种视觉变体
- 📱 响应式设计，自动适配移动端
- 🎯 基于项目配色方案
- ⚡ 高性能，不影响地图交互

### 基本用法

```tsx
import { MapBorderMask } from '@/components/decorations'

// 基本使用
<div className="relative">
  <MapboxMap className="w-full h-full" />
  <MapBorderMask />
</div>
```

### 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'subtle' \| 'soft' \| 'strong'` | `'soft'` | 蒙版强度变体 |
| `maskWidth` | `string` | `'60px'` | 蒙版宽度 |
| `backgroundColor` | `string` | 根据variant自动选择 | 自定义背景颜色 |
| `opacity` | `number` | `1` | 透明度系数 |
| `zIndex` | `number` | `25` | 层级控制 |
| `responsive` | `boolean` | `true` | 是否启用响应式 |
| `className` | `string` | `''` | 额外CSS类名 |

### 变体效果

#### subtle - 微妙效果
适用于需要保持地图细节可见的场景
```tsx
<MapBorderMask variant="subtle" />
```

#### soft - 柔和效果（默认）
平衡美观性和功能性的推荐选择
```tsx
<MapBorderMask variant="soft" />
```

#### strong - 强烈效果
创造更明显的边界感，适合视觉重点强调
```tsx
<MapBorderMask variant="strong" />
```

### 使用场景示例

#### 全屏地图（如 HomeView）
```tsx
<WarmBg className="relative w-full h-screen overflow-hidden">
  <MapboxMap className="w-full h-full" />
  <MapBorderMask />
</WarmBg>
```

#### 嵌入式地图（如 MapTestView）
```tsx
<div className="h-[600px] bg-white rounded-lg shadow-lg overflow-hidden relative">
  <MapboxMap className="w-full h-full" />
  <MapBorderMask variant="soft" maskWidth="40px" />
</div>
```

#### 深色主题地图（如 SampleTestView）
```tsx
<div className="h-full bg-black/30 rounded-lg backdrop-blur-sm border border-gray-800 overflow-hidden relative">
  <MapboxMap className="w-full h-full" />
  <MapBorderMask variant="subtle" backgroundColor="#1F2937" />
</div>
```

#### 旅程视图（如 TripJourneyView）
```tsx
<div className="fixed inset-0 w-full h-full">
  <MapboxMap className="w-full h-full" />
  <MapBorderMask variant="subtle" maskWidth="80px" />
</div>
```

### 响应式行为

当 `responsive=true` 时（默认），蒙版宽度会自动适配：
- 桌面端：使用指定的 `maskWidth`
- 移动端：自动限制为 `min(maskWidth, 8vw)`

禁用响应式：
```tsx
<MapBorderMask responsive={false} maskWidth="100px" />
```

### 配色整合

组件自动使用项目的 WANDERPAW_COLORS 配色方案：
- `subtle`: 使用 `WANDERPAW_COLORS.pure` (#FEFDF9)
- `soft`: 使用 `WANDERPAW_COLORS.snow` (#FDF9EF)  
- `strong`: 使用 `WANDERPAW_COLORS.cream` (#F0F3EA)

自定义颜色：
```tsx
<MapBorderMask backgroundColor="#Custom Color" />
```

### 技术实现

- 使用绝对定位的四个方向线性渐变
- 四个角落使用径向渐变创建自然圆润效果
- 支持RGBA颜色处理以实现平滑过渡
- 指针事件穿透，不影响地图交互

## 其他装饰组件

### BottomGradientMask
底部渐变蒙版，用于页面底部的视觉过渡效果。

### GlassGradientMask ⭐ 毛玻璃渐变遮罩
现代化的毛玻璃渐变遮罩组件，提供局部的毛玻璃效果。

**特点：**
- 支持4个方向：顶部、底部、左侧、右侧
- 5种预设主题配色
- 可调节毛玻璃模糊强度  
- 多层次效果：主渐变 + 毛玻璃模糊 + 细节纹理
- 自动z-index管理

**Props：**
```tsx
interface GlassGradientMaskProps {
  className?: string
  height?: string                                              // 遮罩尺寸，默认calc(100vh / 13)
  position?: 'top' | 'bottom' | 'left' | 'right'             // 位置，默认bottom
  variant?: 'warm' | 'cool' | 'neutral' | 'sunset' | 'ocean' // 主题，默认warm
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'  // 模糊强度，默认lg
  opacity?: number                                            // 透明度，默认0.9
  zIndex?: number                                             // 层级，默认30
}
```

**使用示例：**
```tsx
import { GlassGradientMask } from '@/components/decorations/GlassGradientMask'

// 底部毛玻璃渐变遮罩（默认）
<GlassGradientMask />

// 顶部冷色调毛玻璃遮罩
<GlassGradientMask 
  position="top"
  variant="cool"
  height="80px"
  blurIntensity="xl"
/>

// 左侧日落主题遮罩
<GlassGradientMask 
  position="left"
  variant="sunset"
  height="120px"
  opacity={0.8}
  zIndex={40}
/>
```

**应用场景：**
- 替换传统的底部渐变遮罩，提供更现代的毛玻璃效果
- 在滚动容器边缘创建视觉边界
- 为内容区域提供层次感和深度
- 与其他UI元素融合，创建统一的设计语言

### EarthWithCapybara  
地球与水豚装饰动画，为页面添加趣味性元素。 