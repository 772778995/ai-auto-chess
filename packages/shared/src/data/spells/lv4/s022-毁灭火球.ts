import type { Spell } from '../index'

export default {
  id: 'S022',
  name: '毁灭火球',
  description: '造成12点伤害',
  level: 4,
  type: 'damage',
  effect: { type: 'damage', value: 12 },
  targetType: 'single_enemy',
  cost: 3,
  imageUrl: '/assets/spells/s022.png'
} satisfies Spell
