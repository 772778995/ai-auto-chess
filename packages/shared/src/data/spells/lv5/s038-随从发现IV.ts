import type { Spell } from '../index'

export default {
  id: 'S038',
  name: '随从发现IV',
  description: '发现1张5星随从',
  level: 5,
  type: 'discover',
  effect: { type: 'discover_follower', value: 5 },
  targetType: 'self',
  cost: 4,
  imageUrl: '/assets/spells/s038.png'
} satisfies Spell
