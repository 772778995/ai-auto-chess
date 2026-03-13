import { describe, it, expect } from 'vitest'
import { createStateMachine, GamePhase } from './StateMachine'

describe('StateMachine', () => {
  it('should create initial state', () => {
    const sm = createStateMachine('lobby')
    expect(sm.getState()).toBe('lobby')
  })

  it('should allow valid transition', () => {
    const sm = createStateMachine('lobby')
    expect(sm.canTransitionTo('hero_select')).toBe(true)
    sm.transitionTo('hero_select')
    expect(sm.getState()).toBe('hero_select')
  })

  it('should reject invalid transition', () => {
    const sm = createStateMachine('lobby')
    expect(sm.canTransitionTo('combat')).toBe(false)
    expect(() => sm.transitionTo('combat')).toThrow()
  })

  it('should track subPhase in combat', () => {
    const sm = createStateMachine('combat')
    sm.setSubPhase('dice_roll')
    expect(sm.getSubPhase()).toBe('dice_roll')
    sm.setSubPhase('fighting')
    expect(sm.getSubPhase()).toBe('fighting')
  })

  it('should increment round when transitioning to recruit', () => {
    const sm = createStateMachine('hero_select')
    sm.transitionTo('recruit')
    expect(sm.getRound()).toBe(2) // 从 1 增加到 2
  })
})
