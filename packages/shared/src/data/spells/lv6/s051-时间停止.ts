import type { Spell } from '../index'

export default {
  id: 'S051',
  name: '时间停止',
  description: '本回合拼点必定胜利',
  level: 6,
  type: 'special',
  effect: { type: 'dice_win' },
  targetType: 'self',
  cost: 5,
  imageUrl: '/assets/spells/s051.png'
} satisfies Spell
