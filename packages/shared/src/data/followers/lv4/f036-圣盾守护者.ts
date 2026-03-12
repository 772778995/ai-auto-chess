import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F036',
  name: '圣盾守护者',
  description: '护盾, 嘲讽',
  level: 4,
  baseAttack: 3,
  baseHealth: 5,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
        self.taunt = true
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f036.png'
} satisfies Follower
