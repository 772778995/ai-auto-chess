import type { Spell } from '../index'

export default {
  id: 'S029',
  name: '高级发现',
  description: '发现1张5星随从',
  level: 4,
  type: 'discover',
  effect: { type: 'discover_follower', value: 5 },
  targetType: 'self',
  cost: 3,
  imageUrl: '/assets/spells/s029.png'
} satisfies Spell
