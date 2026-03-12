import type { Spell } from '../index'

export default {
  id: 'S046',
  name: '神圣军团',
  description: '所有我方随从+8/+8',
  level: 6,
  type: 'buff',
  effect: { type: 'buff_all', value: 8 },
  targetType: 'all_allies',
  cost: 5,
  imageUrl: '/assets/spells/s046.png'
} satisfies Spell
