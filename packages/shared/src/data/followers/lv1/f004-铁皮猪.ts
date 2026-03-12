import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F004',
  name: '铁皮猪',
  description: '',
  level: 1,
  baseAttack: 1,
  baseHealth: 3,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f004.png'
} satisfies Follower
