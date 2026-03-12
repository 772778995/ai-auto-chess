import type { Equipment } from '../../../types/follower'
import { createOnKillBuffEffect } from '../effects'

export default {
  id: 'E035',
  name: '死亡使者',
  description: '+6攻击, 击杀+3/+3',
  level: 6,
  bonuses: { attack: 6 },
  effects: {
    onKill: [createOnKillBuffEffect(3, 3, '死亡使者')]
  },
  imageUrl: '/assets/equipment/e035.png'
} satisfies Equipment
