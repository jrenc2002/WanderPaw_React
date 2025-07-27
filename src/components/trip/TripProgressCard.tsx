import React from 'react'
import { GeneratedContent } from './types'

interface TripProgressCardProps {
  currentTripPlan: any
  currentActivity: any
  tripProgress: any
  currentTime: string
  language: 'zh' | 'en'
  generatedContents: Map<string, GeneratedContent>
  onTimelinePointClick: (activity: any, index: number, event: React.MouseEvent) => void
  formatTimeToAMPM: (timeString: string) => string
}

export const TripProgressCard: React.FC<TripProgressCardProps> = ({
  currentTripPlan,
  currentActivity,
  tripProgress,
  currentTime,
  language,
  generatedContents,
  onTimelinePointClick,
  formatTimeToAMPM
}) => {
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
      <div 
        className="backdrop-blur-sm p-5 w-[47vw]"
        style={{
          borderRadius: '1.5vw',
          background: '#FEFDF9',
          boxShadow: '0 2px 34.9px 3px rgba(123, 66, 15, 0.11)'
        }}
      >
        {/* 上层：头像、姓名、事情、时间、地点 */}
        <div className="flex items-start justify-between mb-1">
          {/* 左侧：宠物头像、名称和当前活动 */}
          <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center overflow-hidden ${
              currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog' 
                ? 'w-[7vw] h-[5.5vw]' 
                : 'w-[8vw] h-[6vw]'
            }`}>
              <img 
                src={
                  currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat.png' :
                  currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox.png' :
                  currentTripPlan.petCompanion.type === 'other' ? '/decorations/capybara.jpeg' :
                  '/decorations/fox.png'
                }
                alt={
                  currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                  currentTripPlan.petCompanion.type === 'dog' ? 'Dog' :
                  currentTripPlan.petCompanion.type === 'other' ? 'Capybara' :
                  'Pet'
                }
                className={`w-full h-full ${
                  currentTripPlan.petCompanion.type === 'cat' || currentTripPlan.petCompanion.type === 'dog'
                    ? 'object-contain'
                    : 'object-cover'
                }`}
              />
            </div>
            
            {/* 宠物名称和当前活动 */}
            <div className="flex flex-col">
              <h2 
                style={{
                  color: '#687949',
                  fontFamily: 'PingFang SC',
                  fontSize: '1.6vw',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal'
                }}
              >
                {currentTripPlan.petCompanion.name || (language === 'zh' ? '豚豚君' : 'Pig-kun')}
              </h2>
              
              {currentActivity && (
                <p 
                  style={{
                    color: '#B1C192',
                    fontFamily: 'PingFang SC',
                    fontSize: '0.9vw',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    margin: '8px 0'
                  }}
                >
                  {language === 'zh' ? currentActivity.title : currentActivity.titleEn}
                </p>
              )}
            </div>
          </div>
          
          {/* 右侧：时间和地点 */}
          <div className="flex flex-col items-end">
            <div 
              style={{
                color: '#687949',
                fontFamily: 'PingFang SC',
                fontSize: '2.3vw',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal'
              }}
            >
              {currentTime}
            </div>
            <div 
              style={{
                borderRadius: '4vw',
                background: '#F3E2B6',
                padding: '2px 10px',
                marginTop: '1px',
                marginBottom: '1px'
              }}
            >
              <span className="text-s font-medium text-gray-700">
                {currentTripPlan.cityName}
              </span>
            </div>
          </div>
        </div>
        
        {/* 下层：行程状态和进度条 */}
        <div className="flex items-center gap-2">
          {/* 行程状态 */}
          <div className="flex top-[2vh] gap-2">
            <span className="text-s text-gray-600">
              {tripProgress.currentActivityIndex < currentTripPlan.activities.length ? 
                (language === 'zh' ? '行程中' : 'In Progress') : 
                (language === 'zh' ? '行程结束' : 'Trip Completed')
              }
            </span>
          </div>
          
          {/* 进度条 */}
          <div className="flex-1 relative"
            style={{ minWidth: '20vw', marginLeft: '1vw' }}
          >
            <div className="flex items-center justify-between relative">
              {/* 连接线 */}
              <div className="rounded-full absolute top-[7px] left-[10px] right-[10px] h-2" style={{ backgroundColor: '#E5E5E5' }}></div>
              <div 
                className="rounded-full absolute top-[7px] left-[10px] h-2 transition-all duration-500"
                style={{ 
                  width: `${((tripProgress.currentActivityIndex + 1 ) / tripProgress.totalActivities) * 120}%`,
                  backgroundColor: '#597466'
                }}
              ></div>
              
              {currentTripPlan.activities.map((activity: any, index: number) => (
                <div key={activity.id} className="flex flex-col items-center relative z-10">
                  <div className="relative">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      fill="none"
                      className="w-[20px] h-[20px] cursor-pointer transition-all hover:scale-110"
                      onClick={(event) => onTimelinePointClick(activity, index, event)}
                    >
                      <circle 
                        cx="10" 
                        cy="10" 
                        r="10" 
                        fill={index <= tripProgress.currentActivityIndex ? '#B1C192' : '#E5E5E5'}
                      />
                      <circle 
                        cx="10" 
                        cy="10" 
                        r="5" 
                        fill={index <= tripProgress.currentActivityIndex ? '#597466' : '#D1D5DB'}
                      />
                    </svg>
                    
                    {/* 加载状态指示器 */}
                    {generatedContents.has(activity.id) && generatedContents.get(activity.id)?.isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-[#597466] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* 生成完成指示器 */}
                    {generatedContents.has(activity.id) && !generatedContents.get(activity.id)?.isLoading && !generatedContents.get(activity.id)?.error && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                    )}
                  </div>
                  
                  <span 
                    className="mt-1"
                    style={{
                      color: '#687949',
                      fontFamily: 'PingFang SC',
                      fontSize: '14px',
                      fontWeight: 400
                    }}
                  >
                    {formatTimeToAMPM(activity.time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 