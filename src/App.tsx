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
import CitySelectionView from '@/view/CitySelectionView';
import TripThemesView from '@/view/TripThemesView';
import TripPlanView from '@/view/TripPlanView';
import TripJourneyView from '@/view/TripJourneyView';

// 开始旅行按钮组件
const StartTripButton = () => {
    const navigate = useNavigate()
    
    const handleStartTrip = () => {
        // 导航到城市选择页面
        navigate('/city-selection')
    };

    return (
        <button
            onClick={handleStartTrip}
            className="fixed bottom-24 right-6 z-50 group"
            aria-label="开始旅行"
        >
            <div className="relative">
                {/* 主按钮 */}
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group-hover:from-blue-600 group-hover:to-green-600">
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                    >
                        <path 
                            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        <path 
                            d="M14 2V8H20" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        <path 
                            d="M16 13H8" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        <path 
                            d="M16 17H8" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        <path 
                            d="M10 9H9H8" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                
                {/* 波纹效果 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 animate-ping opacity-20"></div>
                
                {/* 文字标签 - 悬停时显示 */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                        开始旅行
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
                    </div>
                </div>
            </div>
        </button>
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
    const isTripPlanningPage = location.pathname === '/city-selection' || location.pathname.startsWith('/trip-themes/') || location.pathname === '/trip-plan' || location.pathname === '/trip-journey'

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
                        <Route path="/city-selection" element={
                            <ProtectedRoute>
                                <CitySelectionView />
                            </ProtectedRoute>
                        } />
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
                                <Route path="/city-selection" element={
                                    <ProtectedRoute>
                                        <CitySelectionView />
                                    </ProtectedRoute>
                                } />
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
