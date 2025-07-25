# 背景组件使用说明

## WarmBg 组件

一个可复用的温暖色调背景组件，背景色为 `#FFF6E4`，带有可选的装饰性植物元素。

### 特性

- 统一的温暖背景色 (#FFF6E4)
- 可选的装饰性SVG元素
- 响应式设计
- 支持自定义 className
- TypeScript 支持

### 使用方法

```tsx
import { WarmBg } from '@/components/bg/WarmBg'

// 基本使用
<WarmBg>
  <div>您的内容</div>
</WarmBg>

// 自定义样式
<WarmBg className="custom-class">
  <div>您的内容</div>
</WarmBg>

// 禁用装饰元素
<WarmBg showDecorations={false}>
  <div>只要纯背景色的内容</div>
</WarmBg>
```

### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| children | React.ReactNode | - | 子组件内容 |
| className | string | '' | 自定义CSS类名 |
| showDecorations | boolean | true | 是否显示装饰性元素 |

### 装饰元素

组件包含两个叶子装饰图片：
- 左上角：黑色背景叶子装饰 (`leaves-dark.jpeg`，透明度20%)
- 右上角：白色背景叶子装饰 (`leaves-light.jpeg`，透明度30%)

装饰图片位于 `/public/decorations/` 目录中，以 `object-contain` 模式显示，保持原始宽高比。 