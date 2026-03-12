import type { Equipment } from '../../../types/follower'

export default {
  id: 'E039',
  name: '命运骰子(金)',
  description: '拼点+3, 拼点胜利+2/+2',
  level: 6,
  bonuses: {},
  effects: {}, // 拼点需要在战斗系统中特殊处理
  imageUrl: '/assets/equipment/e039.png'
} satisfies Equipment
