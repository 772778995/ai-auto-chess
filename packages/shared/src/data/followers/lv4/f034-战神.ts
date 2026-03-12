import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F034',
  name: '战神',
  description: '先手+3/+3',
  level: 4,
  baseAttack: 6,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 3, health: 3, permanent: false, source: '先手效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f034.png'
} satisfies Follower
