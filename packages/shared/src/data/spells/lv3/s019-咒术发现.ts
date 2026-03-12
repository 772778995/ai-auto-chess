import type { Spell } from '../index'

export default {
  id: 'S019',
  name: '咒术发现',
  description: '发现1张3星咒术',
  level: 3,
  type: 'discover',
  effect: { type: 'discover_spell', value: 3 },
  targetType: 'self',
  cost: 2,
  imageUrl: '/assets/spells/s019.png'
} satisfies Spell
