import type { Equipment } from '../../../types/follower'
import { createTauntEffect, createShieldEffect, createOnHitHealEffect } from '../effects'

export default {
  id: 'E037',
  name: '不朽之盾',
  description: '+10生命, 嘲讽, 护盾, 受击回复5生命',
  level: 6,
  bonuses: { health: 10 },
  effects: {
    onEnter: [
      createTauntEffect(),
      createShieldEffect(1, '不朽之盾')
    ],
    onHit: [createOnHitHealEffect(5)]
  },
  imageUrl: '/assets/equipment/e037.png'
} satisfies Equipment
