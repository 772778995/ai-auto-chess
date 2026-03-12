import type { Spell } from '../index'

export default {
  id: 'S028',
  name: '随从发现III',
  description: '发现1张4星随从',
  level: 4,
  type: 'discover',
  effect: { type: 'discover_follower', value: 4 },
  targetType: 'self',
  cost: 3,
  imageUrl: '/assets/spells/s028.png'
} satisfies Spell
