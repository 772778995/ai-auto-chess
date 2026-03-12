import type { Equipment } from '../../../types/follower'

export default {
  id: 'E023',
  name: '命运骰子',
  description: '拼点+1',
  level: 4,
  bonuses: {},
  effects: {}, // 拼点需要在战斗系统中特殊处理
  imageUrl: '/assets/equipment/e023.png'
} satisfies Equipment