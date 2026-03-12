import type { Follower } from '../../types/follower'

import { FOLLOWERS_LV1 } from './lv1'
import { FOLLOWERS_LV2 } from './lv2'
import { FOLLOWERS_LV3 } from './lv3'
import { FOLLOWERS_LV4 } from './lv4'
import { FOLLOWERS_LV5 } from './lv5'
import { FOLLOWERS_LV6 } from './lv6'
import { FOLLOWERS_LV7 } from './lv7'

export { FOLLOWERS_LV1, FOLLOWERS_LV2, FOLLOWERS_LV3, FOLLOWERS_LV4, FOLLOWERS_LV5, FOLLOWERS_LV6, FOLLOWERS_LV7 }

export const ALL_FOLLOWERS: Follower[] = [
  ...FOLLOWERS_LV1,
  ...FOLLOWERS_LV2,
  ...FOLLOWERS_LV3,
  ...FOLLOWERS_LV4,
  ...FOLLOWERS_LV5,
  ...FOLLOWERS_LV6,
  ...FOLLOWERS_LV7
]

export const FOLLOWER_MAP: Record<string, Follower> = Object.fromEntries(
  ALL_FOLLOWERS.map(f => [f.id, f])
)

export function getFollower(id: string): Follower | undefined {
  return FOLLOWER_MAP[id]
}

export function getAllFollowers(): Follower[] {
  return ALL_FOLLOWERS
}

export function getFollowersByLevel(level: 1 | 2 | 3 | 4 | 5 | 6 | 7): Follower[] {
  return ALL_FOLLOWERS.filter(f => f.level === level)
}
