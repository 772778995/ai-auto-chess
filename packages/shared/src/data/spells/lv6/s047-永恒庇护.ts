import type { Spell } from '../index'

export default {
  id: 'S047',
  name: '永恒庇护',
  description: '所有我方随从获得护盾×3',
  level: 6,
  type: 'buff',
  effect: { type: 'shield_all', value: 3 },
  targetType: 'all_allies',
  cost: 5,
  imageUrl: '/assets/spells/s047.png'
} satisfies Spell
