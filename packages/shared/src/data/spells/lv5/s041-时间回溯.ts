import type { Spell } from '../index'

export default {
  id: 'S041',
  name: '时间回溯',
  description: '重置所有随从状态（移除debuff）',
  level: 5,
  type: 'special',
  effect: { type: 'reset' },
  targetType: 'all_allies',
  cost: 4,
  imageUrl: '/assets/spells/s041.png'
} satisfies Spell
