import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  // State
  const isInGame = ref(false)
  const isConnected = ref(false)
  const playerCount = ref(0)
  const fps = ref(0)
  const gameState = ref<any>(null)
  const roomId = ref<string | null>(null)
  const playerId = ref<string | null>(null)
  const activeRooms = ref(0)
  const totalMatches = ref(0)

  // Getters
  const isPlaying = computed(() => isInGame.value && gameState.value !== null)

  // Actions
  function startGame() {
    isInGame.value = true
  }

  function endGame() {
    isInGame.value = false
    gameState.value = null
    roomId.value = null
    playerId.value = null
  }

  function updateGameState(state: any) {
    gameState.value = state
    if (state?.playerCount !== undefined) {
      playerCount.value = state.playerCount
    }
  }

  function setFps(value: number) {
    fps.value = value
  }

  function joinRoom(id: string, pid: string) {
    roomId.value = id
    playerId.value = pid
    isInGame.value = true
  }

  function leaveRoom() {
    roomId.value = null
    playerId.value = null
    isInGame.value = false
    gameState.value = null
  }

  function initialize() {
    console.log('Game store initialized')
  }

  function destroy() {
    // Cleanup when leaving
    isInGame.value = false
    isConnected.value = false
    playerCount.value = 0
    fps.value = 0
    gameState.value = null
    roomId.value = null
    playerId.value = null
  }

  return {
    // State
    isInGame,
    isConnected,
    playerCount,
    fps,
    gameState,
    roomId,
    playerId,
    activeRooms,
    totalMatches,
    // Getters
    isPlaying,
    // Actions
    initialize,
    destroy,
    startGame,
    endGame,
    updateGameState,
    setFps,
    joinRoom,
    leaveRoom,
  }
})