import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F001',
  name: '小狼',
  description: '',
  level: 1,
  baseAttack: 2,
  baseHealth: 1,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f001.png'
} satisfies Follower
