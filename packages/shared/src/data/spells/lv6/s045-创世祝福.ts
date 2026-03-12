import type { Spell } from '../index'

export default {
  id: 'S045',
  name: '创世祝福',
  description: '目标+20/+20',
  level: 6,
  type: 'buff',
  effect: { type: 'buff_single', value: 20 },
  targetType: 'single_ally',
  cost: 5,
  imageUrl: '/assets/spells/s045.png'
} satisfies Spell
