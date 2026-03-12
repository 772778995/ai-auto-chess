import type { Spell } from '../index'

export default {
  id: 'S042',
  name: '创世之火',
  description: '造成30点伤害',
  level: 6,
  type: 'damage',
  effect: { type: 'damage', value: 30 },
  targetType: 'single_enemy',
  cost: 5,
  imageUrl: '/assets/spells/s042.png'
} satisfies Spell
