import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import 'uno.css'
import '@unocss/reset/tailwind.css'

// 导入根组件
import App from './App.vue'

// 导入样式
import './styles/main.css'

// 导入路由
import routes from './router'

// 创建 Vue 应用
const app = createApp(App)

// 创建 Pinia 状态管理
const pinia = createPinia()
app.use(pinia)

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err, instance, info)
  // 可以在这里发送错误日志到服务器
}

// 挂载应用
app.mount('#app')

// 开发环境日志
if (import.meta.env.DEV) {
  console.log('🎮 Game client started in development mode')
  console.log('📝 Environment:', import.meta.env.MODE)
  console.log('🔗 API:', import.meta.env.VITE_API_URL || '/api')
  console.log('🔌 WebSocket:', import.meta.env.VITE_WS_URL || '/ws')
}

// 导出应用实例（用于测试）
export { app, router, pinia }