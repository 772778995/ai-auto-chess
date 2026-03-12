import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F056',
  name: '世界守护者',
  description: '嘲讽, 护盾×2',
  level: 6,
  baseAttack: 5,
  baseHealth: 15,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ shield: 2, permanent: true, source: '入场护盾' })
        self.taunt = true
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f056.png'
} satisfies Follower
