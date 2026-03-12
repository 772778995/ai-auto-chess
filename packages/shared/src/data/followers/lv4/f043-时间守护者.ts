import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F043',
  name: '时间守护者',
  description: '准备获得2金币',
  level: 4,
  baseAttack: 2,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onRoundEnd: [(ctx: EffectContext) => {
      // TODO: 实现金币逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f043.png'
} satisfies Follower
