import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F035',
  name: '暗影刺客',
  description: '击杀造成2点伤害',
  level: 4,
  baseAttack: 4,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onKill: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const target = ctx.tools.getRandomEnemy(newState, ctx.self.position)
      if (target) {
        target.currentHealth -= 2
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f035.png'
} satisfies Follower
