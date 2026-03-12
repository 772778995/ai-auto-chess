import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F044',
  name: '毁灭者',
  description: '先手+5/+5',
  level: 5,
  baseAttack: 8,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 5, health: 5, permanent: false, source: '先手效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f044.png'
} satisfies Follower
