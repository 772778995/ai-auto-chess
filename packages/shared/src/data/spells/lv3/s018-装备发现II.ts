import type { Spell } from '../index'

export default {
  id: 'S018',
  name: '装备发现II',
  description: '发现1张3星装备',
  level: 3,
  type: 'discover',
  effect: { type: 'discover_equipment', value: 3 },
  targetType: 'self',
  cost: 2,
  imageUrl: '/assets/spells/s018.png'
} satisfies Spell
