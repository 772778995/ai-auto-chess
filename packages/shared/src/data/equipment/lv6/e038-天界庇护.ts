import type { Equipment } from '../../../types/follower'
import { createShieldEffect } from '../effects'

export default {
  id: 'E038',
  name: '天界庇护',
  description: '+8生命, 护盾×3',
  level: 6,
  bonuses: { health: 8 },
  effects: {
    onEnter: [createShieldEffect(3, '天界庇护')]
  },
  imageUrl: '/assets/equipment/e038.png'
} satisfies Equipment
