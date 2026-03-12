import type { Spell } from '../index'

export default {
  id: 'S050',
  name: '群体复活',
  description: '复活所有上回合死亡的随从',
  level: 6,
  type: 'special',
  effect: { type: 'resurrect', value: -1 },
  targetType: 'empty',
  cost: 5,
  imageUrl: '/assets/spells/s050.png'
} satisfies Spell
