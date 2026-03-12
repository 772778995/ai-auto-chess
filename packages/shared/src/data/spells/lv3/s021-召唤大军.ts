import type { Spell } from '../index'

export default {
  id: 'S021',
  name: '召唤大军',
  description: '在每个空位召唤2/2士兵',
  level: 3,
  type: 'special',
  effect: { type: 'summon', value: 2 },
  targetType: 'empty',
  cost: 2,
  imageUrl: '/assets/spells/s021.png'
} satisfies Spell
