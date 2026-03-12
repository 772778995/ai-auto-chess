import type { Spell } from '../index'

export default {
  id: 'S033',
  name: '死亡判决',
  description: '消灭目标随从',
  level: 5,
  type: 'damage',
  effect: { type: 'kill' },
  targetType: 'single_enemy',
  cost: 4,
  imageUrl: '/assets/spells/s033.png'
} satisfies Spell
