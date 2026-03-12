import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F029',
  name: '龙蛋',
  description: '成长变成龙',
  level: 3,
  baseAttack: 0,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onGrowth: [(ctx: EffectContext) => {
      // TODO: 实现变形逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f029.png'
} satisfies Follower