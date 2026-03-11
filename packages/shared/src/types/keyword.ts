// packages/shared/src/types/keyword.ts

/**
 * 此文件保留用于向后兼容
 * 新系统使用 follower.ts 中的 EffectDefinition, TriggerTiming 等类型
 */

import { z } from 'zod'

// ===== 向后兼容类型 =====

/**
 * @deprecated 新系统使用 Follower.effects 直接定义效果
 */
export interface Keyword {
  id: string
  name: string
  description: string
  trigger?: string
  effect: {
    type: string
    value?: number | string
    target: string
  }
  stacks?: boolean
  visible: boolean
}

// ===== 向后兼容 Zod 模式 =====

export const keywordSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: z.string().optional(),
  effect: z.object({
    type: z.string(),
    value: z.union([z.number(), z.string()]).optional(),
    target: z.string()
  }),
  stacks: z.boolean().optional(),
  visible: z.boolean()
})

export type KeywordType = z.infer<typeof keywordSchema>