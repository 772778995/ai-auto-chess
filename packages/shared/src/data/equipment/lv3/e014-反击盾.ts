import type { Equipment } from '../../../types/follower'
import { createOnHitCounterEffect } from '../effects'

export default {
  id: 'E014',
  name: '反击盾',
  description: '+3生命, 反击',
  level: 3,
  bonuses: { health: 3 },
  effects: {
    onHit: [createOnHitCounterEffect(1)]
  },
  imageUrl: '/assets/equipment/e014.png'
} satisfies Equipment
