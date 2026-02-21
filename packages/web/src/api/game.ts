import type { ApiClient } from './client'

export interface GameApi {
  // TODO: Implement game API methods
}

export function game(_client: ApiClient): GameApi {
  return {
    // TODO: Implement game API
  }
}

export type { GameState, PlayerInputPayload } from '@game/shared'