import type { Equipment } from '../../../types/follower'
import { createShieldEffect } from '../effects'

export default {
  id: 'E013',
  name: '圣盾',
  description: '+2生命, 护盾',
  level: 3,
  bonuses: { health: 2 },
  effects: {
    onEnter: [createShieldEffect(1, '圣盾')]
  },
  imageUrl: '/assets/equipment/e013.png'
} satisfies Equipment
