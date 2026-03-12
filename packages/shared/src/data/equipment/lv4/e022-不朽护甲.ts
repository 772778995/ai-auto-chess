import type { Equipment } from '../../../types/follower'
import { createOnHitShieldEffect } from '../effects'

export default {
  id: 'E022',
  name: '不朽护甲',
  description: '+5生命, 受击获得护盾',
  level: 4,
  bonuses: { health: 5 },
  effects: {
    onHit: [createOnHitShieldEffect(1, '不朽护甲')]
  },
  imageUrl: '/assets/equipment/e022.png'
} satisfies Equipment