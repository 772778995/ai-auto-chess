import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F047',
  name: '守护神',
  description: '光环全场+2/+2',
  level: 5,
  baseAttack: 3,
  baseHealth: 8,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 光环效果需要特殊处理
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f047.png'
} satisfies Follower
