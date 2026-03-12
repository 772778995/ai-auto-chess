import type { Equipment } from '../../../types/follower'
import { createWindfuryEffect } from '../effects'

export default {
  id: 'E027',
  name: '混沌之刃',
  description: '+6攻击, 疯狂×2',
  level: 5,
  bonuses: { attack: 6 },
  effects: {
    onEnter: [createWindfuryEffect()] // 疯狂×2 逻辑在战斗系统中处理
  },
  imageUrl: '/assets/equipment/e027.png'
} satisfies Equipment
