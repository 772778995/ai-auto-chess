import type { Spell } from '../index'

export default {
  id: 'S036',
  name: '军团祝福',
  description: '所有我方随从+5/+5',
  level: 5,
  type: 'buff',
  effect: { type: 'buff_all', value: 5 },
  targetType: 'all_allies',
  cost: 4,
  imageUrl: '/assets/spells/s036.png'
} satisfies Spell
