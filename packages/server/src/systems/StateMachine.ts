export type GamePhase = 
  | 'lobby'
  | 'hero_select'
  | 'recruit'
  | 'combat'
  | 'settlement'
  | 'ended'

// 战斗子阶段：拼点 → 战斗 → 结果
export type CombatSubPhase = 'dice_roll' | 'fighting' | 'result'

const STATE_TRANSITIONS: Record<GamePhase, GamePhase[]> = {
  'lobby': ['hero_select'],
  'hero_select': ['recruit'],
  'recruit': ['combat', 'ended'],
  'combat': ['settlement'],
  'settlement': ['recruit', 'ended'],
  'ended': []
}

interface StateMachineState {
  phase: GamePhase
  subPhase?: CombatSubPhase  // 仅战斗阶段有子阶段
  round: number
}

export function createStateMachine(initialPhase: GamePhase) {
  let state: StateMachineState = {
    phase: initialPhase,
    round: 1
  }

  return {
    getState(): GamePhase {
      return state.phase
    },

    getSubPhase(): CombatSubPhase | undefined {
      return state.subPhase
    },

    getRound(): number {
      return state.round
    },

    canTransitionTo(targetPhase: GamePhase): boolean {
      return STATE_TRANSITIONS[state.phase]?.includes(targetPhase) ?? false
    },

    transitionTo(targetPhase: GamePhase): void {
      if (!this.canTransitionTo(targetPhase)) {
        throw new Error(
          `Invalid transition from ${state.phase} to ${targetPhase}`
        )
      }
      state.phase = targetPhase
      if ('subPhase' in state) {
        delete state.subPhase
      }

      if (targetPhase === 'recruit') {
        state.round++
      }
    },

    setSubPhase(subPhase: CombatSubPhase): void {
      state.subPhase = subPhase
    },

    getFullState(): StateMachineState {
      return { ...state }
    },

    setFullState(newState: StateMachineState): void {
      state = { ...newState }
    }
  }
}

export type StateMachine = ReturnType<typeof createStateMachine>
