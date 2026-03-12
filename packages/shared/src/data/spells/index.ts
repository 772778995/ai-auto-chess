// 咒术类型定义
export interface Spell {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  type: 'damage' | 'buff' | 'discover' | 'special'
  effect: SpellEffect
  targetType: SpellTargetType
  cost: number
  imageUrl: string
}

export interface SpellEffect {
  type: SpellEffectType
  value?: number
  condition?: string
}

export type SpellEffectType =
  | 'damage'
  | 'damage_splash'
  | 'damage_freeze'
  | 'buff_single'
  | 'buff_all'
  | 'shield_single'
  | 'shield_all'
  | 'kill'
  | 'discover_follower'
  | 'discover_equipment'
  | 'discover_spell'
  | 'gold'
  | 'summon'
  | 'resurrect'
  | 'transform'
  | 'copy'
  | 'reset'
  | 'dice_win'
  | 'discover_any'

export type SpellTargetType =
  | 'single_enemy'
  | 'single_ally'
  | 'all_enemies'
  | 'all_allies'
  | 'all'
  | 'empty'
  | 'self'

// 导入各等级咒术
import { SPELLS_LV2 } from './lv2'
import { SPELLS_LV3 } from './lv3'
import { SPELLS_LV4 } from './lv4'
import { SPELLS_LV5 } from './lv5'
import { SPELLS_LV6 } from './lv6'

// 导出等级分组
export { SPELLS_LV2, SPELLS_LV3, SPELLS_LV4, SPELLS_LV5, SPELLS_LV6 }

// 所有咒术列表
export const ALL_SPELLS: Spell[] = [
  ...SPELLS_LV2,
  ...SPELLS_LV3,
  ...SPELLS_LV4,
  ...SPELLS_LV5,
  ...SPELLS_LV6
]

// 咒术映射表
export const SPELL_MAP: Record<string, Spell> = Object.fromEntries(
  ALL_SPELLS.map(s => [s.id, s])
)

// 兼容旧接口
export const SPELLS = SPELL_MAP

// 快捷获取咒术
export function getSpell(id: string): Spell | undefined {
  return SPELL_MAP[id]
}

// 获取所有咒术
export function getAllSpells(): Spell[] {
  return ALL_SPELLS
}

// 按星级获取咒术
export function getSpellsByLevel(level: 2 | 3 | 4 | 5 | 6): Spell[] {
  switch (level) {
    case 2: return SPELLS_LV2
    case 3: return SPELLS_LV3
    case 4: return SPELLS_LV4
    case 5: return SPELLS_LV5
    case 6: return SPELLS_LV6
  }
}

// 按类型获取咒术
export function getSpellsByType(type: 'damage' | 'buff' | 'discover' | 'special'): Spell[] {
  return ALL_SPELLS.filter(s => s.type === type)
}
