import type { Equipment } from '../../../types/follower'
import { createTauntEffect, createShieldEffect } from '../effects'

export default {
  id: 'E030',
  name: '永恒铠甲',
  description: '+6生命, 嘲讽, 护盾',
  level: 5,
  bonuses: { health: 6 },
  effects: {
    onEnter: [
      createTauntEffect(),
      createShieldEffect(1, '永恒铠甲')
    ]
  },
  imageUrl: '/assets/equipment/e030.png'
} satisfies Equipment
