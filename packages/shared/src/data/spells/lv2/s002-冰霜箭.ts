import type { Spell } from '../index'

export default {
  id: 'S002',
  name: '冰霜箭',
  description: '造成3点伤害，冻结目标1回合',
  level: 2,
  type: 'damage',
  effect: { type: 'damage_freeze', value: 3 },
  targetType: 'single_enemy',
  cost: 1,
  imageUrl: '/assets/spells/s002.png'
} satisfies Spell
