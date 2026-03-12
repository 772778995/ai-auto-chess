import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F019',
  name: '火焰幼龙',
  description: '成长+2攻击',
  level: 2,
  baseAttack: 2,
  baseHealth: 1,
  effects: {
    onAttack: [defaultOnAttack],
    onGrowth: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 2, permanent: true, source: '成长效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f019.png'
} satisfies Follower