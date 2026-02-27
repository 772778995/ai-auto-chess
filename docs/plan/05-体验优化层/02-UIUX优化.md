# 05.2 UI/UX 优化

## 目标

实现拖拽交互反馈、卡牌详情弹窗、响应式布局。

## 1. 拖拽反馈

```vue
<template>
  <div
    _transition="all duration-200"
    :class="{
      'scale-105 shadow-lg': isDragging,
      'ring-2 ring-green-500': isDragOver,
      'opacity-50': isDisabled
    }"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- 内容 -->
  </div>
</template>
```

## 2. 响应式布局

```css
/* 横屏为主，支持移动端 */
@media (max-width: 768px) {
  .game-container {
    /* 强制横屏提示 */
  }
}

@media (min-width: 1024px) {
  .game-container {
    /* PC端优化 */
  }
}
```

## 3. 加载状态

```vue
<template>
  <div v-if="loading" _flex="~ center" _h="full">
    <div _animate="spin" _w="8" _h="8" _border="4 blue-500" _rounded="full" />
  </div>
</template>
```

## 验收标准

- [ ] 拖拽有视觉反馈
- [ ] 加载状态显示
- [ ] 错误提示友好
- [ ] 响应式适配

## 依赖关系

依赖 [01-Phaser动画](./01-Phaser动画.md)
