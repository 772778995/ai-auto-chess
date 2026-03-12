import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F060',
  name: '军团指挥官',
  description: '入场填满战场6/6士兵',
  level: 6,
  baseAttack: 6,
  baseHealth: 7,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f060.png'
} satisfies Follower
