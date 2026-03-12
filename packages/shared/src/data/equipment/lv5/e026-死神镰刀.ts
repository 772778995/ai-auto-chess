import type { Equipment } from '../../../types/follower'
import { createOnKillDestroyEffect } from '../effects'

export default {
  id: 'E026',
  name: '死神镰刀',
  description: '+5攻击, 击杀消灭目标',
  level: 5,
  bonuses: { attack: 5 },
  effects: {
    onKill: [createOnKillDestroyEffect()]
  },
  imageUrl: '/assets/equipment/e026.png'
} satisfies Equipment
