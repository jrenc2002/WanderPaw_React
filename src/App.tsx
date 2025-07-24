import {
    HashRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation,
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

    return (
        <main className="h-screen w-screen grow">
            {isAuthPage ? (
                // 认证页面 - 不显示背景装饰和Dock
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
                            </Routes>
                        </div>
                    </div>
                    <div><Toaster position="top-center" /></div>
                    <DockObject />
                </div>
            )}
        </main>
    )
}
export default App
