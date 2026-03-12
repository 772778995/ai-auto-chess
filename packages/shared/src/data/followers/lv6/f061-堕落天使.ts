import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F061',
  name: '堕落天使',
  description: '遗言召唤6/6天使和恶魔',
  level: 6,
  baseAttack: 5,
  baseHealth: 6,
  effects: {
    onAttack: [defaultOnAttack],
    onDeath: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f061.png'
} satisfies Follower
