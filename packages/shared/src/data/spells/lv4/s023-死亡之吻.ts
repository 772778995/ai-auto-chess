import type { Spell } from '../index'

export default {
  id: 'S023',
  name: '死亡之吻',
  description: '消灭目标随从，如果目标星级≥4则获得2金币',
  level: 4,
  type: 'damage',
  effect: { type: 'kill', condition: 'gold_on_high_star' },
  targetType: 'single_enemy',
  cost: 3,
  imageUrl: '/assets/spells/s023.png'
} satisfies Spell
