<template>
  <div _game-container>
    <!-- 导航栏 -->
    <header _bg="game-background" _text="game-foreground" _p="4" _border="b-2 game-accent">
      <div _flex="~" _justify="between" _items="center" _max-w="7xl" _mx="auto">
        <div _flex="~" _items="center" _gap="4">
          <h1 _text="2xl game-accent" _font="game">🎮 Game Project</h1>
          <span _text="sm opacity-70">v0.1.0</span>
        </div>

        <nav _flex="~" _gap="6">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            _text="lg hover:game-accent"
            _transition="colors"
            :class="{ 'text-game-accent': $route.path === link.path }"
          >
            {{ link.name }}
          </router-link>
        </nav>

        <div _flex="~" _items="center" _gap="4">
          <button
            v-if="!authStore.isAuthenticated"
            @click="showLogin = true"
            _game-btn
          >
            Login
          </button>
          <div v-else _flex="~" _items="center" _gap="3">
            <span>{{ authStore.username }}</span>
            <button @click="authStore.logout" _btn-primary>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main _flex="1" _overflow="auto">
      <router-view />
    </main>

    <!-- 游戏画布容器 -->
    <div v-if="gameStore.isInGame" _game-canvas-container>
      <div ref="gameContainer" _absolute="~" _inset="0" />
    </div>

    <!-- 页脚 -->
    <footer _bg="game-background" _text="game-foreground center" _p="4" _border="t-2 game-accent">
      <div _max-w="7xl" _mx="auto">
        <p _text="sm opacity-70">
          Built with Vue 3, Phaser, Hono, Bun & TypeScript
        </p>
        <p _text="xs opacity-50" _mt="2">
          Connection: {{ networkStore.status }} |
          Players: {{ gameStore.playerCount }} |
          FPS: {{ gameStore.fps }}
        </p>
      </div>
    </footer>

    <!-- 登录模态框 -->
    <div
      v-if="showLogin"
      _fixed="~" _inset="0" _bg="black/50"
      _flex-center _z="50"
      @click.self="showLogin = false"
    >
      <div _bg="game-background" _p="8" _rounded="xl" _w="96" _border="2 game-accent">
        <h2 _text="xl game-accent" _font="game" _mb="4">Login</h2>
        <form @submit.prevent="handleLogin" _space-y="4">
          <div>
            <label _block _text="sm" _mb="1">Username</label>
            <input
              v-model="loginForm.username"
              _w="full" _p="2" _bg="white/10"
              _border="1 game-foreground/20" _rounded
              _focus="border-game-accent outline-none"
              type="text"
              required
            />
          </div>
          <div>
            <label _block _text="sm" _mb="1">Password</label>
            <input
              v-model="loginForm.password"
              _w="full" _p="2" _bg="white/10"
              _border="1 game-foreground/20" _rounded
              _focus="border-game-accent outline-none"
              type="password"
              required
            />
          </div>
          <div _flex="~" _justify="end" _gap="3" _pt="4">
            <button type="button" @click="showLogin = false" _btn-primary>
              Cancel
            </button>
            <button type="submit" _game-btn>
              Enter Game
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 通知系统 -->
    <div _fixed="~" _top="4" _right="4" _z="50" _space-y="2">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        _bg="game-background" _p="4" _rounded="lg"
        _border="2" :_border-color="notification.type === 'error' ? 'game-danger' : 'game-accent'"
        _shadow="lg" _max-w="96"
      >
        <div _flex="~" _justify="between" _items="start" _mb="2">
          <span _font="bold" :_text="notification.type === 'error' ? 'game-danger' : 'game-accent'">
            {{ notification.type.toUpperCase() }}
          </span>
          <button @click="notificationStore.remove(notification.id)" _text="lg opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
        <p _text="sm">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useGameStore } from './stores/game'
import { useNetworkStore } from './stores/network'
import { useNotificationStore } from './stores/notification'

// Store
const authStore = useAuthStore()
const gameStore = useGameStore()
const networkStore = useNetworkStore()
const notificationStore = useNotificationStore()

// 引用
const gameContainer = ref<HTMLDivElement>()

// 状态
const showLogin = ref(false)
const loginForm = reactive({
  username: '',
  password: '',
})

// 导航链接
const navLinks = [
  { path: '/', name: 'Home' },
  { path: '/game', name: 'Game' },
  { path: '/rooms', name: 'Rooms' },
  { path: '/leaderboard', name: 'Leaderboard' },
  { path: '/settings', name: 'Settings' },
]

// 登录处理
async function handleLogin() {
  try {
    await authStore.login(loginForm.username, loginForm.password)
    showLogin.value = false
    loginForm.username = ''
    loginForm.password = ''

    notificationStore.add({
      title: 'Welcome!',
      message: `Welcome back, ${authStore.username}!`,
      type: 'success',
    })
  } catch (error) {
    notificationStore.add({
      title: 'Login Failed',
      message: error instanceof Error ? error.message : 'Authentication failed',
      type: 'error',
    })
  }
}

// 初始化游戏
onMounted(() => {
  // 初始化网络连接
  networkStore.connect()

  // 如果已认证，初始化游戏
  if (authStore.isAuthenticated) {
    gameStore.initialize()
  }
})

// 清理
onUnmounted(() => {
  networkStore.disconnect()
  gameStore.destroy()
})

// 监听认证状态变化
// 这里可以添加更多的监听逻辑
</script>

<style>
/* 全局样式 */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: #f59e0b;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d97706;
}

/* 路由过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>