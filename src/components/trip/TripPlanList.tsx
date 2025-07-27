import React from 'react'
import { GeneratedContent } from './types'

interface TripPlanListProps {
  currentTripPlan: any
  tripProgress: any
  petTravelState: any
  language: 'zh' | 'en'
  generatedContents: Map<string, GeneratedContent>
  isTripsCompleted: boolean
  isTransitioning: boolean
  onTimelinePointClick: (activity: any, index: number, event: React.MouseEvent) => void
  formatTimeToAMPM: (timeString: string) => string
  onAdjustPlan: () => void
  onNewJourney: () => void
  getUnifiedButtonStyle: () => any
  handleButtonHover: (e: any, isHover: boolean) => void
}

export const TripPlanList: React.FC<TripPlanListProps> = ({
  currentTripPlan,
  tripProgress,
  petTravelState,
  language,
  generatedContents,
  isTripsCompleted,
  isTransitioning,
  onTimelinePointClick,
  formatTimeToAMPM,
  onAdjustPlan,
  onNewJourney,
  getUnifiedButtonStyle,
  handleButtonHover
}) => {
  return (
    <div 
      className="absolute top-[32vh] left-8 w-[23vw] backdrop-blur-sm p-4 z-20 h-[60vh]"
      style={{
        borderRadius: '1vw',
        border: '2px dashed #D1BA9E',
        background: '#FEFDF9',
        boxShadow: '0 1.8px 6.48px 2.7px rgba(194, 100, 18, 0.12)',
        position: 'relative'
      }}
    >
      {/* 右上角夹子装饰 */}
      <img 
        src="/src/assets/%E5%A4%B9%E5%AD%90.jpg" 
        alt="Clip decoration"
        style={{
          position: 'absolute',
          top: '-6vh',
          right: '-3vw',
          width: '7vw',
          height: '7vw',
          objectFit: 'contain',
          zIndex: 30,
          transform: 'rotate(15deg)',
          filter: 'drop-shadow(0 0.2vh 0.4vh rgba(0,0,0,0.2))'
        }}
      />
      
      <h3 className="text-lg font-bold mb-4 text-center" style={{ color: 'rgb(87, 62, 35)' }}>
        {language === 'zh' ? `${currentTripPlan.petCompanion.name || '豚豚'}的探索计划` : `${currentTripPlan.petCompanion.name || 'Pet'}\'s Exploration Plan`}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(60vh - 200px)', 
        minHeight: '75%',
        position: 'relative'
      }}>
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            paddingRight: '0.5vw',
            paddingBottom: '1vh',
            position: 'relative'
          }} 
          className="activities-scroll"
        >
        {/* 渲染所有活动，包括当前活动和即将进行的活动 */}
        {currentTripPlan.activities.map((activity: any, index: number) => {
          const isCompleted = index < tripProgress.currentActivityIndex
          const isCurrent = index === tripProgress.currentActivityIndex
          const isLast = index === currentTripPlan.activities.length - 1

          return (
            <div key={activity.id} className="flex items-start gap-2 mb-4">
              {/* 左侧：进程节点和进度线 */}
              <div className="flex flex-col items-center">
                {/* 进程节点 */}
                 <div 
                   className="relative cursor-pointer transition-all hover:scale-110" 
                   onClick={(event) => onTimelinePointClick(activity, index, event)}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" viewBox="0 0 41 41" fill="none">
                     <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fill-opacity="0.22"/>
                   </svg>
                   
                   {/* 加载状态指示器 */}
                   {generatedContents.has(activity.id) && generatedContents.get(activity.id)?.isLoading && (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-4 h-4 border-2 border-[#687949] border-t-transparent rounded-full animate-spin"></div>
                     </div>
                   )}
                   
                   {/* 生成完成指示器 */}
                   {generatedContents.has(activity.id) && !generatedContents.get(activity.id)?.isLoading && !generatedContents.get(activity.id)?.error && (
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                   )}
                   
                   {/* 如果已完成或正在进行，显示勾选标记 */}
                   {(isCompleted || isCurrent) && (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" width="1.5vw" height="1.5vw" viewBox="0 0 30 29" fill="none">
                        <g clipPath="url(#clip0_5036_8885)">
                          <path d="M28.8664 1.97266C20.1112 7.34386 13.7608 14.1263 10.8952 17.5247L3.89678 12.0383L0.800781 14.5295L12.8824 26.8271C14.956 21.4991 21.5512 11.0879 29.6008 3.68626L28.8664 1.97266Z" fill="#687949"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_5036_8885">
                            <rect width="28.8" height="28.8" fill="white" transform="translate(0.800781)"/>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* 进度线 */}
                 {!isLast && (
                   <div 
                     className="w-[1px] h-[14vh] mt-2"
                     style={{ background: '#687949' }}
                   ></div>
                 )}
              </div>

              {/* 右侧：时间和卡片 */}
              <div className="flex-1">
                {/* 时间和状态 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {formatTimeToAMPM(activity.time)}
                  </span>
                  
                  {/* 状态标签 */}
                  {isCurrent && (
                    <span 
                      className="text-xs text-white px-2 py-1"
                      style={{
                        borderRadius: '38px',
                        background: '#687949'
                      }}
                    >
                      {language === 'zh' ? '进行中' : 'In Progress'}
                    </span>
                  )}
                  
                  {isCompleted && (
                    <span 
                      className="text-xs text-white px-2 py-1"
                      style={{
                        borderRadius: '38px',
                        background: '#687949'
                      }}
                    >
                      {language === 'zh' ? '已完成' : 'Completed'}
                    </span>
                  )}
                </div>

                {/* 卡片内容 */}
                 <div 
                   className={`relative ${isCurrent ? 'p-3' : 'p-3'}`}
                   style={{
                     borderRadius: '0.8vw',
                     background: isCurrent ? '#FDF5E8' : '#FDF9EF',
                     boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                   }}
                 >
                   {/* 虚线描边（仅当前活动） */}
                   {isCurrent && (
                     <div 
                       className="absolute"
                       style={{
                         top: '10px',
                         left: '10px',
                         right: '10px',
                         bottom: '10px',
                         border: '2px dashed #D1BA9E',
                         borderRadius: '0.6vw',
                         pointerEvents: 'none'
                       }}
                     />
                   )}
                   
                   {/* 上部分：头像、地点和心情 */}
                   <div className="flex items-start gap-3 m-2 relative z-10">
                     {/* 左侧头像 */}
                     <div className="w-[3.5vw] h-[3.5vw] bg-[#F4EDE0] rounded-full flex items-center flex-shrink-0 overflow-hidden">
                       <img 
                         src={
                           currentTripPlan.petCompanion.type === 'cat' ? '/decorations/cat1.jpeg' :
                           currentTripPlan.petCompanion.type === 'dog' ? '/decorations/fox1.jpeg' :
                           currentTripPlan.petCompanion.type === 'other' ? '/decorations/capybara1.jpeg' :
                           '/decorations/fox1.jpeg'
                         }
                         alt={
                           currentTripPlan.petCompanion.type === 'cat' ? 'Cat' :
                           currentTripPlan.petCompanion.type === 'dog' ? 'Dog' :
                           currentTripPlan.petCompanion.type === 'other' ? 'Capybara' :
                           'Pet'
                         }
                         className="w-[120%] h-[120%] object-cover transform -translate-x-2 scale-110"
                       />
                     </div>
                     
                     {/* 右侧地点和心情 */}
                       <div className="flex-1 flex flex-col justify-center">
                         {/* 地点 */}
                         <div className="text-s font-medium text-gray-800 leading-tight mb-1">
                           {language === 'zh' ? activity.location : activity.locationEn}
                         </div>
                         {/* 心情 */}
                         <div className="text-xs text-gray-600 leading-tight">
                           {isCurrent ? 
                             (petTravelState.moodMessage || (language === 'zh' ? '心情不错～' : 'Feeling good~')) :
                             (isCompleted ? 
                               (language === 'zh' ? '已完成～' : 'Completed~') :
                               (language === 'zh' ? '期待中～' : 'Looking forward~')
                             )
                           }
                         </div>
                       </div>
                   </div>
                   
                   {/* 分隔线 */}
                     <div className="w-[90%] h-px bg-[#BBA084] my-1 relative z-10 mx-auto"></div>
                   
                   {/* 下部分：正在做的事情 */}
                   <div className="flex items-center justify-between relative z-10">
                     <div className="ml-2 my-1 text-xs text-gray-700">
                       {language === 'zh' ? activity.description : activity.description}
                     </div>
                     
                   </div>
                 </div>
              </div>
            </div>
          )
        })}

        {/* 行程结束后显示完成状态 */}
        {isTripsCompleted && (
          <div className="flex items-start gap-3 mb-4">
            {/* 左侧：完成节点 */}
             <div className="flex flex-col items-center">
               <div className="relative">
                 <svg xmlns="http://www.w3.org/2000/svg" width="3vw" height="3vw" viewBox="0 0 41 41" fill="none">
                   <path d="M20.4216 0.600098C9.33294 0.600098 0.400391 9.53265 0.400391 20.6213C0.400391 31.71 9.33294 40.6426 20.4216 40.6426C31.5103 40.6426 40.4429 31.71 40.4429 20.6213C40.4429 9.53265 31.5103 0.600098 20.4216 0.600098ZM20.4216 37.5624C11.0271 37.5624 3.48058 30.0159 3.48058 20.6213C3.48058 11.2268 11.0271 3.68029 20.4216 3.68029C29.8162 3.68029 37.3627 11.2268 37.3627 20.6213C37.3627 30.0159 29.8162 37.5624 20.4216 37.5624Z" fill="#687949" fill-opacity="0.8"/>
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="2vw" height="2vw" viewBox="0 0 30 29" fill="none">
                    <g clipPath="url(#clip0_5036_8885)">
                      <path d="M28.8664 1.97266C20.1112 7.34386 13.7608 14.1263 10.8952 17.5247L3.89678 12.0383L0.800781 14.5295L12.8824 26.8271C14.956 21.4991 21.5512 11.0879 29.6008 3.68626L28.8664 1.97266Z" fill="#687949"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_5036_8885">
                        <rect width="28.8" height="28.8" fill="white" transform="translate(0.800781)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* 右侧：完成信息 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="text-xs text-white px-2 py-1"
                  style={{
                    borderRadius: '38px',
                    background: '#687949'
                  }}
                >
                  {language === 'zh' ? '全部完成' : 'All Completed'}
                </span>
              </div>
              
              <div 
                 className="p-3"
                 style={{
                   borderRadius: '0.8vw',
                   background: '#FDF9EF',
                   boxShadow: '0 1.8px 8px 2.7px rgba(123, 66, 15, 0.1)'
                 }}
               >
                 <div className="text-center">
                   <h4 className="font-bold text-sm text-gray-700">
                     {language === 'zh' ? '恭喜！所有活动都完成了' : 'Congratulations! All activities completed'}
                   </h4>
                   <p className="text-xs text-gray-500 mt-1">
                     {language === 'zh' ? '今天过得很充实呢～' : 'What a fulfilling day~'}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        )}
        
        </div>
        
        {/* 底部渐变遮罩 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: '0.5vw',
          height: '4vh',
          background: 'linear-gradient(to bottom, rgba(254, 253, 249, 0) 0%, rgba(254, 253, 249, 0.8) 50%, rgba(254, 253, 249, 1) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      </div>
      
      {/* 固定在探索计划底部的按钮 */}
      <div className="mt-4 flex justify-center">
        {!isTripsCompleted && !isTransitioning && (
          <button 
            onClick={onAdjustPlan}
            style={getUnifiedButtonStyle()}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            <span className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2vw" height="1.2vw" viewBox="0 0 31 32" fill="none">
                <path d="M11.7993 22.7033C11.6848 22.8178 11.5431 22.9014 11.3874 22.9461L4.44681 24.9423C4.08559 25.0462 3.75126 24.7118 3.85516 24.3506L5.85128 17.41C5.89604 17.2544 5.97959 17.1127 6.0941 16.9982L20.2248 2.86746C20.5982 2.49405 21.2037 2.49405 21.5771 2.86746L25.9299 7.22037C26.3034 7.59379 26.3034 8.19928 25.9299 8.57272L11.7993 22.7033ZM19.2105 7.2626L21.5348 9.58694L23.2253 7.8965L20.9009 5.57216L19.2105 7.2626ZM17.6891 8.78396L8.04641 18.4267L7.10806 21.6894L10.3707 20.751L20.0135 11.1083L17.6891 8.78396ZM3.95608 27.2658H26.9061V29.4173H3.95608V27.2658Z" fill="white"/>
              </svg>
              <span>{language === 'zh' ? '调整计划' : 'Adjust Plan'}</span>
            </span>
          </button>
        )}

        {/* 行程完成后显示新旅程按钮 */}
        {isTripsCompleted && (
          <button 
            style={getUnifiedButtonStyle()}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
            onClick={onNewJourney}
          >
            <span className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L5 10M5 10L3 8M5 10H13M13 12V18C13 18.5304 13.2107 19.0391 13.5858 19.4142C13.9609 19.7893 14.4696 20 15 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H15C14.4696 4 13.9609 4.21071 13.5858 4.58579C13.2107 4.96086 13 5.46957 13 6V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{language === 'zh' ? '开启新旅程！' : 'Start New Journey!'}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
} 