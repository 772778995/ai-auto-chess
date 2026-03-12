import type { Equipment } from '../../../types/follower'
import { createOnHitDamageEffect } from '../effects'

export default {
  id: 'E011',
  name: '双刃剑',
  description: '+5攻击, 受击+1伤害',
  level: 3,
  bonuses: { attack: 5 },
  effects: {
    onHit: [createOnHitDamageEffect(1)]
  },
  imageUrl: '/assets/equipment/e011.png'
} satisfies Equipment
