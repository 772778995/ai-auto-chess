import type { Spell } from '../index'

export default {
  id: 'S012',
  name: '暗影箭',
  description: '造成6点伤害，如果目标死亡则返回手牌',
  level: 3,
  type: 'damage',
  effect: { type: 'damage', value: 6, condition: 'return_on_death' },
  targetType: 'single_enemy',
  cost: 2,
  imageUrl: '/assets/spells/s012.png'
} satisfies Spell
