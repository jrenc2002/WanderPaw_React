import React, { useState } from 'react'
import { GlassBg } from '@/components/bg/GlassBg'
import { GlassGradientMask } from '@/components/decorations/GlassGradientMask'

export const GlassTestView: React.FC = () => {
  const [bgVariant, setBgVariant] = useState<'warm' | 'cool' | 'neutral' | 'sunset' | 'ocean'>('warm')
  const [blurIntensity, setBlurIntensity] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'>('lg')
  const [gradientDirection, setGradientDirection] = useState<'vertical' | 'horizontal' | 'diagonal' | 'radial'>('diagonal')
  const [showMask, setShowMask] = useState(true)
  const [maskPosition, setMaskPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom')

  return (
    <GlassBg 
      variant={bgVariant}
      blurIntensity={blurIntensity}
      gradientDirection={gradientDirection}
      opacity={0.9}
    >
      {/* 控制面板 */}
      <div className="fixed top-4 left-4 bg-white/20 backdrop-blur-md rounded-xl p-4 z-50 max-w-xs">
        <h3 className="text-white font-bold mb-3">毛玻璃渐变控制</h3>
        
        {/* 背景主题选择 */}
        <div className="mb-3">
          <label className="text-white text-sm block mb-1">背景主题:</label>
          <select 
            value={bgVariant} 
            onChange={(e) => setBgVariant(e.target.value as any)}
            className="w-full p-1 rounded bg-white/30 text-white text-sm"
            aria-label="选择背景主题"
          >
            <option value="warm">暖色调</option>
            <option value="cool">冷色调</option>
            <option value="neutral">中性</option>
            <option value="sunset">日落</option>
            <option value="ocean">海洋</option>
          </select>
        </div>

        {/* 模糊强度选择 */}
        <div className="mb-3">
          <label className="text-white text-sm block mb-1">模糊强度:</label>
          <select 
            value={blurIntensity} 
            onChange={(e) => setBlurIntensity(e.target.value as any)}
            className="w-full p-1 rounded bg-white/30 text-white text-sm"
            aria-label="选择模糊强度"
          >
            <option value="sm">小</option>
            <option value="md">中</option>
            <option value="lg">大</option>
            <option value="xl">特大</option>
            <option value="2xl">超大</option>
            <option value="3xl">极大</option>
          </select>
        </div>

        {/* 渐变方向选择 */}
        <div className="mb-3">
          <label className="text-white text-sm block mb-1">渐变方向:</label>
          <select 
            value={gradientDirection} 
            onChange={(e) => setGradientDirection(e.target.value as any)}
            className="w-full p-1 rounded bg-white/30 text-white text-sm"
            aria-label="选择渐变方向"
          >
            <option value="diagonal">对角线</option>
            <option value="vertical">垂直</option>
            <option value="horizontal">水平</option>
            <option value="radial">径向</option>
          </select>
        </div>

        {/* 遮罩控制 */}
        <div className="mb-3">
          <label className="flex items-center text-white text-sm">
            <input 
              type="checkbox" 
              checked={showMask}
              onChange={(e) => setShowMask(e.target.checked)}
              className="mr-2"
            />
            显示遮罩
          </label>
        </div>

        {showMask && (
          <div className="mb-3">
            <label className="text-white text-sm block mb-1">遮罩位置:</label>
            <select 
              value={maskPosition} 
              onChange={(e) => setMaskPosition(e.target.value as any)}
              className="w-full p-1 rounded bg-white/30 text-white text-sm"
              aria-label="选择遮罩位置"
            >
              <option value="bottom">底部</option>
              <option value="top">顶部</option>
              <option value="left">左侧</option>
              <option value="right">右侧</option>
            </select>
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            毛玻璃渐变效果
          </h1>
          
          <p className="text-white/80 text-xl mb-8 leading-relaxed">
            探索现代化的毛玻璃渐变背景效果，提供多种主题和自定义选项。
            调整左侧控制面板的设置来体验不同的视觉效果。
          </p>

          {/* 示例卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-3">卡片样式 1</h3>
              <p className="text-white/70 text-sm">
                这是一个使用毛玻璃效果的卡片示例，具有良好的可读性和现代感。
              </p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30">
              <h3 className="text-white font-semibold text-lg mb-3">卡片样式 2</h3>
              <p className="text-white/70 text-sm">
                这个卡片使用了更强的毛玻璃效果，提供更好的内容分离感。
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/40">
              <h3 className="text-white font-semibold text-lg mb-3">卡片样式 3</h3>
              <p className="text-white/70 text-sm">
                最强的毛玻璃效果，适合需要突出显示的重要内容区域。
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/50">
              <h3 className="text-white font-semibold text-lg mb-3">渐变卡片</h3>
              <p className="text-white/70 text-sm">
                结合渐变和毛玻璃效果，创造出更丰富的视觉层次。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 毛玻璃渐变遮罩 */}
      {showMask && (
        <GlassGradientMask 
          position={maskPosition}
          variant={bgVariant}
          blurIntensity={blurIntensity}
          height="120px"
          opacity={0.8}
        />
      )}
    </GlassBg>
  )
} 