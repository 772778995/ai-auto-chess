import type { Spell } from '../index'

export default {
  id: 'S040',
  name: '复活术',
  description: '复活上回合死亡的最强随从',
  level: 5,
  type: 'special',
  effect: { type: 'resurrect', value: 1 },
  targetType: 'empty',
  cost: 4,
  imageUrl: '/assets/spells/s040.png'
} satisfies Spell
