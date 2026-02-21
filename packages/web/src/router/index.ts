import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入组件
const HomePage = () => import('@/pages/HomePage.vue')
const GamePage = () => import('@/pages/GamePage.vue')
const RoomsPage = () => import('@/pages/RoomsPage.vue')
const LeaderboardPage = () => import('@/pages/LeaderboardPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

// 路由守卫
import { useAuthStore } from '@/stores/auth'

// 路由定义
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Home - Game Project',
      requiresAuth: false,
    },
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage,
    meta: {
      title: 'Game - Play Now',
      requiresAuth: true,
    },
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: RoomsPage,
    meta: {
      title: 'Game Rooms',
      requiresAuth: true,
    },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardPage,
    meta: {
      title: 'Leaderboard',
      requiresAuth: false,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: {
      title: 'Settings',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: {
      title: 'Page Not Found',
      requiresAuth: false,
    },
  },
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 保存目标路由，登录后跳转
    next({
      name: 'home',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 如果已登录但访问登录页，重定向到首页
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 可以在这里添加分析跟踪等
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

// 导航错误处理
router.onError((error) => {
  console.error('Router error:', error)
  // 可以在这里显示错误通知
})

export default routes