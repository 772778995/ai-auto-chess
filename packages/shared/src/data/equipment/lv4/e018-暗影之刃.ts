import type { Equipment } from '../../../types/follower'

export default {
  id: 'E018',
  name: '暗影之刃',
  description: '+4攻击, 增伤+2',
  level: 4,
  bonuses: { attack: 4, damageBonus: 2 },
  effects: {},
  imageUrl: '/assets/equipment/e018.png'
} satisfies Equipment