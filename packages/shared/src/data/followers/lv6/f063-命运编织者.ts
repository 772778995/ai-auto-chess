import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F063',
  name: '命运编织者',
  description: '拼点+3',
  level: 6,
  baseAttack: 5,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      // TODO: 拼点效果需要特殊处理
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f063.png'
} satisfies Follower
