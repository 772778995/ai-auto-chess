import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F012',
  name: '商人学徒',
  description: '卖出获得1金币',
  level: 1,
  baseAttack: 1,
  baseHealth: 1,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f012.png'
} satisfies Follower
