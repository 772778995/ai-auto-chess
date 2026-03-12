import type { Equipment } from '../../../types/follower'
import { createWindfuryEffect } from '../effects'

export default {
  id: 'E002',
  name: '暗杀匕首',
  description: '+2攻击, 疯狂',
  level: 2,
  bonuses: { attack: 2 },
  effects: {
    onEnter: [createWindfuryEffect()]
  },
  imageUrl: '/assets/equipment/e002.png'
} satisfies Equipment
