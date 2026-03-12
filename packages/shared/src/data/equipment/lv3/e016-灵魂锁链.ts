import type { Equipment } from '../../../types/follower'
import { createOnKillBuffEffect } from '../effects'

export default {
  id: 'E016',
  name: '灵魂锁链',
  description: '击杀获得+1/+1',
  level: 3,
  bonuses: {},
  effects: {
    onKill: [createOnKillBuffEffect(1, 1, '灵魂锁链')]
  },
  imageUrl: '/assets/equipment/e016.png'
} satisfies Equipment
