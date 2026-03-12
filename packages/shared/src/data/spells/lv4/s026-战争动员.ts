import type { Spell } from '../index'

export default {
  id: 'S026',
  name: '战争动员',
  description: '所有我方随从+3/+3',
  level: 4,
  type: 'buff',
  effect: { type: 'buff_all', value: 3 },
  targetType: 'all_allies',
  cost: 3,
  imageUrl: '/assets/spells/s026.png'
} satisfies Spell
