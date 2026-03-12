import type { Spell } from '../index'

export default {
  id: 'S048',
  name: '命运发现',
  description: '发现2张6星随从',
  level: 6,
  type: 'discover',
  effect: { type: 'discover_follower', value: 6 },
  targetType: 'self',
  cost: 5,
  imageUrl: '/assets/spells/s048.png'
} satisfies Spell
