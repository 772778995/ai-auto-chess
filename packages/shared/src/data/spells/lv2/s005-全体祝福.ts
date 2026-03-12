import type { Spell } from '../index'

export default {
  id: 'S005',
  name: '全体祝福',
  description: '所有我方随从+1/+1',
  level: 2,
  type: 'buff',
  effect: { type: 'buff_all', value: 1 },
  targetType: 'all_allies',
  cost: 1,
  imageUrl: '/assets/spells/s005.png'
} satisfies Spell
