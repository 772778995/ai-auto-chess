import type { Spell } from '../index'

export default {
  id: 'S006',
  name: '护盾术',
  description: '给目标护盾',
  level: 2,
  type: 'buff',
  effect: { type: 'shield_single' },
  targetType: 'single_ally',
  cost: 1,
  imageUrl: '/assets/spells/s006.png'
} satisfies Spell
