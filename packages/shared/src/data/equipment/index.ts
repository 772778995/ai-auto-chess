// 装备数据索引
import type { Equipment } from '../../types/follower'

import { EQUIPMENT_LV2 } from './lv2'
import { EQUIPMENT_LV3 } from './lv3'
import { EQUIPMENT_LV4 } from './lv4'
import { EQUIPMENT_LV5 } from './lv5'
import { EQUIPMENT_LV6 } from './lv6'

// 导出效果辅助函数
export * from './effects'

// 导出各等级装备数组
export { EQUIPMENT_LV2, EQUIPMENT_LV3, EQUIPMENT_LV4, EQUIPMENT_LV5, EQUIPMENT_LV6 }

// 导出单卡（按等级）
export * from './lv2'
export * from './lv3'
export * from './lv4'
export * from './lv5'
export * from './lv6'

// 所有装备数组
export const ALL_EQUIPMENT: Equipment[] = [
  ...EQUIPMENT_LV2,
  ...EQUIPMENT_LV3,
  ...EQUIPMENT_LV4,
  ...EQUIPMENT_LV5,
  ...EQUIPMENT_LV6
]

// 装备 ID 映射
export const EQUIPMENT_MAP: Record<string, Equipment> = Object.fromEntries(
  ALL_EQUIPMENT.map(e => [e.id, e])
)

// 辅助函数
export function getEquipment(id: string): Equipment | undefined {
  return EQUIPMENT_MAP[id]
}

export function getAllEquipment(): Equipment[] {
  return ALL_EQUIPMENT
}

export function getEquipmentByLevel(level: 2 | 3 | 4 | 5 | 6): Equipment[] {
  switch (level) {
    case 2: return EQUIPMENT_LV2
    case 3: return EQUIPMENT_LV3
    case 4: return EQUIPMENT_LV4
    case 5: return EQUIPMENT_LV5
    case 6: return EQUIPMENT_LV6
  }
}
