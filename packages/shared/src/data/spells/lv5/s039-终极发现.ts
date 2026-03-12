import type { Spell } from '../index'

export default {
  id: 'S039',
  name: '终极发现',
  description: '发现1张6星随从',
  level: 5,
  type: 'discover',
  effect: { type: 'discover_follower', value: 6 },
  targetType: 'self',
  cost: 4,
  imageUrl: '/assets/spells/s039.png'
} satisfies Spell
