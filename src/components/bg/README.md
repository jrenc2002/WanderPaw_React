# 背景组件 (Background Components)

这个目录包含了WanderPaw应用中使用的各种背景组件。

## 可用组件

### 1. WarmBg
温暖的背景组件，提供带装饰元素的背景。

**特点：**
- 温暖的米色背景 (#FFF6E4)
- 左上角和右上角的叶子装饰
- 支持自定义className
- 可选择是否显示装饰元素

**使用示例：**
```tsx
import { WarmBg } from '@/components/bg/WarmBg'

<WarmBg showDecorations={true}>
  <div>你的内容</div>
</WarmBg>
```

### 2. GirdBg
网格背景组件，提供网格图案的背景。

### 3. GlassBg ⭐ 毛玻璃渐变背景
现代化的毛玻璃渐变背景组件，提供多种风格的毛玻璃效果。

**特点：**
- 5种预设主题：warm（暖色调）、cool（冷色调）、neutral（中性）、sunset（日落）、ocean（海洋）
- 可调节毛玻璃模糊强度（sm到3xl）
- 支持4种渐变方向：垂直、水平、对角线、径向
- 多层次渐变效果：主渐变 + 毛玻璃层 + 细节纹理层
- 可选装饰元素（叶子装饰）
- 完全响应式设计

**Props：**
```tsx
interface GlassBgProps {
  children?: React.ReactNode
  className?: string
  variant?: 'warm' | 'cool' | 'neutral' | 'sunset' | 'ocean'  // 主题风格，默认warm
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'   // 模糊强度，默认lg  
  opacity?: number                                             // 透明度，默认0.8
  showDecorations?: boolean                                    // 是否显示装饰，默认true
  gradientDirection?: 'vertical' | 'horizontal' | 'diagonal' | 'radial' // 渐变方向，默认diagonal
}
```

**使用示例：**
```tsx
import { GlassBg } from '@/components/bg/GlassBg'

// 基础暖色调毛玻璃背景
<GlassBg>
  <div>你的内容</div>
</GlassBg>

// 自定义冷色调，高模糊度
<GlassBg 
  variant="cool" 
  blurIntensity="xl"
  gradientDirection="radial"
  opacity={0.9}
>
  <div>你的内容</div>
</GlassBg>

// 日落主题，垂直渐变
<GlassBg 
  variant="sunset"
  gradientDirection="vertical"
  showDecorations={false}
>
  <div>你的内容</div>
</GlassBg>
```

### 4. PetOnEarth
宠物站在地球上的主题背景组件，非常适合WanderPaw的主题。

**特点：**
- 地球放置在屏幕底部，只露出上半部分
- 宠物站在地球表面，左右居中
- 支持多种宠物类型（水豚、猫、狗）
- 可调节宠物和地球的大小
- 丰富的动画效果（地球旋转、宠物浮动、星星闪烁）
- 响应式设计，支持移动端
- 星空装饰和云朵点缀

**Props：**
```tsx
interface PetOnEarthProps {
  petType?: 'capybara' | 'cat' | 'dog'     // 宠物类型，默认水豚
  petSize?: 'small' | 'medium' | 'large'   // 宠物大小，默认中等
  earthSize?: 'small' | 'medium' | 'large' // 地球大小，默认大
  className?: string                        // 自定义样式类
  children?: React.ReactNode               // 子组件内容
  showAnimation?: boolean                  // 是否显示动画，默认true
  showStars?: boolean                     // 是否显示星星装饰，默认true
}
```

**使用示例：**
```tsx
import { PetOnEarth } from '@/components/bg/PetOnEarth'

// 基础用法
<PetOnEarth petType="capybara">
  <div>你的页面内容</div>
</PetOnEarth>

// 自定义配置
<PetOnEarth 
  petType="capybara"
  petSize="large"
  earthSize="medium"
  showAnimation={true}
  showStars={true}
  className="bg-gradient-to-b from-purple-900 to-blue-900"
>
  <div>你的页面内容</div>
</PetOnEarth>
```

**动画效果：**
- 🌍 地球缓慢旋转（60秒一圈）
- 🦫 宠物轻柔浮动
- ⭐ 星星闪烁效果
- 📱 响应式缩放

**文件结构：**
- `PetOnEarth.tsx` - 主组件文件
- `PetOnEarth.css` - 样式和动画定义

**样式类：**
- `.pet-on-earth-container` - 主容器
- `.earth-container` - 地球容器（带旋转动画）
- `.pet-container` - 宠物容器（带浮动动画）
- `.star` - 星星装饰（带闪烁动画）
- `.earth-glow` - 地球光效
- `.pet-shadow` - 宠物阴影

## 图片资源

组件依赖以下装饰图片，位于 `public/decorations/` 目录：

- `earth.jpeg` - 地球图片
- `capybara.jpeg` - 水豚图片
- `cat.jpeg` - 猫咪图片（可选）
- `dog.jpeg` - 狗狗图片（可选）
- `leaves-dark.jpeg` - 深色叶子装饰
- `leaves-light.jpeg` - 浅色叶子装饰

## 响应式设计

所有背景组件都支持响应式设计：
- 在平板设备上自动缩放80%
- 在手机设备上自动缩放60-80%
- 保持宽高比和视觉平衡

## 最佳实践

1. **性能考虑：** 如果页面需要高性能，可以通过 `showAnimation={false}` 关闭动画
2. **移动端优化：** 在移动端考虑使用较小的地球和宠物尺寸
3. **主题一致性：** 选择与应用整体色调搭配的背景渐变
4. **可访问性：** 所有装饰元素都使用 `pointer-events-none` 确保不干扰交互

## 示例页面

查看 `src/view/PetOnEarthView.tsx` 获取完整的使用示例和交互控制面板。 