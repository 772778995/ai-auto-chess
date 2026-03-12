import type { Spell } from '../index'

export default {
  id: 'S009',
  name: '金币雨',
  description: '获得3金币',
  level: 2,
  type: 'special',
  effect: { type: 'gold', value: 3 },
  targetType: 'self',
  cost: 1,
  imageUrl: '/assets/spells/s009.png'
} satisfies Spell
