# AGENTS.md - 项目上下文文件

> 本文件为 AI 助手提供项目上下文，帮助理解和协作开发

---

## 项目概述

**月圆之夜 - 镜中对决 修改版** - 一个基于 Vue 3 + Phaser + Hono.js 的全栈 TypeScript 卡牌自走棋游戏项目。

### 当前阶段

**单机闯关模式** - 10关路线图，参考杀戮尖塔设计

### 核心玩法

招募随从、装备道具、使用咒术、自动战斗、闯关roguelike

### 关键规则

| 修改项 | 说明 |
|--------|------|
| 横屏布局 | 3×2 战场站位 |
| 标签系统 | 使用 `tags[]` 数组替代种族系统 |
| 拼点机制 | 战斗前拼点决定先攻权 |

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + Phaser 3 + Pinia + UnoCSS + Vite |
| 后端 | Hono.js + Bun + PostgreSQL + WebSocket |
| 共享 | TypeScript + Zod + msgpackr |

---

## 项目结构

```
ai-game/
├── packages/
│   ├── shared/      # 类型、常量、数据
│   ├── server/     # 后端服务
│   └── web/        # 前端应用
└── docs/
    ├── design/     # 游戏设计文档（静态）
    ├── plans/      # 实现计划（TDD 计划）
    └── roadmap/    # 开发路线图（任务池）
```

---

## 开发命令

```bash
bun install                      # 安装依赖
cd packages/shared && bun run build  # 构建共享包
docker-compose up -d            # 启动数据库
bun run dev                     # 启动开发服务器
bun run build                   # 构建
```

---

## 重要规则：设计文档优先

**在做任何涉及游戏系统的开发之前，必须先阅读对应的设计文档。**

| 系统 | 必须阅读的文档 |
|------|----------------|
| 词条系统 | `docs/design/2026-02-24-词条系统-design.md` |
| 经济系统 | `docs/design/2026-02-24-经济系统-design.md` |
| 战斗系统 | `docs/design/2026-02-24-战斗系统-design.md` |
| 随从系统 | `docs/design/2026-02-24-随从系统-design.md` |
| 装备系统 | `docs/design/2026-02-24-装备系统-design.md` |
| 咒术系统 | `docs/design/2026-02-24-咒术系统-design.md` |
| 英雄系统 | `docs/design/2026-02-24-英雄系统-design.md` |

### 为什么？

- 设计文档定义了精确的机制、公式、词条效果
- 凭空捏造会导致与现有设计冲突
- 词条效果、成长公式、商店机制等都有明确定义

### 示例

❌ **错误做法**：直接实现"连击：每次攻击+1伤害"
✅ **正确做法**：先读取 `04-词条系统.md`，确认是否有该词条及其精确效果

❌ **错误做法**：商店每回合刷新2张卡
✅ **正确做法**：先读取 `01-经济系统.md`，确认商店刷新机制

---

## 开发约定

### 代码风格

- 使用 UnoCSS 属性模式：`_前缀="值"`
- 单文件不超过 400 行
- 注释应解释"为什么"而非"是什么"

### 文件命名

- 组件: PascalCase (如 `GameBoard.vue`)
- 工具函数: camelCase (如 `gameUtils.ts`)

---

## Superpowers 工作流

```
brainstorming → writing-plans → executing-plans → finishing
```

### 常用技能

| 技能 | 触发条件 |
|------|----------|
| `brainstorming` | 创建功能前 |
| `writing-plans` | 有功能规格需要实现 |
| `executing-plans` | 执行实现计划 |
| `systematic-debugging` | 遇到 bug |

### 文档规范

| 类型 | 位置 | 命名格式 |
|------|------|----------|
| 设计文档 | `docs/design/` | `YYYY-MM-DD-<主题>-design.md` |
| 实现计划 | `docs/plans/` | `YYYY-MM-DD-<序号>-<任务名>-plan.md` |
| 路线图 | `docs/roadmap/` | `README.md` + 层级目录 |

#### 示例

- 设计文档：`docs/design/2026-03-07-单机闯关模式-design.md`
- 实现计划：`docs/plans/2026-03-07-01-类型定义-plan.md`

---

## 文档索引

### 游戏设计文档 (`docs/design/`)

- `2026-02-24-项目概述-design.md`
- `2026-02-24-核心修改-design.md`
- `2026-02-24-经济系统-design.md`
- `2026-02-24-战斗系统-design.md`
- `2026-02-24-随从系统-design.md`
- `2026-02-24-词条系统-design.md`
- `2026-02-24-装备系统-design.md`
- `2026-02-24-咒术系统-design.md`
- `2026-02-24-英雄系统-design.md`
- `2026-03-07-单机闯关模式-design.md`
- `2026-02-24-数据结构-design.md`
- `2026-02-24-UI设计-design.md`

### 实现计划 (`docs/plans/`)

- `2026-03-07-01-类型定义-plan.md`

### 数据表 (`docs/design/`)

- `2026-02-27-随从数据表-design.md`
- `2026-02-27-装备数据表-design.md`
- `2026-02-27-咒术数据表-design.md`
- `2026-02-27-英雄数据表-design.md`

### 开发路线图 (`docs/roadmap/`)

- `README.md` - 任务追踪表

### 核心系统文档速查

| 系统 | 设计文档 |
|------|----------|
| 经济/商店 | `2026-02-24-经济系统-design.md` |
| 战斗 | `2026-02-24-战斗系统-design.md` |
| 随从 | `2026-02-24-随从系统-design.md` |
| 词条 | `2026-02-24-词条系统-design.md` |
| 装备 | `2026-02-24-装备系统-design.md` |
| 咒术 | `2026-02-24-咒术系统-design.md` |
| 英雄 | `2026-02-24-英雄系统-design.md` |

---

## 版本信息

- **项目版本**: 0.2.0
- **文档更新**: 2026-03-07