import type { Equipment } from '../../../types/follower'
import { createOnKillHealEffect } from '../effects'

export default {
  id: 'E008',
  name: '吸血镰刀',
  description: '击杀回复2生命',
  level: 2,
  bonuses: {},
  effects: {
    onKill: [createOnKillHealEffect(2)]
  },
  imageUrl: '/assets/equipment/e008.png'
} satisfies Equipment
