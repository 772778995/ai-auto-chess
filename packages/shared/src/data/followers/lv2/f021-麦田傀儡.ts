import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F021',
  name: '麦田傀儡',
  description: '遗言召唤2个1/1稻草人',
  level: 2,
  baseAttack: 2,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onDeath: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f021.png'
} satisfies Follower