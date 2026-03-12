import type { Spell } from '../index'

export default {
  id: 'S014',
  name: '强效祝福',
  description: '目标+5/+5',
  level: 3,
  type: 'buff',
  effect: { type: 'buff_single', value: 5 },
  targetType: 'single_ally',
  cost: 2,
  imageUrl: '/assets/spells/s014.png'
} satisfies Spell
