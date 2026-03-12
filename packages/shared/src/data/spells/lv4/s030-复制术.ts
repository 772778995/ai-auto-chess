import type { Spell } from '../index'

export default {
  id: 'S030',
  name: '复制术',
  description: '复制目标随从的所有属性和效果',
  level: 4,
  type: 'special',
  effect: { type: 'copy' },
  targetType: 'single_ally',
  cost: 3,
  imageUrl: '/assets/spells/s030.png'
} satisfies Spell
