import type { Spell } from '../index'

export default {
  id: 'S027',
  name: '护盾祝福',
  description: '所有我方随从获得护盾',
  level: 4,
  type: 'buff',
  effect: { type: 'shield_all' },
  targetType: 'all_allies',
  cost: 3,
  imageUrl: '/assets/spells/s027.png'
} satisfies Spell
