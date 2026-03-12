# 攻击/受伤 Effect 化设计

> 将普通攻击和受伤处理从硬编码重构为 effect 系统，支持特殊随从自定义攻击/受伤行为

---

## 设计目标

1. **攻击效果化**：`onAttack` effect 决定攻击行为，普通随从使用默认实现，特殊随从可覆盖
2. **受伤效果化**：`onTakeDamage` effect 处理伤害逻辑（护盾、扣血等）
3. **事件传递**：`onAttack` 返回 `DamageEvent`，战斗系统传递给目标的 `onTakeDamage`
4. **纯函数**：所有 effect 返回 `{ gameState, events }`，无副作用

---

## 核心数据结构

### EffectResult（效果返回值）

```typescript
interface EffectResult {
  gameState: GameState
  events?: GameEvent[]
}
```

### EffectFunction（效果函数签名）

```typescript
type EffectFunction = (ctx: EffectContext) => EffectResult
```

### GameEvent（游戏事件）

```typescript
type GameEvent = DamageEvent | HealEvent | SummonEvent | DeathEvent

// 伤害事件
interface DamageEvent {
  type: 'damage'
  targets: FollowerInstance[]    // 支持群体目标
  value: number
  damageType: 'physical' | 'magical' | 'true'
  source?: FollowerInstance
}

// 治疗事件
interface HealEvent {
  type: 'heal'
  targets: FollowerInstance[]
  value: number
}

// 召唤事件
interface SummonEvent {
  type: 'summon'
  followers: FollowerInstance[]
  positions: BattlePosition[]
}

// 死亡事件
interface DeathEvent {
  type: 'death'
  follower: FollowerInstance
}
```

---

## 触发时机

```typescript
type TriggerTiming =
  | 'onEnter'        // 入场
  | 'onGrowth'       // 成长
  | 'onFirstStrike'  // 先手
  | 'onAttack'       // 攻击时（新增）
  | 'onTakeDamage'   // 受伤时（新增）
  | 'onHit'          // 受伤后
  | 'onKill'         // 击杀
  | 'onDeath'        // 死亡（遗言）
  | 'onRoundEnd'     // 回合结束
```

---

## 默认效果

### defaultOnAttack

```typescript
const defaultOnAttack: EffectFunction = (ctx: EffectContext): EffectResult => {
  const stats = getCurrentStats(ctx.self)
  const target = ctx.tools.getRandomEnemy(ctx.gameState, ctx.self.position)
  
  if (!target) {
    return { gameState: ctx.gameState }
  }
  
  return {
    gameState: ctx.gameState,
    events: [{
      type: 'damage',
      targets: [target],
      value: stats.attack,
      damageType: 'physical',
      source: ctx.self
    }]
  }
}
```

### defaultOnTakeDamage

```typescript
const defaultOnTakeDamage: EffectFunction = (ctx: EffectContext): EffectResult => {
  const newState = ctx.tools.cloneDeep(ctx.gameState)
  const damageEvent = ctx.event as DamageEvent
  const self = newState.allies.find(f => f.instanceId === ctx.self.instanceId)
  
  if (!self || !damageEvent) {
    return { gameState: newState }
  }
  
  // 护盾处理
  const shieldStatus = self.statusList.find(s => s.shield && s.shield > 0)
  if (shieldStatus) {
    shieldStatus.shield!--
    if (shieldStatus.shield === 0) {
      self.statusList = self.statusList.filter(s => s !== shieldStatus)
    }
    return { gameState: newState }  // 护盾抵消伤害
  }
  
  // 扣血
  self.currentHealth -= damageEvent.value
  
  return { gameState: newState }
}
```

---

## 特殊随从示例

### 不死之王（自定义攻击）

```typescript
const UNDEAD_KING: Follower = {
  id: 'F601',
  name: '不死之王',
  description: '攻击时不造成伤害，而是召唤一个亡灵骷髅',
  level: 6,
  baseAttack: 4,
  baseHealth: 6,
  effects: {
    onAttack: (ctx: EffectContext): EffectResult => {
      const newState = ctx.tools.cloneDeep(ctx.gameState)
      
      const skeleton: FollowerInstance = {
        instanceId: crypto.randomUUID(),
        id: 'F_SKELETON',
        name: '亡灵骷髅',
        description: '',
        level: 1,
        baseAttack: 2,
        baseHealth: 1,
        ownerId: ctx.self.ownerId,
        position: ctx.tools.getRandomEmptyPosition(newState, ctx.self.ownerId),
        currentHealth: 1,
        statusList: [],
        equipment: [],
        equipmentSlots: 1,
        imageUrl: '/assets/followers/skeleton.png'
      }
      
      return {
        gameState: newState,
        events: [{
          type: 'summon',
          followers: [skeleton],
          positions: [skeleton.position]
        }]
      }
    }
  },
  equipmentSlots: 2,
  imageUrl: '/assets/followers/undead_king.png'
}
```

---

## 战斗流程

```typescript
function executeBattle(gameState: GameState): GameState {
  let state = cloneDeep(gameState)
  
  // 1. 触发成长效果
  state = triggerEffects(state, 'onGrowth')
  
  // 2. 拼点决定先后攻
  const firstAttacker = rollDice(state)
  let attackerSide = firstAttacker
  
  // 3. 触发先手效果
  state = triggerEffects(state, 'onFirstStrike', firstAttacker)
  
  // 4. 战斗循环
  while (hasAliveFollowers(state, 'ally') && hasAliveFollowers(state, 'enemy')) {
    const attacker = getNextAttacker(state, attackerSide)
    if (!attacker) break
    
    // 执行攻击效果
    const attackResult = executeEffect(attacker, 'onAttack', state)
    state = attackResult.gameState
    
    // 处理事件
    for (const event of attackResult.events ?? []) {
      state = processEvent(state, event, attacker)
    }
    
    attackerSide = attackerSide === 'ally' ? 'enemy' : 'ally'
  }
  
  return state
}

function processEvent(state: GameState, event: GameEvent, source: FollowerInstance): GameState {
  switch (event.type) {
    case 'damage':
      return processDamageEvent(state, event)
    case 'summon':
      return processSummonEvent(state, event)
    case 'heal':
      return processHealEvent(state, event)
    default:
      return state
  }
}

function processDamageEvent(state: GameState, event: DamageEvent): GameState {
  let newState = state
  
  for (const target of event.targets) {
    const targetInstance = findFollower(newState, target.instanceId)
    if (targetInstance) {
      const ctx: EffectContext = {
        gameState: newState,
        self: targetInstance,
        tools: effectTools,
        event
      }
      
      const takeDamageEffect = targetInstance.effects.onTakeDamage ?? defaultOnTakeDamage
      const result = takeDamageEffect(ctx)
      newState = result.gameState
      
      // 检查死亡
      if (targetInstance.currentHealth <= 0) {
        newState = processDeath(newState, targetInstance)
      }
    }
  }
  
  return newState
}
```

---

## 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `packages/shared/src/types/follower.ts` | 修改 | 添加 `EffectResult`、新增 `onAttack`、`onTakeDamage` |
| `packages/shared/src/types/game.ts` | 修改 | 添加事件类型定义 |
| `packages/shared/src/utils/effects.ts` | 创建 | 默认效果函数 |
| `packages/server/src/services/battle.ts` | 创建 | 战斗系统核心逻辑 |
| `packages/shared/src/data/followers.ts` | 修改 | 更新随从数据 |

---

## 与原词条系统重构的关系

本次设计是 `2026-03-11-词条系统重构-design.md` 的**增量扩展**：

| 方面 | 原重构 | 本次扩展 |
|------|--------|----------|
| EffectFunction 返回值 | `unknown` | 明确为 `EffectResult` |
| 触发时机 | 8 种 | 新增 `onAttack`、`onTakeDamage` |
| 事件系统 | 无 | 新增 `GameEvent` 类型系统 |
| 默认效果 | 无 | 提供 `defaultOnAttack`、`defaultOnTakeDamage` |

---

## 待后续讨论

**前端动画渲染**：服务端执行逻辑后，前端如何精准渲染每个事件（如攻击动画、受伤动画、召唤动画等）

---

## 版本信息

- **设计日期**: 2026-03-12
- **依赖**: `2026-03-11-词条系统重构-design.md`
