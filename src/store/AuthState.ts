import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// 用户信息接口
export interface User {
  id: string
  username: string
  phoneNumber?: string
  lastLogin?: string
  isInitialized?: boolean
  petInfo?: any
}

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
  error: string | null
}

// 登录表单接口
export interface LoginForm {
  username: string
  password: string
}

// 注册表单接口
export interface RegisterForm {
  username: string
  password: string
  phoneNumber?: string
}

// 认证状态atom（持久化存储）
export const authStateAtom = atomWithStorage<AuthState>('authState', {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
})

// 登录表单atom
export const loginFormAtom = atom<LoginForm>({
  username: '',
  password: '',
})

// 注册表单atom
export const registerFormAtom = atom<RegisterForm>({
  username: '',
  password: '',
  phoneNumber: '',
})

// 认证加载状态atom
export const authLoadingAtom = atom(
  (get) => get(authStateAtom).loading,
  (get, set, loading: boolean) => {
    const currentState = get(authStateAtom)
    set(authStateAtom, { ...currentState, loading })
  }
)

// 认证错误状态atom
export const authErrorAtom = atom(
  (get) => get(authStateAtom).error,
  (get, set, error: string | null) => {
    const currentState = get(authStateAtom)
    set(authStateAtom, { ...currentState, error })
  }
)

// 用户信息atom
export const userAtom = atom(
  (get) => get(authStateAtom).user,
  (get, set, user: User | null) => {
    const currentState = get(authStateAtom)
    set(authStateAtom, { 
      ...currentState, 
      user,
      isAuthenticated: !!user
    })
  }
)

// 访问令牌atom
export const accessTokenAtom = atom(
  (get) => get(authStateAtom).accessToken,
  (get, set, accessToken: string | null) => {
    const currentState = get(authStateAtom)
    set(authStateAtom, { ...currentState, accessToken })
  }
)

// 登出操作atom
export const logoutAtom = atom(
  null,
  (_get, set) => {
    set(authStateAtom, {
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      error: null,
    })
    // 清除本地存储
    localStorage.removeItem('authState')
  }
)

// 设置认证数据atom
export const setAuthDataAtom = atom(
  null,
  (_get, set, authData: { user: User; accessToken: string; refreshToken: string }) => {
    set(authStateAtom, {
      isAuthenticated: true,
      user: authData.user,
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      loading: false,
      error: null,
    })
  }
)

// 更新用户信息atom
export const updateUserAtom = atom(
  null,
  (get, set, updates: Partial<User>) => {
    const currentState = get(authStateAtom)
    if (currentState.user) {
      set(authStateAtom, {
        ...currentState,
        user: { ...currentState.user, ...updates }
      })
    }
  }
)

// 用户是否已完成初始化atom
export const isUserInitializedAtom = atom(
  (get) => {
    const user = get(authStateAtom).user
    return user?.isInitialized ?? false
  }
) 