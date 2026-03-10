---
name: generate-card
description: 生成新的游戏卡牌（随从/装备/咒术），通过对话引导用户完善卡牌信息并验证合理性
---

# 生成游戏卡牌

## 概述

通过对话交互引导用户创建新的游戏卡牌，包含随从、装备、咒术三种类型。技能会询问用户需求，验证卡牌效果的合理性，并生成可运行的 TypeScript 代码。

## 适用场景

- 创建新的随从卡牌
- 创建新的装备卡牌
- 创建新的咒术卡牌

## 重要原则

**在呈现生成的代码之前，必须完成所有验证和用户确认环节。**

---

## 工作流

### 阶段 1：询问基本信息

用户启动技能后，欢迎用户并开始询问：

```
欢迎使用生成卡牌技能！我将引导你创建一张新的游戏卡牌。

首先，请告诉我：
1. 卡牌类型是什么？（随从/装备/咒术）
```

使用 `ask_user_question` 工具进行多选题询问。

### 阶段 2：询问类型特定信息

根据卡牌类型继续询问：

**随从卡牌：**
- 星级（1-6）
- 名称
- 攻击/生命基础值
- 随从类型（攻击型/防御型/成长型/召唤型/功能型）
- 词条效果描述

**装备卡牌：**
- 星级（2-6）
- 名称
- 装备类型（攻击型/防御型/功能型）
- 基础效果
- 词条效果描述

**咒术卡牌：**
- 星级（2-6）
- 名称
- 咒术类型（伤害型/增益型/发现型/功能型）
- 效果描述
- 目标类型

### 阶段 3：验证合理性

#### 3.1 时机验证

检查词条效果是否在正确的时机触发：

| 词条类型 | 有效触发时机 | 无效原因 |
|----------|--------------|----------|
| 入场 (Battlecry) | 招募阶段（购买随从时） | 此时没有敌对目标，无法造成伤害 |
| 成长 (Growth) | 准备阶段结束/战斗开始前 | - |
| 先手 (First Strike) | 战斗开始前 | - |
| 击杀 (On Kill) | 战斗过程中 | - |
| 遗言 (Deathrattle) | 随从死亡时 | - |
| 受击 (On Damaged) | 受到伤害时 | - |
| 准备 (Prepare) | 战斗结束后 | - |

**验证规则：**
- ❌ "入场造成伤害" - 无效（招募阶段没有敌人）
- ❌ "入场随机攻击一个敌人" - 无效（同上）
- ✅ "入场获得护盾" - 有效（可以给自己施加状态）
- ✅ "入场获得1金币" - 有效（经济效果）
- ✅ "成长+1/+1" - 有效（战斗前触发）

如果发现不合理的效果：
1. 向用户解释为什么不合理
2. 提出修改建议
3. 询问用户是否修改

#### 3.2 词条冲突验证

检查词条之间是否会产生冲突：

| 组合 | 冲突类型 | 处理方式 |
|------|----------|----------|
| 击杀+遗言 | 击杀立即消灭目标，遗言无法触发 | 询问用户优先级 |
| 成长+变形 | 变形会替换随从，成长效果可能丢失 | 提醒用户 |
| 多个相同触发时机 | 效果叠加可能导致问题 | 验证叠加逻辑 |

#### 3.3 代码正确性验证

生成 TypeScript 代码后：
1. 检查类型是否匹配现有类型定义
2. 检查必需字段是否完整
3. 检查枚举值是否有效

如果发现问题：
1. 向用户说明问题
2. 提供修复方案
3. 重新生成代码

### 阶段 4：用户确认

完成验证后，向用户呈现：
1. 卡牌基本信息摘要
2. 词条效果说明
3. 生成的代码预览

询问用户是否：
- 确认并生成代码
- 修改某个部分
- 取消操作

### 阶段 5：生成代码

用户确认后：

1. **生成 ID**：根据卡牌类型生成唯一 ID
   - 随从：FXXX（如 F001, F002）
   - 装备：EXXX（如 E001, E002）
   - 咒术：SXXX（如 S001, S002）

2. **生成 imageUrl**：使用 DiceBear API
   ```
   https://api.dicebear.com/7.x/identicon/svg?seed={name}
   ```

3. **写入数据文件**：
   - 随从：`packages/shared/src/data/followers.ts`
   - 装备：`packages/shared/src/data/equipment.ts`
   - 咒术：`packages/shared/src/data/spells.ts`

4. **验证构建**：运行 `bun run build` 确保类型正确

---

## 卡牌数据结构参考

### 随从 (Follower)

```typescript
interface Follower {
  id: string           // 唯一标识，如 "F001"
  name: string         // 名称
  description: string  // 描述
  level: 1 | 2 | 3 | 4 | 5 | 6  // 星级
  attack: number       // 基础攻击
  health: number      // 基础生命
  shield?: number      // 初始护盾
  keywords: Keyword[] // 词条数组
  equipmentSlots: number  // 装备槽位数
  imageUrl: string    // 图片 URL
}
```

### 装备 (Equipment)

```typescript
interface Equipment {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  type: 'attack' | 'defense' | 'special'
  attackBonus?: number
  healthBonus?: number
  shieldBonus?: number
  keywords: EquipmentKeyword[]
  imageUrl: string
}
```

### 咒术 (Spell)

```typescript
interface Spell {
  id: string
  name: string
  description: string
  level: 2 | 3 | 4 | 5 | 6
  type: 'damage' | 'buff' | 'discover' | 'special'
  effect: SpellEffect
  targetType: SpellTargetType
  cost: number
  imageUrl: string
}
```

---

## 示例对话

### 正确流程

**用户**：我想创建一个随从

**你**：
```
欢迎使用生成卡牌技能！我将引导你创建一张新的游戏卡牌。

请选择卡牌类型：
1. 随从 - 战场上的单位
2. 装备 - 附着在随从身上的装备
3. 咒术 - 具有特殊效果的一次性卡牌
```

**用户**：随从

**你**：
```
好的，你选择了【随从】。

请告诉我：
1. 星级（1-6）：[1星]
2. 名称：[火焰精灵]
3. 攻击值：[2]
4. 生命值：[1]
5. 词条效果描述：[入场造成2点伤害]
```

**你**（验证发现问题）：
```
⚠️ 发现问题！

你描述的"入场造成2点伤害"存在时机问题：

【原因】
入场（Battlecry）效果在招募阶段触发，此时随从刚从商店购买并放置到战场网格上，**没有敌对目标**可以被造成伤害。

【建议修改方案】
1. 改为"入场获得1金币"
2. 改为"成长+1攻击"
3. 改为"入场抽牌"

你希望如何修改？
```

**用户**：那就改成"入场获得1金币"

**你**：
```
好的，修改为"入场获得1金币"。

【卡牌信息摘要】
- ID: F064
- 名称: 火焰精灵
- 星级: 1星
- 攻击/生命: 2/1
- 类型: 攻击型
- 词条: 入场获得1金币

生成的代码：
```typescript
'F064': {
  id: 'F064',
  name: '火焰精灵',
  description: '入场获得1金币',
  level: 1,
  attack: 2,
  health: 1,
  keywords: [{ id: 'bc_gold', name: '入场金币', description: '入场获得1金币', trigger: 'on_enter', effect: { type: 'heal', target: 'self' }, visible: true }],
  equipmentSlots: 2,
  imageUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=火焰精灵'
}
```

请确认：
1. 确认并生成代码
2. 修改某个部分
3. 取消操作
```

**用户**：确认

**你**：
```
[写入代码到 followers.ts]
[运行 bun run build 验证类型]
✅ 卡牌生成成功！

火焰精灵（F064）已添加到随从数据中。
```

---

## 注意事项

1. **不要跳过验证环节** - 即使效果看起来合理，也要检查时机和冲突
2. **每次只问一个问题** - 保持对话节奏
3. **使用多选题** - 比开放式问题更容易回答
4. **imageUrl 统一使用 DiceBear** - 保证一致性
5. **验证后要用户确认** - 不能直接生成代码

## 关联技能

- **edit-card** - 编辑现有卡牌
- **verification-before-completion** - 验证生成结果
