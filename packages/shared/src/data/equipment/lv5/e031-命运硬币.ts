import type { Equipment } from '../../../types/follower'

export default {
  id: 'E031',
  name: '命运硬币',
  description: '拼点+2',
  level: 5,
  bonuses: {},
  effects: {}, // 拼点需要在战斗系统中特殊处理
  imageUrl: '/assets/equipment/e031.png'
} satisfies Equipment
