import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F054',
  name: '混沌领主',
  description: '先手+8/+8',
  level: 6,
  baseAttack: 10,
  baseHealth: 8,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 8, health: 8, permanent: false, source: '先手效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f054.png'
} satisfies Follower
