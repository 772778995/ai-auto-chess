import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F002',
  name: '刺客学徒',
  description: '击杀后获得+1/+1',
  level: 1,
  baseAttack: 1,
  baseHealth: 2,
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
  imageUrl: '/assets/followers/f002.png'
} satisfies Follower
