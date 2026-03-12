import type { Spell } from '../index'

export default {
  id: 'S044',
  name: '混沌毁灭',
  description: '对所有随从造成15点伤害',
  level: 6,
  type: 'damage',
  effect: { type: 'damage', value: 15 },
  targetType: 'all',
  cost: 5,
  imageUrl: '/assets/spells/s044.png'
} satisfies Spell
