import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAllGenesisSamples } from '@/data/genesisSamples'
import { WarmBg } from '@/components/bg/WarmBg'

export const SampleDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const samples = getAllGenesisSamples()
  const sample = samples.find(s => s.id === id)

  if (!sample) {
    return (
      <WarmBg className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">生活样本未找到</h1>
          <Link to="/test" className="text-amber-600 hover:text-amber-800">
            返回地图
          </Link>
        </div>
      </WarmBg>
    )
  }

  return (
    <WarmBg>
      {/* 头部导航 */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/test" className="text-amber-600 hover:text-amber-800 flex items-center gap-2">
            ← 返回地图
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>👁️ {sample.viewCount}</span>
            <span>❤️ {sample.likeCount}</span>
            <span>📤 {sample.shareCount}</span>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* 分享者信息卡片 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <div className="flex items-start gap-6">
            <img
              src={sample.sharerProfile.avatar}
              alt={sample.sharerProfile.nickname}
              className="w-20 h-20 rounded-full border-2 border-green-400"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {sample.sharerProfile.nickname}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm">
                  {sample.sharerProfile.profession}
                </span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">
                  {sample.sharerProfile.ageRange}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm">
                  📍 {sample.location.districtName}, {sample.location.cityName}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sample.sharerProfile.personalTags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-gray-300 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 位置信息 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">📍 居住位置</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">基本信息</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-white">详细地址：</span>
                  {sample.location.provinceName} {sample.location.cityName} {sample.location.districtName}
                </p>
                <p className="text-gray-400">
                  <span className="text-white">区域描述：</span>
                  {sample.location.areaDescription}
                </p>
                <p className="text-gray-400">
                  <span className="text-white">选择原因：</span>
                  {sample.location.reasonForChoosing}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">周边配套</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white">附近地标：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sample.location.nearbyLandmarks.map((landmark, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
                {sample.location.transportAccess.subway && (
                  <div>
                    <span className="text-white">地铁：</span>
                    <span className="text-gray-400 ml-2">
                      {sample.location.transportAccess.subway.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 月度账本 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">💰 月度账本</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-green-400">月收入</span>
                <span className="text-2xl font-bold text-green-400">
                  {sample.monthlyBudget.incomeMonthly?.toLocaleString()} {sample.monthlyBudget.currency}
                </span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-red-400">月支出</span>
                <span className="text-2xl font-bold text-red-400">
                  {sample.monthlyBudget.totalMonthly.toLocaleString()} {sample.monthlyBudget.currency}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-300 mb-3">核心支出</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">🏠 住房</span>
                  <span className="text-white">{sample.monthlyBudget.coreExpenses.housing.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">🍽️ 餐饮</span>
                  <span className="text-white">{sample.monthlyBudget.coreExpenses.food.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">🚗 交通</span>
                  <span className="text-white">{sample.monthlyBudget.coreExpenses.transport.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">📱 水电网</span>
                  <span className="text-white">{sample.monthlyBudget.coreExpenses.utilities.amount}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">可选支出</h3>
              <div className="space-y-2">
                {Object.entries(sample.monthlyBudget.optionalExpenses).map(([key, expense]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400">
                      {key === 'entertainment' ? '🎮 娱乐' :
                       key === 'shopping' ? '🛍️ 购物' :
                       key === 'healthcare' ? '🏥 医疗' :
                       key === 'education' ? '📚 教育' :
                       key === 'savings' ? '💾 储蓄' : key}
                    </span>
                    <span className="text-white">{expense.amount}</span>
                  </div>
                ))}
              </div>
              
              {Object.keys(sample.monthlyBudget.customCategories).length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-300 mb-3 mt-6">自定义支出</h3>
                  <div className="space-y-2">
                    {Object.entries(sample.monthlyBudget.customCategories).map(([key, expense]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-400">{expense.icon} {key}</span>
                        <span className="text-white">{expense.amount}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm italic">
              "{sample.monthlyBudget.notes}"
            </p>
          </div>
        </div>

        {/* 一天生活 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">⏰ 一天生活</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                {sample.aDayInLife.weekdaySchedule.title}
              </h3>
              <div className="space-y-2">
                {sample.aDayInLife.weekdaySchedule.timeSlots.slice(0, 6).map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                    <span className="text-blue-400 text-sm font-mono">{slot.time}</span>
                    <span className="text-gray-300 text-sm">{slot.activity}</span>
                    <span className="text-lg">{slot.mood}</span>
                  </div>
                ))}
                <div className="text-center py-2">
                  <span className="text-gray-500 text-sm">... 更多时间段 ...</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                {sample.aDayInLife.weekendSchedule.title}
              </h3>
              <div className="space-y-2">
                {sample.aDayInLife.weekendSchedule.timeSlots.slice(0, 6).map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                    <span className="text-blue-400 text-sm font-mono">{slot.time}</span>
                    <span className="text-gray-300 text-sm">{slot.activity}</span>
                    <span className="text-lg">{slot.mood}</span>
                  </div>
                ))}
                <div className="text-center py-2">
                  <span className="text-gray-500 text-sm">... 更多时间段 ...</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm italic">
              "{sample.aDayInLife.rhythmSummary}"
            </p>
          </div>
        </div>

        {/* 利弊分析 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚖️ 真实评价</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">✅ 优势</h3>
              <div className="space-y-3">
                {sample.prosAndCons.pros.map((pro, index) => (
                  <div key={index} className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <h4 className="font-semibold text-green-300 mb-1">{pro.title}</h4>
                    <p className="text-gray-300 text-sm">{pro.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">重要程度:</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className={`text-xs ${i <= pro.importance ? 'text-yellow-400' : 'text-gray-600'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-3">❌ 劣势</h3>
              <div className="space-y-3">
                {sample.prosAndCons.cons.map((con, index) => (
                  <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <h4 className="font-semibold text-red-300 mb-1">{con.title}</h4>
                    <p className="text-gray-300 text-sm">{con.description}</p>
                    {con.workaround && (
                      <p className="text-blue-300 text-xs mt-1">
                        💡 解决方案: {con.workaround}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 核心建议 */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">💡 核心建议</h2>
          
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              给 "{sample.coreAdvice.targetAudience}" 的建议
            </h3>
            <p className="text-white text-lg italic">
              "{sample.coreAdvice.mainAdvice}"
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">💰 财务建议</h4>
                <ul className="space-y-1">
                  {sample.coreAdvice.categorizedAdvice.financial.map((advice, index) => (
                    <li key={index} className="text-gray-300 text-sm">• {advice}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">🛠️ 实用建议</h4>
                <ul className="space-y-1">
                  {sample.coreAdvice.categorizedAdvice.practical.map((advice, index) => (
                    <li key={index} className="text-gray-300 text-sm">• {advice}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">👥 社交建议</h4>
                <ul className="space-y-1">
                  {sample.coreAdvice.categorizedAdvice.social.map((advice, index) => (
                    <li key={index} className="text-gray-300 text-sm">• {advice}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">🧠 心态建议</h4>
                <ul className="space-y-1">
                  {sample.coreAdvice.categorizedAdvice.mindset.map((advice, index) => (
                    <li key={index} className="text-gray-300 text-sm">• {advice}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <h4 className="font-semibold text-red-400 mb-2">⚠️ 避免这些坑</h4>
            <div className="flex flex-wrap gap-2">
              {sample.coreAdvice.pitfallsToAvoid.map((pitfall, index) => (
                <span key={index} className="px-2 py-1 bg-red-500/20 rounded text-red-300 text-xs">
                  {pitfall}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 社交媒体 */}
        {sample.sharerProfile.socialLinks.length > 0 && (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">📱 关注我</h2>
            <div className="flex flex-wrap gap-4">
              {sample.sharerProfile.socialLinks.map((social, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-2xl">
                    {social.platform === 'xiaohongshu' ? '📙' :
                     social.platform === 'bilibili' ? '📺' :
                     social.platform === 'douyin' ? '🎵' :
                     social.platform === 'instagram' ? '📷' : '🔗'}
                  </span>
                  <div>
                    <p className="text-white font-semibold">{social.displayName}</p>
                    <p className="text-gray-400 text-sm">@{social.id}</p>
                    {social.followerCount && (
                      <p className="text-gray-500 text-xs">{social.followerCount} 关注者</p>
                    )}
                  </div>
                  {social.verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </WarmBg>
  )
} 