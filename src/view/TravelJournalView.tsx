import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'

const TravelJournalView: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [language] = useAtom(selectedLanguageAtom)
  const [journalInput, setJournalInput] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const { tripPlan, currentActivity: _currentActivity } = location.state || {}

  const handleBack = () => {
    navigate(-1)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const getCurrentDate = () => {
    const now = new Date()
    return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`
  }

  // 生成随机散落的照片位置
  const scatteredPhotos = [
    { id: 1, rotation: '-15deg', position: { top: '15%', left: '8%' }, opacity: 0.3 },
    { id: 2, rotation: '12deg', position: { top: '25%', right: '10%' }, opacity: 0.4 },
    { id: 3, rotation: '-8deg', position: { bottom: '30%', left: '12%' }, opacity: 0.35 },
    { id: 4, rotation: '18deg', position: { bottom: '20%', right: '15%' }, opacity: 0.3 },
    { id: 5, rotation: '-22deg', position: { top: '45%', left: '5%' }, opacity: 0.25 },
    { id: 6, rotation: '25deg', position: { top: '35%', right: '8%' }, opacity: 0.3 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F1E8' }}>
      {/* 装饰性植物边框 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* 左上角植物 */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-40">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
            <path d="M10,90 Q20,10 40,50 Q50,10 70,50 Q80,10 90,90" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="25" cy="25" r="3" fill="#E8B4CB" opacity="0.8"/>
            <circle cx="35" cy="35" r="2" fill="#F4A6CD" opacity="0.6"/>
            <circle cx="65" cy="30" r="2.5" fill="#E8B4CB" opacity="0.7"/>
          </svg>
        </div>
        
        {/* 右上角植物 */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-35 transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-400">
            <path d="M20,80 Q30,20 50,60 Q60,20 80,70 Q85,30 95,85" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="40" cy="40" r="2" fill="#D4AF37" opacity="0.7"/>
            <circle cx="70" cy="45" r="1.5" fill="#F4A6CD" opacity="0.6"/>
          </svg>
        </div>

        {/* 右下角植物 */}
        <div className="absolute bottom-0 right-0 w-36 h-36 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-500">
            <path d="M85,90 Q70,20 50,60 Q40,25 20,70 Q15,35 5,85" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="60" cy="60" r="2.5" fill="#E8B4CB" opacity="0.8"/>
            <circle cx="30" cy="55" r="2" fill="#D4AF37" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* 散落的宝丽来照片 */}
      {scatteredPhotos.map((photo) => (
        <div
          key={photo.id}
          className="absolute w-20 h-24 bg-white rounded-lg shadow-md border-2 border-white pointer-events-none"
          style={{
            ...photo.position,
            transform: `rotate(${photo.rotation})`,
            opacity: photo.opacity,
          }}
        >
          <div className="w-full h-16 bg-gray-200 rounded-t-md"></div>
          <div className="h-8 bg-white rounded-b-md"></div>
        </div>
      ))}

      {/* 返回按钮 */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors bg-white/80 p-2 rounded-lg hover:bg-white/90 shadow-sm"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm">{language === 'zh' ? '返回' : 'Back'}</span>
      </button>

      {/* 主要内容 */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        {/* 日期和地点 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">{getCurrentDate()}</h1>
          <h2 className="text-xl text-gray-600">
            {tripPlan ? (language === 'zh' ? tripPlan.cityName : tripPlan.cityName) : '东京 浅草寺'}
          </h2>
        </div>

        {/* 主要照片卡片 */}
        <div className="relative mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-1 max-w-sm">
            {/* 撕边效果 */}
            <div className="absolute top-2 right-2 w-8 h-6 bg-amber-100 transform rotate-12 rounded-sm opacity-80">
              <span className="text-xs text-amber-700 font-medium">撕边</span>
            </div>
            
            {/* 照片区域 */}
            <div className="w-full h-48 bg-gradient-to-br from-green-300 to-green-500 rounded-md mb-4 relative overflow-hidden">
              {/* 竹林背景 */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600"></div>
                <div className="absolute top-0 left-4 w-2 h-full bg-green-700 opacity-60"></div>
                <div className="absolute top-0 left-8 w-2 h-full bg-green-800 opacity-40"></div>
                <div className="absolute top-0 right-6 w-2 h-full bg-green-700 opacity-50"></div>
                <div className="absolute top-0 right-2 w-2 h-full bg-green-800 opacity-30"></div>
              </div>
              
              {/* 水獭 */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-12 bg-amber-600 rounded-full relative">
                  <div className="absolute top-1 left-2 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-1 right-2 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black rounded-full"></div>
                  {/* 叶子帽子 */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-green-500 rounded-full transform rotate-12"></div>
                </div>
              </div>
            </div>
            
            {/* 照片信息 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">はちみつ</span>
              <button
                onClick={handleLike}
                className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                ♥
              </button>
            </div>
          </div>
        </div>

        {/* 输入框 */}
        <div className="w-full max-w-md mb-6">
          <div className="relative">
            <input
              type="text"
              value={journalInput}
              onChange={(e) => setJournalInput(e.target.value)}
              placeholder={language === 'zh' ? '想让麻薯做什么？' : 'What do you want Mochi to do?'}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-full text-sm focus:outline-none focus:border-amber-400 bg-white/90"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center gap-8">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-1 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-xs">{language === 'zh' ? '喜欢' : 'Like'}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-xs">{language === 'zh' ? '回复' : 'Reply'}</span>
          </button>
          
          <button
            onClick={handleBookmark}
            className={`flex flex-col items-center gap-1 transition-colors ${isBookmarked ? 'text-amber-500' : 'text-gray-600'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-xs">{language === 'zh' ? '收藏' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 底部水獭 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {/* 绿色地面 */}
          <div className="w-32 h-16 bg-green-200 rounded-full opacity-60"></div>
          
          {/* 水獭 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-8 bg-amber-700 rounded-full relative">
              <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-black rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-black rounded-full"></div>
              {/* 尾巴 */}
              <div className="absolute -right-2 top-1/2 w-3 h-1.5 bg-amber-700 rounded-full transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 右下角手帐本 */}
      <div className="absolute bottom-6 right-6">
        <div className="w-16 h-12 bg-amber-100 rounded-md shadow-lg transform rotate-12 relative">
          <div className="absolute inset-1 bg-white rounded-sm">
            <div className="p-1">
              <div className="w-3 h-3 bg-amber-200 rounded-full mx-auto mb-1"></div>
              <div className="w-full h-0.5 bg-gray-300 mb-0.5"></div>
              <div className="w-full h-0.5 bg-gray-300"></div>
            </div>
          </div>
          {/* 翻页效果 */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-sm transform rotate-45 shadow-sm"></div>
        </div>
      </div>
    </div>
  )
}

export default TravelJournalView 