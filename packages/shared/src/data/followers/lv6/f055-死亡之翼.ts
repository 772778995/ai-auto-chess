import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F055',
  name: '死亡之翼',
  description: '',
  level: 6,
  baseAttack: 12,
  baseHealth: 6,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f055.png'
} satisfies Follower
