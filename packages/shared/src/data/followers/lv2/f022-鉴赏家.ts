import type { Follower } from '../../../types/follower'
import { defaultOnAttack } from '../../../utils/effects'

export default {
  id: 'F022',
  name: '鉴赏家',
  description: '卖出商店+1星',
  level: 2,
  baseAttack: 1,
  baseHealth: 2,
  effects: {
    onAttack: [defaultOnAttack]
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/f022.png'
} satisfies Follower