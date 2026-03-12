import type { Spell } from '../index'

export default {
  id: 'S037',
  name: '不朽祝福',
  description: '所有我方随从获得护盾×2',
  level: 5,
  type: 'buff',
  effect: { type: 'shield_all', value: 2 },
  targetType: 'all_allies',
  cost: 4,
  imageUrl: '/assets/spells/s037.png'
} satisfies Spell
