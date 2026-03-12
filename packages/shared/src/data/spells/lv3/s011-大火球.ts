import type { Spell } from '../index'

export default {
  id: 'S011',
  name: '大火球',
  description: '造成8点伤害',
  level: 3,
  type: 'damage',
  effect: { type: 'damage', value: 8 },
  targetType: 'single_enemy',
  cost: 2,
  imageUrl: '/assets/spells/s011.png'
} satisfies Spell
