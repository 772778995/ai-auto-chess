import type { Equipment } from '../../../types/follower'
import { createWindfuryEffect } from '../effects'

export default {
  id: 'E010',
  name: '狂战士之斧',
  description: '+3攻击, 疯狂',
  level: 3,
  bonuses: { attack: 3 },
  effects: {
    onEnter: [createWindfuryEffect()]
  },
  imageUrl: '/assets/equipment/e010.png'
} satisfies Equipment
