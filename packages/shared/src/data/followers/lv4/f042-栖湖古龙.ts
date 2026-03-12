import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F042',
  name: '栖湖古龙',
  description: '光环先手×2',
  level: 4,
  baseAttack: 3,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 光环效果需要特殊处理
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f042.png'
} satisfies Follower
