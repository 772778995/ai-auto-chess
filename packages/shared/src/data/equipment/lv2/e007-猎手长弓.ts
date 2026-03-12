import type { Equipment } from '../../../types/follower'

export default {
  id: 'E007',
  name: '猎手长弓',
  description: '攻击无视嘲讽',
  level: 2,
  bonuses: {},
  effects: {}, // 无视嘲讽需要在战斗系统中处理
  imageUrl: '/assets/equipment/e007.png'
} satisfies Equipment
