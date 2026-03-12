import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F017',
  name: '圣盾骑士',
  description: '护盾',
  level: 2,
  baseAttack: 2,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onEnter: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ shield: 1, permanent: true, source: '入场护盾' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f017.png'
} satisfies Follower