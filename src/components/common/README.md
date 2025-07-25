# DashedCard 虚线卡片组件

一个可复用的虚线卡片组件，具有优雅的设计和灵活的使用方式。

## 特性

- 🎨 **美观设计**: 圆角卡片 + 内层虚线描边
- 📏 **灵活尺寸**: 支持自定义宽高或内容自适应
- 🔧 **高度可定制**: 支持自定义样式和类名
- ♻️ **完全复用**: 可在项目中任意位置使用

## 样式规格

### 外层卡片
- 圆角: `38px`
- 背景色: `#FDF8F3`
- 阴影: `0 2px 34.9px 3px rgba(123, 66, 15, 0.11)`
- 内边距: `32px`

### 内层虚线
- 圆角: `21px`
- 边框: `4px dashed #D1BA9E`
- 自动居中布局

## 使用示例

### 基础用法

```tsx
import { DashedCard } from '@/components/common';

// 固定尺寸
<DashedCard width="300px" height="200px">
  <div>您的内容</div>
</DashedCard>

// 内容自适应高度
<DashedCard width="400px">
  <div>
    <h3>标题</h3>
    <p>内容会自动撑开高度</p>
  </div>
</DashedCard>
```

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `children` | `React.ReactNode` | 卡片内容（必需） |
| `width` | `string \| number` | 卡片宽度 |
| `height` | `string \| number` | 卡片高度 |
| `className` | `string` | 自定义CSS类名 |
| `style` | `React.CSSProperties` | 自定义内联样式 | 