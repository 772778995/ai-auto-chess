import type { Equipment } from '../../../types/follower'
import { createShieldEffect } from '../effects'

export default {
  id: 'E029',
  name: '天使之翼',
  description: '+5生命, 护盾×2',
  level: 5,
  bonuses: { health: 5 },
  effects: {
    onEnter: [createShieldEffect(2, '天使之翼')]
  },
  imageUrl: '/assets/equipment/e029.png'
} satisfies Equipment
