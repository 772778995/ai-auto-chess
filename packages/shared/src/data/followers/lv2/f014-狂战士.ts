import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F014',
  name: '狂战士',
  description: '疯狂',
  level: 2,
  baseAttack: 4,
  baseHealth: 1,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      // TODO: 疯狂是静态属性，需要在 FollowerInstance 中标记
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f014.png'
} satisfies Follower