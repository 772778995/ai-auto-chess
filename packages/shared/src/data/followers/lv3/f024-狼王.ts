import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F024',
  name: '狼王',
  description: '击杀+1/+1',
  level: 3,
  baseAttack: 4,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onKill: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 1, health: 1, permanent: true, source: '击杀效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f024.png'
} satisfies Follower