// packages/shared/src/utils/effects.ts
import type {
  EffectContext,
  EffectResult,
  DamageEvent,
  FollowerInstance
} from '../types/follower'
import { getCurrentStats } from './follower'

/**
 * 默认攻击效果
 * 对随机敌人造成等同于攻击力的物理伤害
 */
export function defaultOnAttack(ctx: EffectContext): EffectResult {
  const stats = getCurrentStats(ctx.self)
  const target = ctx.tools.getRandomEnemy(ctx.gameState, ctx.self.position)
  
  if (!target) {
    return { gameState: ctx.gameState }
  }
  
  return {
    gameState: ctx.gameState,
    events: [{
      type: 'damage',
      targets: [target],
      value: stats.attack,
      damageType: 'physical',
      source: ctx.self
    }] as DamageEvent[]
  }
}

/**
 * 默认受伤效果
 * 处理护盾消耗和扣血
 */
export function defaultOnTakeDamage(ctx: EffectContext): EffectResult {
  const newState = ctx.tools.cloneDeep(ctx.gameState)
  const damageEvent = ctx.event as { type: 'damage'; value: number } | undefined
  
  if (!damageEvent) {
    return { gameState: newState }
  }
  
  // 在 newState 中找到自己
  const gameState = newState as { allies?: FollowerInstance[]; enemies?: FollowerInstance[] }
  const allies = gameState.allies
  const enemies = gameState.enemies
  
  let self: FollowerInstance | undefined
  if (allies) {
    self = allies.find(f => f.instanceId === ctx.self.instanceId)
  }
  if (!self && enemies) {
    self = enemies.find(f => f.instanceId === ctx.self.instanceId)
  }
  
  if (!self) {
    return { gameState: newState }
  }
  
  // 护盾处理
  const shieldStatus = self.statusList.find(s => s.shield && s.shield > 0)
  if (shieldStatus) {
    shieldStatus.shield!--
    if (shieldStatus.shield === 0) {
      self.statusList = self.statusList.filter(s => s !== shieldStatus)
    }
    return { gameState: newState }
  }
  
  // 扣血
  self.currentHealth -= damageEvent.value
  
  return { gameState: newState }
}
