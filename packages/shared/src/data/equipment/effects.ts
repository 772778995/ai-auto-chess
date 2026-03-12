// 装备效果辅助函数
import type { EffectContext, EffectResult, FollowerInstance, StatusItem } from '../../types/follower'

/** 入场护盾效果 */
export function createShieldEffect(shieldCount: number, source: string): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.statusList.push({ shield: shieldCount, permanent: true, source })
    }
    return { gameState: newState }
  }
}

/** 疯狂效果（设置 windfury 标记）*/
export function createWindfuryEffect(): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.windfury = true
    }
    return { gameState: newState }
  }
}

/** 嘲讽效果 */
export function createTauntEffect(): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.taunt = true
    }
    return { gameState: newState }
  }
}

/** 击杀+X/+Y 效果 */
export function createOnKillBuffEffect(attack: number, health: number, source: string): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.statusList.push({ attack, health, permanent: true, source })
    }
    return { gameState: newState }
  }
}

// ===== 特殊效果函数 =====

/** 击杀回复生命 */
export function createOnKillHealEffect(healAmount: number): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.currentHealth = Math.min(
        self.currentHealth + healAmount,
        self.baseHealth + self.statusList.reduce((sum: number, s: StatusItem) => sum + (s.health ?? 0), 0)
      )
    }
    return { gameState: newState }
  }
}

/** 受击造成伤害 */
export function createOnHitDamageEffect(damage: number): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
    if (target) {
      target.currentHealth -= damage
    }
    return { gameState: newState }
  }
}

/** 受击反击效果 */
export function createOnHitCounterEffect(damage: number): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const attacker = ctx.event?.source as FollowerInstance | undefined
    if (attacker) {
      const enemies = (newState as { enemies?: FollowerInstance[] }).enemies
      const target = enemies?.find((f: FollowerInstance) => f.instanceId === attacker.instanceId)
      if (target) {
        target.currentHealth -= damage
      }
    }
    return { gameState: newState }
  }
}

/** 受击获得护盾 */
export function createOnHitShieldEffect(shieldCount: number, source: string): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      self.statusList.push({ shield: shieldCount, permanent: true, source })
    }
    return { gameState: newState }
  }
}

/** 受击回复生命 */
export function createOnHitHealEffect(healAmount: number): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
      (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
    )
    if (self) {
      const maxHealth = self.baseHealth + self.statusList.reduce((sum: number, s: StatusItem) => sum + (s.health ?? 0), 0)
      self.currentHealth = Math.min(self.currentHealth + healAmount, maxHealth)
    }
    return { gameState: newState }
  }
}

/** 击杀消灭目标 */
export function createOnKillDestroyEffect(): (ctx: EffectContext) => EffectResult {
  return (ctx: EffectContext): EffectResult => {
    const newState = ctx.tools.cloneDeep(ctx.gameState)
    const target = ctx.event?.target as FollowerInstance | undefined
    if (target) {
      const enemies = (newState as { enemies?: FollowerInstance[] }).enemies
      const enemy = enemies?.find((f: FollowerInstance) => f.instanceId === target.instanceId)
      if (enemy) {
        enemy.currentHealth = 0
      }
    }
    return { gameState: newState }
  }
}
