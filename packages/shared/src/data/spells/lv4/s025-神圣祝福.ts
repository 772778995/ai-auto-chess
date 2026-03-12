import type { Spell } from '../index'

export default {
  id: 'S025',
  name: '神圣祝福',
  description: '目标+8/+8',
  level: 4,
  type: 'buff',
  effect: { type: 'buff_single', value: 8 },
  targetType: 'single_ally',
  cost: 3,
  imageUrl: '/assets/spells/s025.png'
} satisfies Spell
