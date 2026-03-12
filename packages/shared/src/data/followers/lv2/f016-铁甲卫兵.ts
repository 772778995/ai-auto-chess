import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F016',
  name: '铁甲卫兵',
  description: '嘲讽',
  level: 2,
  baseAttack: 2,
  baseHealth: 4,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f016.png'
} satisfies Follower