import type { Spell } from '../index'

export default {
  id: 'S007',
  name: '随从发现',
  description: '发现1张2星随从',
  level: 2,
  type: 'discover',
  effect: { type: 'discover_follower', value: 2 },
  targetType: 'self',
  cost: 1,
  imageUrl: '/assets/spells/s007.png'
} satisfies Spell
