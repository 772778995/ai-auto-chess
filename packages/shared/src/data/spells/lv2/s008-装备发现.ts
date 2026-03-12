import type { Spell } from '../index'

export default {
  id: 'S008',
  name: '装备发现',
  description: '发现1张2星装备',
  level: 2,
  type: 'discover',
  effect: { type: 'discover_equipment', value: 2 },
  targetType: 'self',
  cost: 1,
  imageUrl: '/assets/spells/s008.png'
} satisfies Spell
