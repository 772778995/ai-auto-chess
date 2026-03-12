import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F003',
  name: '火焰精灵',
  description: '入场时对随机敌人造成2点伤害',
  level: 1,
  baseAttack: 2,
  baseHealth: 1,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
      if (target) {
        target.currentHealth -= 2
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f003.png'
} satisfies Follower
