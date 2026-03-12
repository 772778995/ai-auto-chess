import type { Equipment } from '../../../types/follower'

export default {
  id: 'E015',
  name: '焊接器',
  description: '先手效果永久保留',
  level: 3,
  bonuses: {},
  effects: {}, // 需要在战斗系统中特殊处理
  imageUrl: '/assets/equipment/e015.png'
} satisfies Equipment
