import type { Spell } from '../index'

export default {
  id: 'S031',
  name: '变形术',
  description: '将目标随从变形为随机同星级随从',
  level: 4,
  type: 'special',
  effect: { type: 'transform' },
  targetType: 'single_enemy',
  cost: 3,
  imageUrl: '/assets/spells/s031.png'
} satisfies Spell
