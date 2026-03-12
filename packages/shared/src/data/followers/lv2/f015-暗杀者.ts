import type { Follower, FollowerInstance, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F015',
  name: '暗杀者',
  description: '先手+2攻击',
  level: 2,
  baseAttack: 2,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack],
    onFirstStrike: [(ctx: EffectContext) => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      const self = (newState as { allies?: FollowerInstance[] }).allies?.find(
        (f: FollowerInstance) => f.instanceId === ctx.self.instanceId
      )
      if (self) {
        self.statusList.push({ attack: 2, permanent: false, source: '先手效果' })
      }
      return { gameState: newState }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f015.png'
} satisfies Follower