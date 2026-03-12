import type { Follower, FollowerInstance, EffectContext, EffectResult, BattlePosition } from '../types/follower'

// 特殊随从
export const FOLLOWERS_SPECIAL: Record<string, Follower> = {
  'F601': {
    id: 'F601',
    name: '不死之王',
    description: '攻击时不造成伤害，而是召唤一个亡灵骷髅',
    level: 6,
    baseAttack: 4,
    baseHealth: 6,
    effects: {
      onAttack: [(ctx: EffectContext): EffectResult => {
        const newState = ctx.tools.cloneDeep(ctx.gameState)

        // 找到空位置
        const allies = (newState as { allies?: FollowerInstance[] }).allies || []
        const occupiedPositions = new Set(allies.map(f => `${f.position.x},${f.position.y}`))
        let emptyPosition: BattlePosition | null = null

        for (let x = 0; x < 3; x++) {
          for (let y = 0; y < 2; y++) {
            if (!occupiedPositions.has(`${x},${y}`)) {
              emptyPosition = { side: 'ally', x: x as 0 | 1 | 2, y: y as 0 | 1 }
              break
            }
          }
          if (emptyPosition) break
        }

        if (!emptyPosition) {
          return { gameState: ctx.gameState }
        }

        const skeleton: FollowerInstance = {
          instanceId: `skeleton-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          id: 'F_SKELETON',
          name: '亡灵骷髅',
          description: '',
          level: 1,
          baseAttack: 2,
          baseHealth: 1,
          ownerId: ctx.self.ownerId,
          position: emptyPosition,
          currentHealth: 1,
          statusList: [],
          equipment: [],
          equipmentSlots: 1,
          imageUrl: '/assets/followers/skeleton.png'
        }

        return {
          gameState: newState,
          events: [{
            type: 'summon',
            followers: [skeleton],
            positions: [emptyPosition]
          }]
        }
      }]
    },
    equipmentSlots: 2,
    imageUrl: '/assets/followers/undead_king.png'
  }
}