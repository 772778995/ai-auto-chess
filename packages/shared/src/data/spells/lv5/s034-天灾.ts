import type { Spell } from '../index'

export default {
  id: 'S034',
  name: '天灾',
  description: '对所有敌方随从造成6点伤害',
  level: 5,
  type: 'damage',
  effect: { type: 'damage', value: 6 },
  targetType: 'all_enemies',
  cost: 4,
  imageUrl: '/assets/spells/s034.png'
} satisfies Spell
