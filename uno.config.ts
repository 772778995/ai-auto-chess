import { defineConfig, presetAttributify, presetUno } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // 只匹配带前缀的属性
  presets: [
    presetAttributify({
      prefix: '_',
      prefixedOnly: true, // 只匹配带有 _ 前缀的属性
      strict: true, // 必须提供值
    }),
    presetUno(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  // 自定义规则
  rules: [
    // 可以添加一些游戏相关的自定义规则
    ['_game-container', { display: 'flex', 'flex-direction': 'column', height: '100vh' }],
    ['_game-canvas-container', { flex: '1', position: 'relative', overflow: 'hidden' }],
  ],
  // 主题配置
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      game: {
        background: '#0f172a',
        foreground: '#f8fafc',
        accent: '#f59e0b',
        danger: '#ef4444',
        success: '#10b981',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
      game: ['"Press Start 2P"', 'cursive'],
    },
  },
  // 快捷方式
  shortcuts: {
    'btn-primary': 'px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600',
    'game-btn': 'px-6 py-3 bg-game-accent text-game-background font-game rounded-none border-2 border-game-foreground',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
  },
})