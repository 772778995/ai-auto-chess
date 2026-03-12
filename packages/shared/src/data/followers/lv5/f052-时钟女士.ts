import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F052',
  name: '时钟女士',
  description: '先手全场+2/+2',
  level: 5,
  baseAttack: 4,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const allies = ctx.tools.getAllAllies(newState)
      for (const ally of allies) {
        ally.statusList.push({ attack: 2, health: 2, permanent: false, source: '先手效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f052.png'
} satisfies Follower
