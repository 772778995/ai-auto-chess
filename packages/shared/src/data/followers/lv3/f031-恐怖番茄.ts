import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F031',
  name: '恐怖番茄',
  description: '成长召唤1/1番茄',
  level: 3,
  baseAttack: 2,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack],
    onGrowth: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f031.png'
} satisfies Follower