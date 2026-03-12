import type { Spell } from '../index'

export default {
  id: 'S004',
  name: '祝福术',
  description: '目标+3/+3',
  level: 2,
  type: 'buff',
  effect: { type: 'buff_single', value: 3 },
  targetType: 'single_ally',
  cost: 1,
  imageUrl: '/assets/spells/s004.png'
} satisfies Spell
