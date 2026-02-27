# AGENTS.md - 项目上下文文件

> 本文件为 AI 助手提供项目上下文，帮助理解和协作开发

---

## 项目概述

**月圆之夜 - 镜中对决 修改版** - 一个基于 Vue 3 + Phaser + Hono.js 的全栈 TypeScript 卡牌自走棋游戏项目。

### 核心特点

- **游戏类型**: 8人对战卡牌自走棋
- **核心玩法**: 招募随从、装备道具、使用咒术、自动战斗
- **技术特点**: 全栈 TypeScript、WebSocket 实时通信、msgpackr 高效序列化

### 关键修改点（与原版差异）

| 修改项 | 说明 |
|--------|------|
| 🔄 横屏布局 | 3×2 战场站位，左右镜像对称 |
| 🔄 标签系统 | 使用 `tags[]` 数组替代种族系统 |
| 🔄 拼点机制 | 战斗前拼点决定先攻权 |

---

## 技术栈

### 前端 (`packages/web`)

| 技术 | 用途 |
|------|------|
| Vue 3 | UI 框架 |
| Phaser 3 | 2D 游戏引擎 |
| Pinia | 状态管理 |
| UnoCSS | CSS 方案（属性模式 `_` 前缀） |
| Vite | 构建工具 |

### 后端 (`packages/server`)

| 技术 | 用途 |
|------|------|
| Hono.js | Web 框架 |
| Bun | JavaScript 运行时 |
| PostgreSQL | 数据库 |
| Drizzle ORM | 类型安全 ORM |
| WebSocket | 实时通信 |

### 共享 (`packages/shared`)

| 技术 | 用途 |
|------|------|
| TypeScript | 类型定义 |
| Zod | 运行时验证 |
| msgpackr | 二进制序列化 |
| jsondiffpatch | 增量更新 |

---

## 项目结构

```
ai-game/
├── packages/
│   ├── shared/           # 共享类型和工具
│   │   └── src/
│   │       ├── types/    # 游戏、API、Phaser 类型
│   │       ├── utils/    # diff、msgpack、常量
│   │       └── schemas/  # Zod 验证模式
│   │
│   ├── server/           # 后端服务
│   │   └── src/
│   │       ├── db/       # 数据库 schema 和连接
│   │       ├── routes/   # API 路由
│   │       ├── sockets/  # WebSocket 处理
│   │       └── services/ # 业务逻辑
│   │
│   └── web/              # 前端应用
│       └── src/
│           ├── game/     # Phaser 游戏引擎
│           ├── components/ # Vue 组件
│           ├── stores/   # Pinia 状态管理
│           ├── api/      # API 客户端
│           └── pages/    # 路由页面
│
├── docs/design/          # 详细设计文档
└── scripts/              # 开发脚本
```

---

## 开发命令

```bash
# 安装依赖
bun install

# 构建共享包（首次必须）
cd packages/shared && bun run build && cd ../..

# 启动数据库
docker-compose up -d

# 启动开发服务器（前端 + 后端）
bun run dev

# 构建
bun run build

# 测试
bun run test

# 代码检查
bun run lint

# 数据库迁移
bun run db:migrate
bun run db:generate  # 生成迁移
bun run db:studio    # 打开 Drizzle Studio
```

---

## 核心类型定义

### 游戏状态 (packages/shared/src/types/game.ts)

```typescript
// 玩家状态枚举
enum PlayerState {
  Idle, Walking, Running, Jumping, Attacking, Damaged, Dead
}

// 玩家数据
type Player = {
  id: string
  username: string
  position: Vector2
  velocity: Vector2
  state: PlayerState
  direction: PlayerDirection
  health: number
  maxHealth: number
  score: number
  color: string
  lastUpdated: number
}

// 游戏状态
type GameState = {
  world: GameWorld
  tick: number
  timestamp: number
  playerCount: number
}
```

### WebSocket 消息类型 (packages/shared/src/types/api.ts)

```typescript
enum WsMessageType {
  Handshake, Auth, Ping, Pong, Disconnect,
  GameState, PlayerUpdate, PlayerJoin, PlayerLeave,
  PlayerInput, PlayerAction, GameEvent, ChatMessage
}

type WsMessage<T> = {
  type: WsMessageType
  payload: T
  timestamp: number
  id?: string
}
```

---

## 数据库 Schema (packages/server/src/db/schema.ts)

### 核心表

| 表名 | 用途 |
|------|------|
| `users` | 用户账户 |
| `game_sessions` | 游戏会话 |
| `game_rooms` | 游戏房间 |
| `room_players` | 房间玩家关联 |
| `player_stats` | 玩家统计 |
| `game_events` | 游戏事件日志 |

---

## API 端点

### HTTP API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api` | GET | API 信息 |
| `/api/v1/auth/login` | POST | 用户认证 |
| `/api/v1/rooms` | GET | 游戏房间列表 |
| `/api/v1/stats` | GET | 玩家统计 |

### WebSocket API

| 消息类型 | 方向 | 说明 |
|----------|------|------|
| `handshake` | 双向 | 握手 |
| `auth` | 双向 | 认证 |
| `ping/pong` | 双向 | 心跳 |
| `game_state` | 服务端→客户端 | 游戏状态更新 |
| `player_input` | 客户端→服务端 | 玩家输入 |
| `player_join/leave` | 服务端→客户端 | 玩家加入/离开 |

---

## 开发约定

### UnoCSS 属性模式

必须使用 `_` 前缀，且必须有值：

```vue
<!-- 正确 -->
<div _flex="~" _justify="center" _items="center" _p="4">
  <button _game-btn>Play</button>
</div>

<!-- 错误 -->
<div _flex>  <!-- 缺少值 -->
```

### API 响应格式

```typescript
type ApiResponse<T> = {
  success: boolean
  data: T | null
  error: string | null
  timestamp: number
}
```

### 文件命名

- 组件: PascalCase (如 `GameBoard.vue`)
- 工具函数: camelCase (如 `gameUtils.ts`)
- 类型文件: camelCase (如 `game.ts`)

### 代码风格

- 使用 Oxlint 进行代码检查
- 单文件不超过 400 行
- 注释应解释"为什么"而非"是什么"

---

## 环境变量

复制 `.env.example` 到 `.env`：

```env
DATABASE_URL="postgresql://game_user:game_password@localhost:5432/game_db"
SERVER_PORT=3001
SERVER_HOST="0.0.0.0"
NODE_ENV="development"
JWT_SECRET="change-this-to-a-random-secret-key"
CORS_ORIGIN="http://localhost:3000"
WS_ENABLED=true
```

---

## 设计文档索引

详细设计文档位于 `docs/design/`：

| 文档 | 内容 |
|------|------|
| [01-项目概述](docs/design/01-项目概述/README.md) | 游戏概述、核心玩法 |
| [02-核心修改](docs/design/02-核心修改/README.md) | 三大修改详解 |
| [03-游戏系统](docs/design/03-游戏系统/README.md) | 经济、战斗、随从等系统 |
| [04-数据结构](docs/design/04-数据结构/README.md) | 核心架构、接口定义 |
| [05-UI设计](docs/design/05-UI设计/README.md) | 界面布局、交互设计 |
| [06-开发计划](docs/design/06-开发计划/README.md) | 阶段划分、任务清单 |
| [07-测试方案](docs/design/07-测试方案/README.md) | 测试策略 |
| [08-附录](docs/design/08-附录/README.md) | 数据表、参考资料 |

---

## 待办事项

- QQ 远程控制功能待实现（NapCatQQ + OneBot 11 协议）
- 用户说"QQ登录待办"表示这个任务延后处理

---

## 常见问题

### 数据库连接失败

```bash
# 检查 Docker 是否运行
docker-compose ps

# 查看 PostgreSQL 日志
docker-compose logs postgres
```

### 端口被占用

```bash
# Windows 查找占用端口的进程
netstat -ano | findstr :3001
```

### 类型错误

```bash
# 清理并重新构建
bun run clean
bun install
bun run build
```

---

## 版本信息

- **项目版本**: 0.1.0
- **Bun 版本**: >=1.2.0
- **文档更新**: 2026-02-27
