import React, { useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { selectedLanguageAtom } from '@/store/MapState'
import type { MapPoint } from '@/data/mapData'
import { X, RefreshCcw, ExternalLink, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import './CityDetailModal.css'

interface CityDetailModalProps {
  point: MapPoint
  isOpen: boolean
  onClose: () => void
}

export const CityDetailModal: React.FC<CityDetailModalProps> = ({
  point,
  isOpen,
  onClose
}) => {
  const [language] = useAtom(selectedLanguageAtom)
  const modalRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  // 根据城市生成相关图片URL
  const getCityImages = (cityId: string) => {
    const imageMap: Record<string, string[]> = {
      beijing: [
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1559563458-527cfc196ab5?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500&auto=format&fit=crop'
      ],
      shanghai: [
        'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1537986904618-27d0e2b52eb4?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=500&auto=format&fit=crop'
      ],
      shenzhen: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500&auto=format&fit=crop'
      ],
      chengdu: [
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format&fit=crop'
      ]
    }
    
    return imageMap[cityId] || [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format&fit=crop'
    ]
  }

  const playAnimation = () => {
    const cards = cardsRef.current.filter(Boolean)
    if (cards.length === 0) return
    
    // 先设置初始状态
    gsap.set(cards, {
      scale: 0,
      rotation: (index) => {
        const rotations = [10, 5, -3, -10, 2]
        return rotations[index] || 0
      },
      x: (index) => {
        const gap = 85
        const positions = [-2 * gap, -1 * gap, 0, 1 * gap, 2 * gap]
        return positions[index] || 0
      },
      y: 0
    })
    
    // 然后播放动画
    gsap.to(cards, {
      scale: 1,
      stagger: 0.06,
      ease: "elastic.out(1, 0.8)",
      delay: 0.5,
      duration: 0.8
    })
  }

  useEffect(() => {
    if (isOpen) {
      // 延迟播放动画，确保DOM已经渲染
      setTimeout(playAnimation, 100)
      
      // 阻止背景滚动
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  const images = getCityImages(point.id)
  const getTangpingColor = (index: number) => {
    if (index >= 80) return '#10b981'
    if (index >= 60) return '#f59e0b'
    if (index >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div 
      ref={modalRef}
      className="city-modal-backdrop" 
      onClick={handleBackdropClick}
    >
      <div className="city-modal-container">
        {/* 关闭按钮 */}
        <button 
          className="city-modal-close" 
          onClick={onClose}
          title={language === 'zh' ? '关闭' : 'Close'}
          aria-label={language === 'zh' ? '关闭弹窗' : 'Close modal'}
        >
          <X size={24} />
        </button>

        {/* 卡片区域 */}
        <div className="city-modal-cards">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="city-card"
            >
              <img className="city-card-image" src={imageUrl} alt={`${point.title} ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* 城市信息 */}
        <div className="city-modal-info">
          <div className="city-info-main">
            <h2 className="city-title">{point.title}</h2>
            <p className="city-description">{point.description}</p>
            <div className="city-tangping">
              <span className="tangping-label">
                {language === 'zh' ? '躺平指数' : 'Lying Flat Index'}:
              </span>
              <span 
                className="tangping-value"
                style={{ color: getTangpingColor(point.tangpingIndex) }}
              >
                {point.tangpingIndex}
              </span>
            </div>
          </div>

          {point.data && (
            <div className="city-data-grid">
              {point.data.averageSalary && (
                <div className="city-data-item">
                  <span className="data-icon">💰</span>
                  <span className="data-label">
                    {language === 'zh' ? '平均工资' : 'Average Salary'}
                  </span>
                  <span className="data-value">
                    {point.data.averageSalary.toLocaleString()} {point.data.currency}
                  </span>
                </div>
              )}
              {point.data.rentPrice && (
                <div className="city-data-item">
                  <span className="data-icon">🏡</span>
                  <span className="data-label">
                    {language === 'zh' ? '房租' : 'Rent'}
                  </span>
                  <span className="data-value">
                    {point.data.rentPrice.toLocaleString()} {point.data.currency}
                  </span>
                </div>
              )}
              {point.data.workLifeBalance && (
                <div className="city-data-item">
                  <span className="data-icon">⚖️</span>
                  <span className="data-label">
                    {language === 'zh' ? '工作生活平衡' : 'Work-Life Balance'}
                  </span>
                  <span className="data-value">{point.data.workLifeBalance}</span>
                </div>
              )}
              {point.data.costOfLiving && (
                <div className="city-data-item">
                  <span className="data-icon">💸</span>
                  <span className="data-label">
                    {language === 'zh' ? '生活成本' : 'Cost of Living'}
                  </span>
                  <span className="data-value">{point.data.costOfLiving}</span>
                </div>
              )}
              {point.data.qualityOfLife && (
                <div className="city-data-item">
                  <span className="data-icon">🌟</span>
                  <span className="data-label">
                    {language === 'zh' ? '生活质量' : 'Quality of Life'}
                  </span>
                  <span className="data-value">{point.data.qualityOfLife}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="city-modal-actions">
          <div className="city-modal-links">
            <a 
              className="city-btn" 
              href={`https://www.google.com/search?q=${encodeURIComponent(point.title)}+旅游攻略`}
              target="_blank" 
              rel="noreferrer"
            >
              <span>{language === 'zh' ? '旅游攻略' : 'Travel Guide'}</span>
              <ExternalLink className="city-btn-icon" size={16} />
            </a>
            <a 
              className="city-btn"
              href={`https://www.google.com/search?q=${encodeURIComponent(point.title)}+美食推荐`}
              target="_blank" 
              rel="noreferrer"
            >
              <span>{language === 'zh' ? '美食推荐' : 'Food & Dining'}</span>
              <Sparkles className="city-btn-icon" size={16} />
            </a>
          </div>

          <button className="city-btn city-replay-btn" onClick={playAnimation}>
            <span>{language === 'zh' ? '重播动画' : 'Replay'}</span>
            <RefreshCcw className="city-btn-icon" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
} 