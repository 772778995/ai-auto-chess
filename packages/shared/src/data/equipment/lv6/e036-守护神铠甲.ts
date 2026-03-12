import type { Equipment } from '../../../types/follower'
import { createShieldEffect } from '../effects'

export default {
  id: 'E036',
  name: '守护神铠甲',
  description: '+15生命, 护盾×2',
  level: 6,
  bonuses: { health: 15 },
  effects: {
    onEnter: [createShieldEffect(2, '守护神铠甲')]
  },
  imageUrl: '/assets/equipment/e036.png'
} satisfies Equipment
