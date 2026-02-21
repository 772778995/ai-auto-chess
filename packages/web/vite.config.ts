import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      presets: [
        presetAttributify({
          prefix: '_',
          prefixedOnly: true,
          strict: true,
        }),
        presetUno(),
      ],
      transformers: [
        transformerVariantGroup(),
        transformerDirectives(),
      ],
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
      shortcuts: {
        'btn-primary': 'px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600',
        'game-btn': 'px-6 py-3 bg-game-accent text-game-background font-game rounded-none border-2 border-game-foreground',
        'flex-center': 'flex justify-center items-center',
        'flex-col-center': 'flex flex-col justify-center items-center',
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@game/shared': resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 3002,
    host: true,
    // 禁用 HMR，使用传统的页面刷新
    hmr: false,
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true,
      },
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          phaser: ['phaser'],
          game: ['@game/shared', 'jsondiffpatch', 'msgpackr'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'phaser'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
})