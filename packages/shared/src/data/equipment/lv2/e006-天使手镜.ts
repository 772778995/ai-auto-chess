import type { Equipment } from '../../../types/follower'
import { createShieldEffect } from '../effects'

export default {
  id: 'E006',
  name: '天使手镜',
  description: '入场护盾',
  level: 2,
  bonuses: {},
  effects: {
    onEnter: [createShieldEffect(1, '天使手镜')]
  },
  imageUrl: '/assets/equipment/e006.png'
} satisfies Equipment
