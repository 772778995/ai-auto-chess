import type { Spell } from '../index'

export default {
  id: 'S013',
  name: '火焰风暴',
  description: '对所有敌方随从造成2点伤害',
  level: 3,
  type: 'damage',
  effect: { type: 'damage_splash', value: 2 },
  targetType: 'all_enemies',
  cost: 2,
  imageUrl: '/assets/spells/s013.png'
} satisfies Spell
