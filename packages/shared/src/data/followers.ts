import type { Follower } from '../types/follower'

export type { Follower, FollowerInstance } from '../types/follower'

// 导入各星级随从
import { FOLLOWERS_1STAR } from './followers-1star'
import { FOLLOWERS_2STAR } from './followers-2star'
import { FOLLOWERS_3STAR } from './followers-3star'
import { FOLLOWERS_4STAR } from './followers-4star'
import { FOLLOWERS_5STAR } from './followers-5star'
import { FOLLOWERS_6STAR } from './followers-6star'
import { FOLLOWERS_SPECIAL } from './followers-special'

// 合并所有随从
export const FOLLOWERS: Record<string, Follower> = {
  ...FOLLOWERS_1STAR,
  ...FOLLOWERS_2STAR,
  ...FOLLOWERS_3STAR,
  ...FOLLOWERS_4STAR,
  ...FOLLOWERS_5STAR,
  ...FOLLOWERS_6STAR,
  ...FOLLOWERS_SPECIAL
}

// 快捷获取随从
export function getFollower(id: string): Follower | undefined {
  return FOLLOWERS[id]
}

// 获取所有随从
export function getAllFollowers(): Follower[] {
  return Object.values(FOLLOWERS)
}

// 按星级获取随从
export function getFollowersByLevel(level: 1 | 2 | 3 | 4 | 5 | 6): Follower[] {
  return Object.values(FOLLOWERS).filter(f => f.level === level)
}