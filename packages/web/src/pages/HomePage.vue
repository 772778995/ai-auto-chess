<template>
  <div _flex-col-center _p="8" _min-h="screen">
    <div _max-w="4xl" _w="full" _space-y="8">
      <!-- Hero 区域 -->
      <div _text="center" _space-y="6">
        <h1 _text="6xl game-accent" _font="game" _leading="tight">
          🎮 Game Project
        </h1>
        <p _text="xl opacity-90" _max-w="2xl" _mx="auto">
          A modern full-stack game built with Vue 3, Phaser, Hono.js, and Bun
        </p>
        <div _flex="~ wrap" _justify="center" _gap="4" _mt="8">
          <button
            v-if="!authStore.isAuthenticated"
            @click="showLogin = true"
            _game-btn _text="xl"
          >
            Start Playing
          </button>
          <router-link
            v-else
            to="/game"
            _game-btn _text="xl"
          >
            Enter Game
          </router-link>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            _btn-primary _text="xl"
          >
            View Source
          </a>
        </div>
      </div>

      <!-- 特性展示 -->
      <div _grid="~ cols-1 md:cols-3" _gap="8" _mt="12">
        <div
          v-for="feature in features"
          :key="feature.title"
          _bg="white/5" _p="6" _rounded="xl" _border="2 game-accent/20"
          _hover="border-game-accent shadow-lg" _transition="all"
        >
          <div _text="4xl game-accent" _mb="4">{{ feature.icon }}</div>
          <h3 _text="xl" _font="bold" _mb="2">{{ feature.title }}</h3>
          <p _text="sm opacity-80">{{ feature.description }}</p>
        </div>
      </div>

      <!-- 技术栈 -->
      <div _mt="12">
        <h2 _text="2xl bold center" _mb="6">Tech Stack</h2>
        <div _flex="~ wrap" _justify="center" _gap="4">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            _bg="white/5" _px="4" _py="2" _rounded="full"
            _border="1 game-foreground/20"
            _flex="~" _items="center" _gap="2"
          >
            <span _text="lg">{{ tech.icon }}</span>
            <span>{{ tech.name }}</span>
          </div>
        </div>
      </div>

      <!-- 游戏统计 -->
      <div
        v-if="gameStore.isConnected"
        _bg="game-background" _p="6" _rounded="xl" _border="2 game-accent"
        _mt="8"
      >
        <div _grid="~ cols-2 md:cols-4" _gap="4" _text="center">
          <div>
            <div _text="3xl game-accent" _font="game">{{ stats.players }}</div>
            <div _text="sm opacity-70">Online Players</div>
          </div>
          <div>
            <div _text="3xl game-accent" _font="game">{{ stats.rooms }}</div>
            <div _text="sm opacity-70">Active Rooms</div>
          </div>
          <div>
            <div _text="3xl game-accent" _font="game">{{ stats.matches }}</div>
            <div _text="sm opacity-70">Matches Today</div>
          </div>
          <div>
            <div _text="3xl game-accent" _font="game">{{ stats.uptime }}%</div>
            <div _text="sm opacity-70">Server Uptime</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'

// Store
const authStore = useAuthStore()
const gameStore = useGameStore()

// 状态
const showLogin = ref(false)

// 特性列表
const features = [
  {
    icon: '⚡',
    title: 'Real-time Gameplay',
    description: 'Low-latency multiplayer with WebSocket and efficient state synchronization',
  },
  {
    icon: '🎨',
    title: 'Modern UI/UX',
    description: 'Beautiful interface with Vue 3, UnoCSS, and smooth animations',
  },
  {
    icon: '🔧',
    title: 'Developer Friendly',
    description: 'Full TypeScript support, hot reload, and comprehensive tooling',
  },
]

// 技术栈
const techStack = [
  { name: 'Vue 3', icon: '🟢' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Phaser', icon: '🎮' },
  { name: 'Hono.js', icon: '⚡' },
  { name: 'Bun', icon: '🐰' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'UnoCSS', icon: '🎨' },
  { name: 'WebSocket', icon: '🔌' },
]

// 游戏统计
const stats = computed(() => ({
  players: gameStore.playerCount || 0,
  rooms: gameStore.activeRooms || 0,
  matches: gameStore.totalMatches || 1234,
  uptime: 99.9,
}))

// 页面初始化
import { onMounted } from 'vue'

onMounted(() => {
  // 可以在这里加载额外的初始化数据
})
</script>

<style scoped>
/* 页面特定样式 */
.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.tech-badge {
  backdrop-filter: blur(10px);
}
</style>