import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F062',
  name: '全知者',
  description: '成长发现1张随从',
  level: 6,
  baseAttack: 4,
  baseHealth: 6,
  effects: {
    onAttack: [defaultOnAttack],
    onGrowth: [(ctx: EffectContext) => {
      // TODO: 实现发现逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f062.png'
} satisfies Follower
