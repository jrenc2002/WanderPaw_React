import React, { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import {
  petStateAtom,
  currentStepAtom,
  petInfoAtom,
  nextStepAtom,
  previousStepAtom,
  isInitializationCompletedAtom,
  isInitializationSkippedAtom,
  type InitializationStep,
  type PetInfo,
} from '@/store/PetState'

import { authStateAtom, updateUserAtom } from '@/store/AuthState'
import { PetService } from '@/services/petService'

// 步骤组件
import { PetTypeSelection } from '@/components/pet/PetTypeSelection'
import { PetDetailsForm } from '@/components/pet/PetDetailsForm'
import { PetPersonalitySelection } from '@/components/pet/PetPersonalitySelection'
import { PetInitializationConfirmation } from '@/components/pet/PetInitializationConfirmation'

export const PetInitializationView: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  // 状态管理
  const [petState] = useAtom(petStateAtom)
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [petInfo, setPetInfo] = useAtom(petInfoAtom)
  const [, setNext] = useAtom(nextStepAtom)
  const [, setPrevious] = useAtom(previousStepAtom)
  const [, setCompleted] = useAtom(isInitializationCompletedAtom)
  const [, setSkipped] = useAtom(isInitializationSkippedAtom)
  
  // 认证状态
  const [authState] = useAtom(authStateAtom)
  const [, updateUser] = useAtom(updateUserAtom)

  // 步骤信息
  const steps = [
    { key: 'type', title: '选择宠物类型', description: '告诉我们您的宠物伙伴' },
    { key: 'details', title: '宠物详情', description: '分享更多关于宠物的信息' },
    { key: 'personality', title: '性格特征', description: '描述宠物的个性' },
    { key: 'confirmation', title: '确认信息', description: '检查并完成设置' },
  ]

  const currentStepIndex = steps.findIndex(step => step.key === currentStep)

  // 处理下一步
  const handleNext = () => {
    // 验证当前步骤
    if (!validateCurrentStep()) {
      return
    }
    
    setNext()
  }

  // 处理上一步
  const handlePrevious = () => {
    setPrevious()
  }

  // 验证当前步骤
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'type':
        if (!petInfo.type) {
          toast.error('请选择宠物类型')
          return false
        }
        return true
      
      case 'details':
        if (petInfo.type !== 'none' && !petInfo.name?.trim()) {
          toast.error('请输入宠物名字')
          return false
        }
        return true
      
      case 'personality':
        if (petInfo.type !== 'none' && (!petInfo.personality || petInfo.personality.length === 0)) {
          toast.error('请至少选择一个性格特征')
          return false
        }
        return true
      
      default:
        return true
    }
  }

  // 处理跳过
  const handleSkip = () => {
    setSkipped(true)
    setCompleted(false)
    toast.success('已跳过宠物信息设置，您可以稍后在设置中完成')
    navigate('/home')
  }

  // 处理完成初始化
  const handleComplete = async () => {
    if (!authState.accessToken) {
      toast.error('请先登录')
      return
    }

    setLoading(true)
    
    try {
      const response = await PetService.initializePetInfo(petInfo, authState.accessToken)
      
      // 更新用户状态
      updateUser({
        isInitialized: true,
        petInfo: petInfo,
      })
      
      setCompleted(true)
      setSkipped(false)
      
      toast.success('宠物信息设置完成！欢迎来到WanderPaw！')
      navigate('/home')
    } catch (error: any) {
      toast.error(error.message || '初始化失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 渲染当前步骤组件
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'type':
        return <PetTypeSelection />
      case 'details':
        return <PetDetailsForm />
      case 'personality':
        return <PetPersonalitySelection />
      case 'confirmation':
        return <PetInitializationConfirmation />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative flex flex-col min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        
        {/* 顶部品牌区域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">🐾</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            欢迎来到 WanderPaw
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            让我们了解一下您的宠物伙伴
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index <= currentStepIndex
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {steps[currentStepIndex]?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStepIndex]?.description}
            </p>
          </div>
        </div>

        {/* 步骤内容 */}
        <div className="flex-1 max-w-2xl mx-auto w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            {renderCurrentStep()}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="max-w-2xl mx-auto w-full mt-8">
          <div className="flex justify-between items-center">
            <div>
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← 上一步
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSkip}
                className="px-6 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                跳过设置
              </button>

              {currentStep === 'confirmation' ? (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '完成中...' : '完成设置'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  下一步 →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 样式定义 */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 