import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F006',
  name: '嘲讽石像',
  description: '嘲讽',
  level: 1,
  baseAttack: 0,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f006.png'
} satisfies Follower
