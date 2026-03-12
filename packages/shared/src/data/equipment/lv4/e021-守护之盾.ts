import type { Equipment } from '../../../types/follower'
import { createShieldEffect, createTauntEffect } from '../effects'

export default {
  id: 'E021',
  name: '守护之盾',
  description: '+4生命, 护盾, 嘲讽',
  level: 4,
  bonuses: { health: 4 },
  effects: {
    onEnter: [
      createShieldEffect(1, '守护之盾'),
      createTauntEffect()
    ]
  },
  imageUrl: '/assets/equipment/e021.png'
} satisfies Equipment