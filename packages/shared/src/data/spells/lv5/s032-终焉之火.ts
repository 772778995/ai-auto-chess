import type { Spell } from '../index'

export default {
  id: 'S032',
  name: '终焉之火',
  description: '造成20点伤害',
  level: 5,
  type: 'damage',
  effect: { type: 'damage', value: 20 },
  targetType: 'single_enemy',
  cost: 4,
  imageUrl: '/assets/spells/s032.png'
} satisfies Spell
