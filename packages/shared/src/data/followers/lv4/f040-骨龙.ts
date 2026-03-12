import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F040',
  name: '骨龙',
  description: '遗言召唤4/4骨龙',
  level: 4,
  baseAttack: 4,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onDeath: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f040.png'
} satisfies Follower
