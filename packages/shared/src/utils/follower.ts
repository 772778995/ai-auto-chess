// packages/shared/src/utils/follower.ts
import type { FollowerInstance, StatusItem } from '../types/follower'

/**
 * 计算随从当前属性
 */
export function getCurrentStats(follower: FollowerInstance) {
  const statusTotal = follower.statusList.reduce(
    (acc, s) => ({
      attack: acc.attack + (s.attack ?? 0),
      health: acc.health + (s.health ?? 0),
      shield: acc.shield + (s.shield ?? 0),
      damageBonus: acc.damageBonus + (s.damageBonus ?? 0)
    }),
    { attack: 0, health: 0, shield: 0, damageBonus: 0 }
  )

  return {
    attack: follower.baseAttack + statusTotal.attack,
    maxHealth: follower.baseHealth + statusTotal.health,
    shield: statusTotal.shield,
    damageBonus: statusTotal.damageBonus,
    currentHealth: follower.currentHealth
  }
}

/**
 * 清除临时状态
 */
export function clearTemporaryStatus(follower: FollowerInstance): FollowerInstance {
  return {
    ...follower,
    statusList: follower.statusList.filter(s => s.permanent)
  }
}

/**
 * 添加状态项
 */
export function addStatus(
  follower: FollowerInstance,
  status: Omit<StatusItem, 'source'> & { source: string }
): FollowerInstance {
  return {
    ...follower,
    statusList: [...follower.statusList, status as StatusItem]
  }
}

/**
 * 计算生命上限
 */
export function getMaxHealth(follower: FollowerInstance): number {
  return follower.baseHealth + 
    follower.statusList.reduce((sum, s) => sum + (s.health ?? 0), 0)
}

/**
 * 检查是否死亡
 */
export function isDead(follower: FollowerInstance): boolean {
  return follower.currentHealth <= 0
}
