import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F053',
  name: '命运女神',
  description: '入场发现3张5星随从',
  level: 5,
  baseAttack: 3,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 实现发现逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f053.png'
} satisfies Follower
