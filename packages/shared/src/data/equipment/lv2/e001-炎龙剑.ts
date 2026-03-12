import type { Equipment } from '../../../types/follower'

export default {
  id: 'E001',
  name: '炎龙剑',
  description: '+3攻击',
  level: 2,
  bonuses: { attack: 3 },
  effects: {},
  imageUrl: '/assets/equipment/e001.png'
} satisfies Equipment
