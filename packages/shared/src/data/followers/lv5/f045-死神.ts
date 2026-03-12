import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F045',
  name: '死神',
  description: '击杀消灭目标',
  level: 5,
  baseAttack: 5,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onKill: [(ctx: EffectContext) => {
      // TODO: 实现消灭逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f045.png'
} satisfies Follower
