import { z } from 'zod'
import { followerInstanceSchema } from './follower'

export interface CampaignProgress {
  userId: string
  currentLevel: number
  maxHealth: number
  currentHealth: number
  gold: number
  followers: z.infer<typeof followerInstanceSchema>[]
  equipment: string[]
  spells: string[]
  isVictory: boolean
  isDefeated: boolean
  currentGameId?: string
}

export const campaignProgressSchema = z.object({
  userId: z.string(),
  currentLevel: z.number().min(1).max(10),
  maxHealth: z.number(),
  currentHealth: z.number(),
  gold: z.number(),
  followers: z.array(followerInstanceSchema),
  equipment: z.array(z.string()),
  spells: z.array(z.string()),
  isVictory: z.boolean(),
  isDefeated: z.boolean(),
  currentGameId: z.string().optional(),
})

export type CampaignProgressType = z.infer<typeof campaignProgressSchema>
