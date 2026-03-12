import type { Spell } from '../index'

export default {
  id: 'S043',
  name: '死亡之翼的吐息',
  description: '消灭所有敌方随从',
  level: 6,
  type: 'damage',
  effect: { type: 'kill' },
  targetType: 'all_enemies',
  cost: 5,
  imageUrl: '/assets/spells/s043.png'
} satisfies Spell
