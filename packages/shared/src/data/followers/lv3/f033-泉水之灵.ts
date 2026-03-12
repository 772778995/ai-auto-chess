import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F033',
  name: '泉水之灵',
  description: '光环成长×2',
  level: 3,
  baseAttack: 1,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 光环效果需要特殊处理
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f033.png'
} satisfies Follower