import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F037',
  name: '城堡守卫',
  description: '嘲讽',
  level: 4,
  baseAttack: 2,
  baseHealth: 8,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f037.png'
} satisfies Follower
