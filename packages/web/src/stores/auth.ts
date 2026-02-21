import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'

interface User {
  id: string
  username: string
  email: string
  displayName?: string
  avatarUrl?: string
  isAdmin: boolean
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData extends LoginCredentials {
  email: string
  displayName?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('game_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const username = computed(() => user.value?.username || 'Guest')
  const userId = computed(() => user.value?.id || '')

  // 登录
  async function login(username: string, password: string) {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.auth.login({ username, password })

      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token

        // 保存 token
        localStorage.setItem('game_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))

        // 广播登录事件
        window.dispatchEvent(new CustomEvent('auth:login', { detail: user.value }))
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  async function register(data: RegisterData) {
    try {
      isLoading.value = true
      error.value = null

      const response = await api.auth.register(data)

      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token

        // 保存 token
        localStorage.setItem('game_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))

        // 广播注册事件
        window.dispatchEvent(new CustomEvent('auth:register', { detail: user.value }))

        return response.data.user
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  async function logout() {
    try {
      if (token.value) {
        await api.auth.logout({ token: token.value })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // 清理本地状态
      user.value = null
      token.value = null
      localStorage.removeItem('game_token')
      localStorage.removeItem('user')

      // 广播登出事件
      window.dispatchEvent(new CustomEvent('auth:logout'))

      // 刷新页面
      window.location.href = '/'
    }
  }

  // 检查认证状态
  async function checkAuth() {
    if (!token.value) {
      user.value = null
      return false
    }

    try {
      const response = await api.auth.me()

      if (response.success && response.data) {
        user.value = response.data
        return true
      } else {
        // Token 无效，清理
        localStorage.removeItem('game_token')
        localStorage.removeItem('user')
        user.value = null
        token.value = null
        return false
      }
    } catch (err) {
      console.error('Auth check error:', err)
      return false
    }
  }

  // 更新用户信息
  async function updateUser(updates: Partial<User>) {
    try {
      const response = await api.auth.update(updates)

      if (response.success && response.data) {
        user.value = { ...user.value, ...response.data }
        localStorage.setItem('user', JSON.stringify(user.value))

        // 广播更新事件
        window.dispatchEvent(new CustomEvent('auth:update', { detail: user.value }))

        return response.data
      } else {
        throw new Error(response.error || 'Update failed')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Update failed'
      throw err
    }
  }

  // 从本地存储初始化
  function initializeFromStorage() {
    const storedToken = localStorage.getItem('game_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        // 解析失败，清理
        localStorage.removeItem('user')
        user.value = null
      }
    }

    // 如果找到 token，检查认证状态
    if (token.value && !user.value) {
      checkAuth()
    }
  }

  // 清理错误
  function clearError() {
    error.value = null
  }

  // 导出
  return {
    // 状态
    user,
    token,
    isLoading,
    error,

    // 计算属性
    isAuthenticated,
    username,
    userId,

    // 方法
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    initializeFromStorage,
    clearError,
  }
})

// 类型导出
export type { User, LoginCredentials, RegisterData }