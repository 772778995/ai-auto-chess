// packages/shared/src/types/command.test.ts
import { describe, it, expect } from 'vitest'
import {
  CommandType,
  CommandTypeValues,
  Command,
  CommandResult,
  StateChange,
  CommandPayload,
  BuyPayload,
  SellPayload,
  RefreshPayload,
  LockPayload,
  UpgradePayload,
  MovePayload,
  EquipPayload,
  UseSpellPayload,
  ConfirmPayload,
  commandTypeSchema,
  commandSchema,
  commandResultSchema,
  stateChangeSchema,
  buyPayloadSchema,
  sellPayloadSchema,
  refreshPayloadSchema,
  lockPayloadSchema,
  upgradePayloadSchema,
  movePayloadSchema,
  equipPayloadSchema,
  useSpellPayloadSchema,
  confirmPayloadSchema,
} from './command'

describe('Command types', () => {
  describe('CommandType', () => {
    it('should define all CommandType values', () => {
      expect(CommandTypeValues.BUY).toBe('BUY')
      expect(CommandTypeValues.SELL).toBe('SELL')
      expect(CommandTypeValues.REFRESH).toBe('REFRESH')
      expect(CommandTypeValues.LOCK).toBe('LOCK')
      expect(CommandTypeValues.UPGRADE).toBe('UPGRADE')
      expect(CommandTypeValues.MOVE).toBe('MOVE')
      expect(CommandTypeValues.EQUIP).toBe('EQUIP')
      expect(CommandTypeValues.USE_SPELL).toBe('USE_SPELL')
      expect(CommandTypeValues.CONFIRM).toBe('CONFIRM')
    })

    it('should validate CommandType with schema', () => {
      expect(commandTypeSchema.parse('BUY')).toBe('BUY')
      expect(commandTypeSchema.parse('SELL')).toBe('SELL')
      expect(commandTypeSchema.parse('REFRESH')).toBe('REFRESH')
      expect(() => commandTypeSchema.parse('INVALID')).toThrow()
    })
  })

  describe('Command structure', () => {
    it('should validate Command structure', () => {
      const command: Command = {
        id: 'cmd-1',
        playerId: 'player-1',
        type: 'BUY',
        timestamp: Date.now(),
        payload: { shopSlot: 0, type: 'follower' },
      }
      
      const parsed = commandSchema.parse(command)
      expect(parsed.id).toBe('cmd-1')
      expect(parsed.type).toBe('BUY')
    })

    it('should validate Command with result', () => {
      const command: Command = {
        id: 'cmd-2',
        playerId: 'player-1',
        type: 'SELL',
        timestamp: Date.now(),
        payload: { source: 'hand', position: 0 },
        result: {
          success: true,
          changes: [],
        },
      }
      
      const parsed = commandSchema.parse(command)
      expect(parsed.result?.success).toBe(true)
    })

    it('should reject invalid Command', () => {
      expect(() => commandSchema.parse({})).toThrow()
      expect(() => commandSchema.parse({ id: 'test' })).toThrow()
    })
  })

  describe('CommandResult', () => {
    it('should validate CommandResult', () => {
      const result: CommandResult = {
        success: true,
        changes: [],
      }
      
      const parsed = commandResultSchema.parse(result)
      expect(parsed.success).toBe(true)
    })

    it('should validate CommandResult with errorCode', () => {
      const result: CommandResult = {
        success: false,
        errorCode: 'INSUFFICIENT_GOLD',
        changes: [],
      }
      
      const parsed = commandResultSchema.parse(result)
      expect(parsed.success).toBe(false)
      expect(parsed.errorCode).toBe('INSUFFICIENT_GOLD')
    })
  })

  describe('StateChange', () => {
    it('should validate StateChange', () => {
      const change: StateChange = {
        path: 'player.gold',
        oldValue: 10,
        newValue: 5,
      }
      
      const parsed = stateChangeSchema.parse(change)
      expect(parsed.path).toBe('player.gold')
    })
  })

  describe('BuyPayload', () => {
    it('should validate BuyPayload', () => {
      const payload: BuyPayload = {
        shopSlot: 0,
        type: 'follower',
      }
      
      const parsed = buyPayloadSchema.parse(payload)
      expect(parsed.shopSlot).toBe(0)
      expect(parsed.type).toBe('follower')
    })

    it('should validate BuyPayload with targetPosition', () => {
      const payload: BuyPayload = {
        shopSlot: 1,
        type: 'equipment',
        targetPosition: 2,
      }
      
      const parsed = buyPayloadSchema.parse(payload)
      expect(parsed.targetPosition).toBe(2)
    })

    it('should reject invalid BuyPayload type', () => {
      expect(() => buyPayloadSchema.parse({ shopSlot: 0, type: 'invalid' })).toThrow()
    })
  })

  describe('SellPayload', () => {
    it('should validate SellPayload', () => {
      const payload: SellPayload = {
        source: 'hand',
        position: 0,
      }
      
      const parsed = sellPayloadSchema.parse(payload)
      expect(parsed.source).toBe('hand')
      expect(parsed.position).toBe(0)
    })

    it('should validate SellPayload from battlefield', () => {
      const payload: SellPayload = {
        source: 'battlefield',
        position: 3,
      }
      
      const parsed = sellPayloadSchema.parse(payload)
      expect(parsed.source).toBe('battlefield')
    })
  })

  describe('RefreshPayload', () => {
    it('should validate RefreshPayload', () => {
      const payload: RefreshPayload = {}
      
      const parsed = refreshPayloadSchema.parse(payload)
      expect(parsed).toBeDefined()
    })
  })

  describe('LockPayload', () => {
    it('should validate LockPayload', () => {
      const payload: LockPayload = {
        locked: true,
      }
      
      const parsed = lockPayloadSchema.parse(payload)
      expect(parsed.locked).toBe(true)
    })
  })

  describe('UpgradePayload', () => {
    it('should validate UpgradePayload', () => {
      const payload: UpgradePayload = {}
      
      const parsed = upgradePayloadSchema.parse(payload)
      expect(parsed).toBeDefined()
    })
  })

  describe('MovePayload', () => {
    it('should validate MovePayload', () => {
      const payload: MovePayload = {
        from: { source: 'hand', position: 0 },
        to: { source: 'battlefield', position: 2 },
      }
      
      const parsed = movePayloadSchema.parse(payload)
      expect(parsed.from.source).toBe('hand')
      expect(parsed.to.position).toBe(2)
    })
  })

  describe('EquipPayload', () => {
    it('should validate EquipPayload', () => {
      const payload: EquipPayload = {
        equipmentId: 'equip-1',
        followerPosition: 2,
      }
      
      const parsed = equipPayloadSchema.parse(payload)
      expect(parsed.equipmentId).toBe('equip-1')
      expect(parsed.followerPosition).toBe(2)
    })
  })

  describe('UseSpellPayload', () => {
    it('should validate UseSpellPayload without targets', () => {
      const payload: UseSpellPayload = {
        spellId: 'spell-1',
      }
      
      const parsed = useSpellPayloadSchema.parse(payload)
      expect(parsed.spellId).toBe('spell-1')
    })

    it('should validate UseSpellPayload with targets', () => {
      const payload: UseSpellPayload = {
        spellId: 'spell-2',
        targets: ['follower-1', 'follower-2'],
      }
      
      const parsed = useSpellPayloadSchema.parse(payload)
      expect(parsed.targets).toHaveLength(2)
    })
  })

  describe('ConfirmPayload', () => {
    it('should validate ConfirmPayload', () => {
      const payload: ConfirmPayload = {}
      
      const parsed = confirmPayloadSchema.parse(payload)
      expect(parsed).toBeDefined()
    })
  })

  describe('CommandPayload union', () => {
    it('should accept all payload types', () => {
      const payloads: CommandPayload[] = [
        { shopSlot: 0, type: 'follower' },
        { source: 'hand', position: 0 },
        {},
        { locked: true },
        { from: { source: 'hand', position: 0 }, to: { source: 'battlefield', position: 0 } },
      ]
      
      expect(payloads).toHaveLength(5)
    })
  })
})
