import type { Spell } from '../index'

export default {
  id: 'S001',
  name: '火球术',
  description: '造成5点伤害',
  level: 2,
  type: 'damage',
  effect: { type: 'damage', value: 5 },
  targetType: 'single_enemy',
  cost: 1,
  imageUrl: '/assets/spells/s001.png'
} satisfies Spell
