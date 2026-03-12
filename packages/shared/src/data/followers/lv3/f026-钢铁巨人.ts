import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F026',
  name: '钢铁巨人',
  description: '嘲讽',
  level: 3,
  baseAttack: 3,
  baseHealth: 6,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f026.png'
} satisfies Follower