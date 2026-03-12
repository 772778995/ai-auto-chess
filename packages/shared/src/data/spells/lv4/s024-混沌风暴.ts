import type { Spell } from '../index'

export default {
  id: 'S024',
  name: '混沌风暴',
  description: '对所有随从造成4点伤害',
  level: 4,
  type: 'damage',
  effect: { type: 'damage', value: 4 },
  targetType: 'all',
  cost: 3,
  imageUrl: '/assets/spells/s024.png'
} satisfies Spell
