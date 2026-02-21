<script setup lang="ts">
// Game page - TODO: Implement game canvas
</script>

<template>
  <div _flex-col-center _p="8" _min-h="screen" _bg="game-background" _text="game-foreground">
    <h1 _text="4xl" _font="game" _mb="8">Game Canvas</h1>
    <p>Game area - Phaser canvas will be rendered here</p>
    <div _mt="8" _p="8" _border="2 game-foreground" _rounded="lg">
      <p _opacity-70>Waiting for game to initialize...</p>
    </div>
  </div>
</template>