import type { Spell } from '../index'

export default {
  id: 'S035',
  name: '神之祝福',
  description: '目标+12/+12',
  level: 5,
  type: 'buff',
  effect: { type: 'buff_single', value: 12 },
  targetType: 'single_ally',
  cost: 4,
  imageUrl: '/assets/spells/s035.png'
} satisfies Spell
