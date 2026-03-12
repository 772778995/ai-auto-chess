import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F023',
  name: '大厨',
  description: '卖出获得随机咒术',
  level: 2,
  baseAttack: 1,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f023.png'
} satisfies Follower