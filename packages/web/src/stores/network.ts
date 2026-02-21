import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export const useNetworkStore = defineStore('network', () => {
  // State
  const status = ref<ConnectionStatus>('disconnected')
  const latency = ref(0)
  const lastError = ref<string | null>(null)

  // Actions
  function setConnected() {
    status.value = 'connected'
    lastError.value = null
  }

  function setDisconnected() {
    status.value = 'disconnected'
  }

  function setConnecting() {
    status.value = 'connecting'
  }

  function setError(error: string) {
    status.value = 'error'
    lastError.value = error
  }

  function setLatency(ms: number) {
    latency.value = ms
  }

  function connect() {
    setConnecting()
    // TODO: Implement WebSocket connection
    setTimeout(() => {
      // Simulate connection for demo
      // setConnected()
    }, 1000)
  }

  function disconnect() {
    setDisconnected()
  }

  return {
    // State
    status,
    latency,
    lastError,
    // Actions
    setConnected,
    setDisconnected,
    setConnecting,
    setError,
    setLatency,
    connect,
    disconnect,
  }
})