import type { Equipment } from '../../../types/follower'
import { createWindfuryEffect } from '../effects'

export default {
  id: 'E034',
  name: '毁灭者之刃',
  description: '+8攻击, 疯狂×2, 增伤+3',
  level: 6,
  bonuses: { attack: 8, damageBonus: 3 },
  effects: {
    onEnter: [createWindfuryEffect()]
  },
  imageUrl: '/assets/equipment/e034.png'
} satisfies Equipment
