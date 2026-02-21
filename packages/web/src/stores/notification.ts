import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
  title?: string
  visible?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([])

  // Actions
  function add(typeOrObj: Notification['type'] | Partial<Notification>, messageOrDuration?: string | number, duration?: number) {
    // Handle object form: add({ type: 'success', message: '...', title: '...' })
    if (typeof typeOrObj === 'object') {
      return addNotification(typeOrObj.type || 'info', typeOrObj.message || '', typeOrObj.duration)
    }
    // Handle legacy form: add('success', 'message', 5000)
    return addNotification(typeOrObj, messageOrDuration as string || '', duration ?? 5000)
  }

  function remove(id: string) {
    removeNotification(id)
  }

  function addNotification(type: Notification['type'], message: string, duration = 5000) {
    const id = Math.random().toString(36).substring(2, 9)
    const notification: Notification = { id, type, message, duration }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return addNotification('success', message, duration)
  }

  function error(message: string, duration?: number) {
    return addNotification('error', message, duration)
  }

  function warning(message: string, duration?: number) {
    return addNotification('warning', message, duration)
  }

  function info(message: string, duration?: number) {
    return addNotification('info', message, duration)
  }

  return {
    // State
    notifications,
    // Actions
    add,
    remove,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  }
})