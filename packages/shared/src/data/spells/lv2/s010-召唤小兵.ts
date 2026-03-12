import type { Spell } from '../index'

export default {
  id: 'S010',
  name: '召唤小兵',
  description: '召唤2个1/1士兵',
  level: 2,
  type: 'special',
  effect: { type: 'summon', value: 2 },
  targetType: 'empty',
  cost: 1,
  imageUrl: '/assets/spells/s010.png'
} satisfies Spell
