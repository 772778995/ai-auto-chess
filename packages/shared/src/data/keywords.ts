// packages/shared/src/data/keywords.ts
// 此文件保留用于向后兼容，新系统不再使用独立的 keywords 表

import type { Keyword } from '../types/keyword'

/**
 * @deprecated 新系统使用 Follower.effects 直接定义效果
 * 新随从不再使用此表
 */
export const KEYWORDS: Record<string, Keyword> = {
  // 保留空的词条表用于向后兼容
  // 如需迁移旧随从，可在此添加词条定义
}

/**
 * @deprecated 使用 Follower.effects 代替
 */
export function getKeyword(id: string): Keyword | undefined {
  return KEYWORDS[id]
}

/**
 * @deprecated 使用 Follower.effects 代替
 */
export function getAllKeywords(): Keyword[] {
  return Object.values(KEYWORDS)
}

export * from '../types/keyword'
