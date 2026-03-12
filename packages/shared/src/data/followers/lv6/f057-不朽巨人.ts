import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F057',
  name: '不朽巨人',
  description: '嘲讽, 受击+1生命',
  level: 6,
  baseAttack: 3,
  baseHealth: 12,
  effects: {
    onAttack: [defaultOnAttack],
    onHit: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ health: 1, permanent: true, source: '受击效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f057.png'
} satisfies Follower
