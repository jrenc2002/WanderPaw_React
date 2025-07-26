import React, { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import type { MapPoint } from '@/data/mapData'
import { X, RefreshCcw } from 'lucide-react'
import { gsap } from 'gsap'
import './MapPointCard.css'

interface MapPointCardProps {
  point: MapPoint
  position: { x: number; y: number }
  isVisible: boolean
  onClose: () => void
}

export const MapPointCard: React.FC<MapPointCardProps> = ({
  point,
  position,
  isVisible,
  onClose
}) => {
  const [language] = useAtom(selectedLanguageAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // 根据城市生成相关图片URL（缩减版，只显示3张）
  const getCityImages = (cityId: string) => {
    const imageMap: Record<string, string[]> = {
      beijing: [
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=300&auto=format&fit=crop'
      ],
      shanghai: [
        'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1537986904618-27d0e2b52eb4?q=80&w=300&auto=format&fit=crop'
      ],
      shenzhen: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=300&auto=format&fit=crop'
      ],
      chengdu: [
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=300&auto=format&fit=crop'
      ]
    }
    
    return imageMap[cityId] || [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=300&auto=format&fit=crop'
    ]
  }

  const playAnimation = () => {
    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return
    
    // 先设置初始状态
    gsap.set(cards, {
      scale: 0,
      rotation: (index) => {
        const rotations = [8, -5, 3] // 3张卡片的旋转角度
        return rotations[index] || 0
      },
      x: (index) => {
        const gap = 50 // 缩小间距
        const positions = [-gap, 0, gap] // 3张卡片的位置
        return positions[index] || 0
      },
      y: 0
    })
    
    // 然后播放动画
    gsap.to(cards, {
      scale: 1,
      stagger: 0.08,
      ease: "elastic.out(1, 0.8)",
      delay: 0.2,
      duration: 0.6
    })
  }

  useEffect(() => {
    if (isVisible) {
      // 延迟播放动画，确保DOM已经渲染
      setTimeout(playAnimation, 50)
    }
  }, [isVisible])

  const getPetFriendlyColor = (index: number) => {
    if (index >= 80) return '#10b981'
    if (index >= 60) return '#f59e0b'
    if (index >= 40) return '#f97316'
    return '#ef4444'
  }

  if (!isVisible) return null

  const images = getCityImages(point.id)

  return (
    <div 
      ref={containerRef}
      className="map-point-card"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)', // 让卡片显示在标点上方
      }}
    >
      {/* 关闭按钮 */}
      <button 
        className="map-card-close" 
        onClick={onClose}
        title={language === 'zh' ? '关闭' : 'Close'}
        aria-label={language === 'zh' ? '关闭卡片' : 'Close card'}
      >
        <X size={16} />
      </button>

      {/* 卡片区域 */}
      <div className="map-card-photos">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            ref={el => cardsRef.current[index] = el}
            className="map-photo-card"
          >
            <img className="map-photo-image" src={imageUrl} alt={`${point.title} ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* 城市信息 */}
      <div className="map-card-info">
        <h3 className="map-card-title">{point.title}</h3>
        <p className="map-card-description">{point.description}</p>
        
        <div className="map-card-details">
          <div className="map-detail-item">
            <span className="detail-icon">🏠</span>
            <span className="detail-label">
              {language === 'zh' ? '宠物友好度' : 'Pet Friendly Index'}:
            </span>
            <span 
              className="detail-value"
              style={{ color: getPetFriendlyColor(point.petFriendlyIndex) }}
            >
              {point.petFriendlyIndex}
            </span>
          </div>

          {point.data && (
            <>
              {point.data.averageSalary && (
                <div className="map-detail-item">
                  <span className="detail-icon">💰</span>
                  <span className="detail-label">
                    {language === 'zh' ? '平均工资' : 'Avg Salary'}:
                  </span>
                  <span className="detail-value">
                    {point.data.averageSalary.toLocaleString()} {point.data.currency}
                  </span>
                </div>
              )}
              {point.data.rentPrice && (
                <div className="map-detail-item">
                  <span className="detail-icon">🏡</span>
                  <span className="detail-label">
                    {language === 'zh' ? '房租' : 'Rent'}:
                  </span>
                  <span className="detail-value">
                    {point.data.rentPrice.toLocaleString()} {point.data.currency}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* 重播按钮 */}
        <button className="map-replay-btn" onClick={playAnimation}>
          <RefreshCcw size={14} />
          <span>{language === 'zh' ? '重播' : 'Replay'}</span>
        </button>
      </div>

      {/* 箭头指示器 */}
      <div className="map-card-arrow"></div>
    </div>
  )
} 