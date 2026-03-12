import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F013',
  name: '剑客',
  description: '',
  level: 2,
  baseAttack: 3,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f013.png'
} satisfies Follower