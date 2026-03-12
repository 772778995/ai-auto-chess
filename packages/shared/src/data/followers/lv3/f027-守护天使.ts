import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F027',
  name: '守护天使',
  description: '光环同列+1/+1',
  level: 3,
  baseAttack: 2,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 光环效果需要特殊处理
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f027.png'
} satisfies Follower