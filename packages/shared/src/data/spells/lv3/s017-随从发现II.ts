import type { Spell } from '../index'

export default {
  id: 'S017',
  name: '随从发现II',
  description: '发现1张3星随从',
  level: 3,
  type: 'discover',
  effect: { type: 'discover_follower', value: 3 },
  targetType: 'self',
  cost: 2,
  imageUrl: '/assets/spells/s017.png'
} satisfies Spell
