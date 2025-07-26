import {
    HashRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";

import { GridBg } from '@/components/bg/GirdBg';
import { DockObject } from '@/components/dock/Dock';
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute';

import { Toaster } from 'react-hot-toast';
import HomeView from '@/view/HomeView.tsx';
import SettingView from '@/view/SettingView';
import { SampleTestView } from '@/view/SampleTestView';
import { SampleDetailView } from '@/view/SampleDetailView';
import { AuthView } from '@/view/AuthView';
import { PetInitializationView } from '@/view/PetInitializationView';
import { MapTestView } from '@/view/MapTestView';
import TripThemesView from '@/view/TripThemesView';
import TripPlanView from '@/view/TripPlanView';
import TripJourneyView from '@/view/TripJourneyView';
import TravelJournalView from '@/view/TravelJournalView';

// 开始旅行按钮组件
const StartTripButton = () => {
    const navigate = useNavigate()
    
    const handleStartTrip = () => {
        // 直接导航到旅行主题页面（使用默认城市ID）
        navigate('/trip-themes/1')
    };

    return (
        <svg 
            onClick={handleStartTrip}
            className="fixed bottom-5 right-6 z-50 cursor-pointer transform transition-transform duration-200 hover:scale-110"
            width="250" 
            height="63" 
            viewBox="0 0 459 110" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-label="开始旅行"
        >
            <g clipPath="url(#clip0_5036_9983)">
                <path d="M430 68.6025L409.99 87.3438C409.399 87.8966 408.612 88.1918 407.803 88.1647C406.994 88.1375 406.229 87.79 405.676 87.1987C405.123 86.6075 404.828 85.8208 404.855 85.0118C404.883 84.2029 405.23 83.4378 405.821 82.885L423.294 66.5L405.64 49.825C405.049 49.2722 404.701 48.5071 404.674 47.6982C404.647 46.8892 404.942 46.1025 405.495 45.5112C406.048 44.92 406.813 44.5725 407.622 44.5453C408.431 44.5182 409.218 44.8134 409.809 45.3662L430 64.1437C430.306 64.4287 430.551 64.7738 430.718 65.1573C430.885 65.5409 430.971 65.9548 430.971 66.3731C430.971 66.7915 430.885 67.2054 430.718 67.5889C430.551 67.9725 430.306 68.3175 430 68.6025ZM415.5 23C406.897 23 398.486 25.5512 391.333 30.3311C384.179 35.1109 378.604 41.9047 375.311 49.8533C372.019 57.8019 371.157 66.5483 372.836 74.9864C374.514 83.4246 378.657 91.1756 384.741 97.2591C390.824 103.343 398.575 107.486 407.014 109.164C415.452 110.843 424.198 109.981 432.147 106.689C440.095 103.396 446.889 97.8208 451.669 90.6673C456.449 83.5138 459 75.1035 459 66.5C459 54.9631 454.417 43.8987 446.259 35.7409C438.101 27.583 427.037 23 415.5 23Z" fill="#687949"/>
            </g>
            <line x1="372" y1="69" x2="1.74846e-07" y2="69" stroke="#687949" strokeWidth="4" strokeDasharray="28 8"/>
            <path d="M2.142 12.324H39.816V16.608H22.092V21.732C27.216 24.168 32.382 26.982 37.632 30.09L34.986 34.038C29.82 30.762 25.536 28.2 22.092 26.436V49.368H17.682V16.608H2.142V12.324ZM43.89 27.402H82.068V31.77H43.89V27.402ZM104.748 20.64C103.446 24.588 101.808 27.696 99.792 29.964L96.138 27.402C99.456 23.286 101.598 17.574 102.564 10.224L106.932 10.938C106.638 12.87 106.302 14.718 105.924 16.398H123.312V19.296C122.43 22.824 121.296 26.31 119.868 29.796L115.542 28.578C116.718 26.31 117.726 23.664 118.566 20.64H104.748ZM107.94 22.992H112.224C112.224 25.176 112.098 27.234 111.888 29.166C114.24 36.306 118.566 41.934 124.782 46.134L121.884 49.494C116.97 45.714 113.19 41.094 110.586 35.676L110.082 37.188C108.402 42.144 104.37 46.302 97.986 49.578L95.088 46.05C100.59 43.278 104.202 39.96 105.924 36.012C107.184 32.652 107.856 28.284 107.94 22.992ZM89.25 12.03C92.358 15.348 94.752 18.246 96.432 20.766L92.988 23.16C91.182 20.472 88.746 17.49 85.722 14.256L89.25 12.03ZM92.778 30.174L96.642 31.644C94.458 37.524 92.064 43.026 89.376 48.15L85.302 46.302C88.158 41.052 90.678 35.676 92.778 30.174ZM134.148 38.658C135.282 38.658 136.248 39.12 137.004 40.044C137.718 40.968 138.096 42.186 138.096 43.656C138.096 45.882 137.424 47.814 136.164 49.494C134.862 51.132 133.098 52.266 130.914 52.896V50.124C132.048 49.704 133.014 49.032 133.812 48.108C134.568 47.1 134.904 46.134 134.904 45.126C134.652 45.21 134.316 45.294 133.854 45.294C132.93 45.294 132.174 44.958 131.544 44.328C130.914 43.698 130.62 42.9 130.62 41.976C130.62 40.968 130.956 40.17 131.628 39.582C132.258 38.952 133.098 38.658 134.148 38.658ZM189.462 29.586V34.038C187.236 34.794 184.926 35.466 182.49 36.096V44.622C182.49 47.394 181.02 48.822 178.08 48.822H173.334L172.368 44.664C173.838 44.832 175.224 44.916 176.568 44.916C177.534 44.916 178.038 44.412 178.038 43.488V37.146C175.602 37.65 173.124 38.112 170.52 38.532L169.89 34.122C172.746 33.702 175.476 33.198 178.038 32.652V25.428H169.848V21.228H178.038V17.322C176.022 17.742 173.964 18.078 171.78 18.372L170.856 14.214C176.652 13.584 181.86 12.366 186.396 10.518L187.908 14.634C186.186 15.264 184.38 15.81 182.49 16.314V21.228H191.1C190.848 17.994 190.764 14.424 190.764 10.56H195.174C195.216 14.592 195.342 18.12 195.594 21.228H208.152V25.428H195.93C196.182 28.158 196.56 30.384 197.022 32.148C197.19 32.82 197.358 33.408 197.526 33.996C199.248 31.854 200.76 29.46 202.02 26.856L205.8 28.872C203.952 32.652 201.726 35.97 199.164 38.742C199.584 39.75 200.046 40.632 200.508 41.304C201.684 43.152 202.608 44.076 203.196 44.076C203.658 44.076 204.12 41.934 204.624 37.734L208.53 39.792C207.438 45.798 205.884 48.822 203.826 48.822C201.978 48.822 200.046 47.562 198.072 45.084C197.316 44.118 196.602 43.026 195.972 41.766C193.116 44.118 189.924 45.966 186.438 47.31L184.002 43.572C187.866 42.144 191.268 40.128 194.166 37.524C193.704 36.18 193.284 34.794 192.906 33.366C192.276 31.098 191.814 28.452 191.478 25.428H182.49V31.644C184.926 31.014 187.278 30.342 189.462 29.586ZM199.794 10.938C202.734 12.786 205.254 14.634 207.354 16.482L204.204 19.632C202.482 17.784 200.046 15.852 196.854 13.752L199.794 10.938ZM244.104 49.032H240.408L239.232 44.916L243.222 45.042C244.23 45.042 244.734 44.37 244.734 43.026V16.986H235.2V12.744H249.102V44.244C249.102 47.436 247.422 49.032 244.104 49.032ZM230.118 10.476C231.966 12.87 233.352 14.97 234.36 16.776L230.916 19.17C229.908 17.154 228.522 14.97 226.758 12.576L230.118 10.476ZM220.836 10.098L224.826 11.988C223.734 15.222 222.348 18.33 220.626 21.312V49.452H216.258V27.57C215.124 28.956 213.906 30.3 212.646 31.644L211.218 27.15C215.544 22.32 218.736 16.65 220.836 10.098ZM224.49 17.616H228.816V49.368H224.49V17.616ZM280.854 32.904C285.138 38.364 288.414 43.068 290.682 47.1L286.944 49.704C286.314 48.57 285.642 47.436 284.97 46.302C275.31 47.142 266.154 47.814 257.502 48.276L256.788 44.706C260.19 42.9 263.634 38.616 267.162 31.854H254.142V27.57H270.774V21.06H256.746V16.818H270.774V10.602H275.226V16.818H289.17V21.06H275.226V27.57H291.816V31.854H272.076C269.472 37.23 266.826 41.304 264.222 44.16C272.748 43.572 278.88 43.068 282.66 42.648C281.064 40.254 279.3 37.776 277.326 35.172L280.854 32.904ZM306.894 13.668V42.522H300.678V45.966H296.814V13.668H306.894ZM300.678 38.826H303.114V17.448H300.678V38.826ZM308.196 21.48H310.506V15.894H308.154V12.03H320.46C320.46 28.83 320.292 39.162 320.04 43.026C319.704 46.932 318.276 48.906 315.714 48.906C315.168 48.906 314.244 48.822 312.984 48.654L312.06 44.916C313.194 45 314.16 45.084 315 45.084C315.84 45.084 316.302 43.866 316.47 41.43C316.512 40.38 316.554 38.196 316.596 34.92H313.53C312.69 40.926 311.094 45.63 308.658 48.99L305.592 46.344C307.608 43.572 309.036 39.75 309.792 34.92H308.112V31.056H310.254C310.38 29.25 310.464 27.36 310.506 25.344H308.196V21.48ZM316.638 31.056V25.344H314.16C314.118 27.36 314.034 29.25 313.908 31.056H316.638ZM316.638 21.48C316.638 19.716 316.638 17.826 316.68 15.894H314.16V21.48H316.638ZM322.308 11.988H333.732V15.138C333.06 18.75 332.22 22.488 331.296 26.436C333.06 30.468 334.068 33.912 334.236 36.852C334.236 39.288 333.9 40.968 333.228 41.976C332.22 43.278 330.456 43.95 328.02 43.992L326.676 39.96C327.852 40.086 328.818 40.17 329.616 40.17C329.868 40.044 330.078 39.792 330.204 39.372C330.288 38.868 330.372 38.028 330.372 36.852C330.372 33.912 329.406 30.636 327.474 27.024C328.566 22.824 329.364 19.044 329.91 15.684H326.172V49.284H322.308V11.988ZM346.962 14.424C349.692 14.424 351.918 15.138 353.598 16.65C355.278 18.12 356.118 20.136 356.118 22.698C356.118 24.798 355.572 26.52 354.564 27.864C354.186 28.284 352.968 29.418 350.952 31.182C350.196 31.812 349.65 32.526 349.272 33.282C348.852 34.122 348.642 35.004 348.642 36.012V36.6H343.812V36.012C343.812 34.416 344.064 33.03 344.652 31.896C345.198 30.762 346.836 28.998 349.566 26.562L350.07 25.974C350.826 25.05 351.204 24.042 351.204 22.992C351.204 21.606 350.784 20.514 350.028 19.716C349.23 18.918 348.096 18.54 346.668 18.54C344.82 18.54 343.518 19.086 342.72 20.262C342.006 21.228 341.67 22.614 341.67 24.378H336.882C336.882 21.27 337.764 18.834 339.612 17.07C341.418 15.306 343.854 14.424 346.962 14.424ZM346.206 38.658C347.13 38.658 347.928 38.952 348.558 39.54C349.146 40.128 349.482 40.884 349.482 41.808C349.482 42.732 349.146 43.53 348.516 44.118C347.886 44.706 347.13 45 346.206 45C345.282 45 344.526 44.664 343.896 44.076C343.266 43.488 342.972 42.732 342.972 41.808C342.972 40.884 343.266 40.128 343.896 39.54C344.526 38.952 345.282 38.658 346.206 38.658Z" fill="#687949"/>
            <defs>
                <clipPath id="clip0_5036_9983">
                    <rect width="87" height="87" fill="white" transform="translate(372 23)"/>
                </clipPath>
            </defs>
        </svg>
    );
};

function App() {

    return (
        <>
            <Router>
                <div className="flex min-h-screen flex-col">
                    <GridBg>
                        <MainContent />
                    </GridBg>
                </div>
                <Analytics />
            </Router>
        </>
    )
}
const MainContent = () => {
    const location = useLocation()
    const isAuthPage = location.pathname === '/auth'
    const isPetInitPage = location.pathname === '/pet-initialization'
    const isTripPlanningPage = location.pathname.startsWith('/trip-themes/') || location.pathname === '/trip-plan' || location.pathname === '/trip-journey' || location.pathname === '/travel-journal'

    return (
        <main className="h-screen w-screen grow">
            {isAuthPage || isPetInitPage ? (
                // 认证页面和初始化页面 - 不显示背景装饰和Dock
                <div className="w-full h-screen">
                    <Routes>
                        {/* 公共路由 */}
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        
                        {/* 认证路由 - 只有未登录用户可以访问 */}
                        <Route path="/auth" element={
                            <GuestRoute>
                                <AuthView />
                            </GuestRoute>
                        } />
                        
                        {/* 宠物初始化路由 - 只有已登录用户可以访问 */}
                        <Route path="/pet-initialization" element={
                            <ProtectedRoute>
                                <PetInitializationView />
                            </ProtectedRoute>
                        } />
                        
                        {/* 受保护的路由 - 需要登录才能访问 */}
                        <Route path="/home" element={
                            <ProtectedRoute>
                                <HomeView />
                            </ProtectedRoute>
                        } />
                        <Route path="/setting" element={
                            <ProtectedRoute>
                                <SettingView />
                            </ProtectedRoute>
                        } />
                        <Route path="/test" element={
                            <ProtectedRoute>
                                <SampleTestView />
                            </ProtectedRoute>
                        } />
                        <Route path="/sample/:id" element={
                            <ProtectedRoute>
                                <SampleDetailView />
                            </ProtectedRoute>
                        } />
                        <Route path="/map-test" element={
                            <ProtectedRoute>
                                <MapTestView />
                            </ProtectedRoute>
                        } />
                        
                        {/* 旅行规划路由 */}
                        <Route path="/trip-themes/:cityId" element={
                            <ProtectedRoute>
                                <TripThemesView />
                            </ProtectedRoute>
                        } />
                        <Route path="/trip-plan" element={
                            <ProtectedRoute>
                                <TripPlanView />
                            </ProtectedRoute>
                        } />
                        <Route path="/trip-journey" element={
                            <ProtectedRoute>
                                <TripJourneyView />
                            </ProtectedRoute>
                        } />
                        <Route path="/travel-journal" element={<TravelJournalView />} />
                    </Routes>
                    <div><Toaster position="top-center" /></div>
                </div>
            ) : (
                // 其他页面 - 显示完整的布局
                <div className="fixed inset-0 flex justify-center  bg-[#f4f4f4] dark:bg-[#303133] bg-dot-black/[0.5] dark:bg-dot-white/[0.5]">
                    <div className=" pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-[#f4f4f4] dark:bg-[#303133] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_30%,white)] "></div>
                    <div className="flex w-full  h-screen z-10 overflow-y-auto">
                        <div
                            className="ring-1 ring-zinc-100 dark:ring-zinc-400/20 w-full bg-transparent">
                            <Routes>
                                {/* 公共路由 */}
                                <Route path="/" element={<Navigate to="/home" replace />} />
                                
                                {/* 认证路由 - 只有未登录用户可以访问 */}
                                <Route path="/auth" element={
                                    <GuestRoute>
                                        <AuthView />
                                    </GuestRoute>
                                } />
                                
                                {/* 宠物初始化路由 - 只有已登录用户可以访问 */}
                                <Route path="/pet-initialization" element={
                                    <ProtectedRoute>
                                        <PetInitializationView />
                                    </ProtectedRoute>
                                } />
                                
                                {/* 受保护的路由 - 需要登录才能访问 */}
                                <Route path="/home" element={
                                    <ProtectedRoute>
                                        <HomeView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/setting" element={
                                    <ProtectedRoute>
                                        <SettingView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test" element={
                                    <ProtectedRoute>
                                        <SampleTestView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/sample/:id" element={
                                    <ProtectedRoute>
                                        <SampleDetailView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/map-test" element={
                                    <ProtectedRoute>
                                        <MapTestView />
                                    </ProtectedRoute>
                                } />
                                
                                {/* 旅行规划路由 */}
                                <Route path="/trip-themes/:cityId" element={
                                    <ProtectedRoute>
                                        <TripThemesView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/trip-plan" element={
                                    <ProtectedRoute>
                                        <TripPlanView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/trip-journey" element={
                                    <ProtectedRoute>
                                        <TripJourneyView />
                                    </ProtectedRoute>
                                } />
                                <Route path="/travel-journal" element={<TravelJournalView />} />
                            </Routes>
                        </div>
                    </div>
                    <div><Toaster position="top-center" /></div>
                    <DockObject />
                    {/* 开始旅行按钮 - 在旅行规划页面隐藏 */}
                    {!isTripPlanningPage && <StartTripButton />}
                </div>
            )}
        </main>
    )
}
export default App
