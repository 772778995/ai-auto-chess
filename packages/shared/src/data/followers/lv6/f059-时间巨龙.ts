import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F059',
  name: '时间巨龙',
  description: '成长所有随从+1/+1',
  level: 6,
  baseAttack: 6,
  baseHealth: 6,
  effects: {
    onAttack: [defaultOnAttack],
    onGrowth: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const allies = ctx.tools.getAllAllies(newState)
      for (const ally of allies) {
        ally.statusList.push({ attack: 1, health: 1, permanent: true, source: '时间巨龙成长' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f059.png'
} satisfies Follower
