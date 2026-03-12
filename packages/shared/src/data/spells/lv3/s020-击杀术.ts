import type { Spell } from '../index'

export default {
  id: 'S020',
  name: '击杀术',
  description: '消灭目标随从，获得1金币',
  level: 3,
  type: 'special',
  effect: { type: 'kill', value: 1 },
  targetType: 'single_enemy',
  cost: 2,
  imageUrl: '/assets/spells/s020.png'
} satisfies Spell
