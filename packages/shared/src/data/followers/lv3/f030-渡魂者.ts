import type { Follower, EffectContext } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F030',
  name: '渡魂者',
  description: '遗言召唤3/3亡魂',
  level: 3,
  baseAttack: 3,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack],
    onDeath: [(ctx: EffectContext) => {
      // TODO: 实现召唤逻辑
      return { gameState: ctx.tools.cloneDeep(ctx.gameState) }
    }]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f030.png'
} satisfies Follower