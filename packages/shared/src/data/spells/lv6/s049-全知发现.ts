import type { Spell } from '../index'

export default {
  id: 'S049',
  name: '全知发现',
  description: '发现1张任意星级卡牌',
  level: 6,
  type: 'discover',
  effect: { type: 'discover_any' },
  targetType: 'self',
  cost: 5,
  imageUrl: '/assets/spells/s049.png'
} satisfies Spell
