import type { Equipment } from '../../../types/follower'
import { createOnKillBuffEffect } from '../effects'

export default {
  id: 'E019',
  name: '猎龙弓',
  description: '+5攻击, 击杀+1/+1',
  level: 4,
  bonuses: { attack: 5 },
  effects: {
    onKill: [createOnKillBuffEffect(1, 1, '猎龙弓')]
  },
  imageUrl: '/assets/equipment/e019.png'
} satisfies Equipment