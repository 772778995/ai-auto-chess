import type { Equipment } from '../../../types/follower'

export default {
  id: 'E004',
  name: '铁甲',
  description: '+3生命',
  level: 2,
  bonuses: { health: 3 },
  effects: {},
  imageUrl: '/assets/equipment/e004.png'
} satisfies Equipment
