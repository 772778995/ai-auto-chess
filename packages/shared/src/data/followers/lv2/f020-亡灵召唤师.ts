import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F020',
  name: '亡灵召唤师',
  description: '遗言召唤2/2亡灵',
  level: 2,
  baseAttack: 2,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack],
    onDeath: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f020.png'
} satisfies Follower