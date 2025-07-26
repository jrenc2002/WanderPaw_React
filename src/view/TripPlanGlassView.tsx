import React from 'react'
import { GlassBg } from '@/components/bg/GlassBg'
import { GlassGradientMask } from '@/components/decorations/GlassGradientMask'
import { DashedCard } from '@/components/common/DashedCard'

export const TripPlanGlassView: React.FC = () => {
  return (
    <GlassBg variant="warm" blurIntensity="lg" gradientDirection="diagonal">
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        
        {/* 返回按钮 */}
        <button
          onClick={() => window.history.back()}
          title="返回"
          className="fixed top-8 left-8 z-40 bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 shadow-lg border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative z-20 flex flex-col items-center flex-grow p-6 pt-20">
          
          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              WanderPaw 旅行计划
            </h1>
            <p className="text-white/80 text-lg">
              与您的毛绒伙伴一起探索美妙的旅程
            </p>
          </div>

          {/* 主要内容卡片 */}
          <div className="w-full max-w-4xl">
            <DashedCard className="bg-white/10 backdrop-blur-lg border-white/20">
              <div className="relative">
                
                {/* 卡片内容区域 */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    计划您的下一次冒险
                  </h2>

                  {/* 选项网格 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 目的地选择 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">选择目的地</h3>
                        <p className="text-white/70 text-sm">
                          从世界各地的精彩城市中选择您的探索目标
                        </p>
                      </div>
                    </div>

                    {/* 宠物选择 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">选择伙伴</h3>
                        <p className="text-white/70 text-sm">
                          挑选您的毛绒旅行伙伴，一起开始冒险之旅
                        </p>
                      </div>
                    </div>

                    {/* 主题选择 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">旅行主题</h3>
                        <p className="text-white/70 text-sm">
                          选择您感兴趣的旅行主题和活动类型
                        </p>
                      </div>
                    </div>

                    {/* 时间规划 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">时间安排</h3>
                        <p className="text-white/70 text-sm">
                          规划您的旅行日程和停留时间
                        </p>
                      </div>
                    </div>

                    {/* 预算设置 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">预算规划</h3>
                        <p className="text-white/70 text-sm">
                          设置您的旅行预算和消费计划
                        </p>
                      </div>
                    </div>

                    {/* 开始旅程 */}
                    <div className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">开始冒险</h3>
                        <p className="text-white/70 text-sm">
                          一切准备就绪，开始您的 WanderPaw 之旅！
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* 底部提示 */}
                  <div className="mt-8 text-center">
                    <p className="text-white/60 text-sm">
                      💡 提示：您可以随时修改旅行计划，与您的毛绒伙伴一起发现更多精彩
                    </p>
                  </div>
                </div>

                {/* 毛玻璃底部渐变遮罩 - 替代原来的简单渐变 */}
                <GlassGradientMask 
                  position="bottom"
                  variant="warm"
                  height="60px"
                  blurIntensity="md"
                  opacity={0.7}
                  zIndex={10}
                />
              </div>
            </DashedCard>
          </div>
        </div>
        
      </div>
    </GlassBg>
  )
} 