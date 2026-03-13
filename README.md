# 🎮 月圆之夜 - 镜中对决 修改版

一个基于 TypeScript 的全栈卡牌自走棋游戏项目，支持实时多人对战，采用现代化工具链和 AI 友好的架构设计。

## ✨ 特性

- **实时多人对战**：基于 WebSocket 的实时游戏机制，高效的状态同步
- **现代化技术栈**：Vue 3、Phaser、Hono.js、Bun、PostgreSQL、UnoCSS
- **全栈 TypeScript**：从数据库到前端的完整类型安全
- **AI 友好的架构**：为 AI 辅助开发优化的清晰代码结构
- **高效通信**：msgpackr 序列化和 jsondiffpatch 实现高效更新
- **现代样式**：UnoCSS 属性模式（`_flex="~"` 代替 `class="flex"`）
- **单机闯关模式**：参考杀戮尖塔设计的 10 关路线图

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Phaser 3** - 2D 游戏引擎
- **UnoCSS** - 原子化 CSS 引擎（带 `_` 前缀的属性模式）
- **Pinia** - 状态管理
- **Vite** - 构建工具和开发服务器
- **TypeScript** - 类型安全

### 后端
- **Hono.js** - 轻量级 Web 框架
- **Bun** - JavaScript 运行时（比 Node.js 更快）
- **PostgreSQL** - 关系型数据库
- **Drizzle ORM** - 类型安全的数据库查询
- **WebSocket** - 实时通信

### 开发工具
- **Oxlint** - 用 Rust 编写的快速 linter
- **Vitest** - 测试框架
- **Playwright** - E2E 测试
- **Drizzle Kit** - 数据库迁移
- **msgpackr** - 高效二进制序列化
- **jsondiffpatch** - 用于高效更新的 JSON diff 算法

## 🚀 快速开始

### 前置要求
- **Bun** (>=1.2.0) - [安装指南](https://bun.sh/docs/installation)
- **Docker & Docker Compose**（可选，用于数据库）

### 安装
```bash
# 1. 克隆仓库
git clone <repository-url>
cd ai-game

# 2. 运行设置脚本（Linux/macOS）
chmod +x scripts/setup.sh
./scripts/setup.sh

# 或在 Windows 上（使用 Git Bash 或 WSL）
# bash scripts/setup.sh

# 3. 启动开发环境
./scripts/dev.sh
```

### 手动安装
```bash
# 安装依赖
bun install

# 构建 shared 包（必须最先构建）
cd packages/shared && bun run build && cd ../..

# 启动数据库（如果使用 Docker）
docker-compose up -d

# 启动开发服务器
bun run dev
```

## 📁 项目结构

```
ai-game/
├── package.json              # 根工作区配置
├── uno.config.ts            # UnoCSS 配置
├── docker-compose.yml       # PostgreSQL Docker 设置
├── .env.example             # 环境变量模板
│
├── packages/
│   ├── shared/              # 共享类型和工具
│   │   ├── src/types/       # 游戏、API、Phaser 类型
│   │   ├── src/data/        # 卡牌数据（随从、装备、咒术）
│   │   ├── src/utils/       # diff、msgpack、常量
│   │   └── src/schemas/     # Zod 验证 schemas
│   │
│   ├── server/              # 后端服务器
│   │   ├── src/db/         # 数据库 schema 和连接
│   │   ├── src/routes/     # API 路由
│   │   ├── src/sockets/    # WebSocket 处理器
│   │   └── src/services/   # 业务逻辑
│   │
│   └── web/                 # 前端应用
│       ├── src/game/       # Phaser 游戏引擎
│       ├── src/components/ # Vue 组件
│       ├── src/stores/     # Pinia stores
│       ├── src/api/        # API 客户端
│       └── src/pages/      # 路由页面
│
├── scripts/                 # 开发脚本
├── docs/                    # 文档
│   ├── design/             # 游戏设计文档
│   ├── plans/              # 实现计划（TDD）
│   └── roadmap/            # 开发路线图
└── .iflow/                  # iFlowCLI 工作流配置
```

## ⚙️ 配置

### 环境变量
复制 `.env.example` 到 `.env` 并配置：

```env
# 数据库
DATABASE_URL="postgresql://game_user:game_password@localhost:5432/game_db"

# 服务器
SERVER_PORT=3001
SERVER_HOST="0.0.0.0"
NODE_ENV="development"

# 安全
JWT_SECRET="change-this-to-a-random-secret-key"

# 游戏
GAME_TICK_RATE=60
GAME_MAX_PLAYERS=10
GAME_WORLD_WIDTH=1920
GAME_WORLD_HEIGHT=1080

# WebSocket
WS_ENABLED=true

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### UnoCSS 配置
带 `_` 前缀的特殊属性模式要求：
- 所有 UnoCSS 类必须使用 `_` 前缀
- 必须有值（例如 `_flex="~"` 而不是 `_flex`）
- 在 `uno.config.ts` 和 `packages/web/vite.config.ts` 中配置

在 Vue 组件中的使用示例：
```vue
<div _flex="~" _justify="center" _items="center" _p="4">
  <button _game-btn>开始游戏</button>
</div>
```

## 🎮 游戏开发

### Phaser 集成
游戏引擎与 Vue 3 集成：
```typescript
// packages/web/src/game/config.ts
import { PhaserGameConfig } from '@game/shared'

export const gameConfig: PhaserGameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [GameScene]
}
```

### 实时通信
- **WebSocket**：实时游戏状态更新
- **msgpackr**：二进制序列化提高效率
- **jsondiffpatch**：仅发送变化的数据

WebSocket 消息流示例：
```typescript
// 1. 客户端发送玩家输入
ws.send({
  type: 'player_input',
  payload: { up: true, right: false, attack: true }
})

// 2. 服务器计算游戏状态
const newState = updateGameState(oldState, inputs)

// 3. 服务器仅发送差异
const diff = computeGameStateDiff(oldState, newState)
ws.send({
  type: 'game_state',
  payload: { diff, timestamp: Date.now() }
})
```

## 📚 API 文档

### HTTP API
- `GET /health` - 健康检查
- `GET /api` - API 信息
- `POST /api/v1/auth/login` - 用户认证
- `GET /api/v1/game/state` - 游戏状态
- `GET /api/v1/rooms` - 游戏房间
- `GET /api/v1/stats` - 玩家统计

### WebSocket API
连接到 `ws://localhost:3001/ws`
- 消息类型：`handshake`、`auth`、`player_input`、`game_state`、`player_join`、`player_leave`
- 自动重连，采用指数退避
- 心跳检测

## 🧪 测试

```bash
# 运行单元测试
bun run test

# 监视模式运行测试
bun run test:watch

# 运行 E2E 测试
bun run test:e2e

# 运行 linting
bun run lint

# 修复 linting 问题
bun run lint:fix

# 类型检查
bun run type-check
```

## 🐳 数据库

### 使用 Docker（推荐）
```bash
# 启动 PostgreSQL
bun run db:up

# 停止 PostgreSQL
bun run db:down

# 运行迁移
bun run db:migrate

# 从 schema 变更生成迁移
bun run db:generate

# 打开 Drizzle Studio
bun run db:studio
```

### 手动 PostgreSQL 设置
1. 安装 PostgreSQL 16+
2. 创建数据库：
   ```sql
   CREATE DATABASE game_db;
   CREATE USER game_user WITH PASSWORD 'game_password';
   GRANT ALL PRIVILEGES ON DATABASE game_db TO game_user;
   ```
3. 更新 `.env` 中的 `DATABASE_URL`

## 🚀 部署

### 生产构建
```bash
# 构建所有包
bun run build

# 启动生产服务器
cd packages/server && bun run start
```

### Docker 部署
```dockerfile
# 服务器 Dockerfile 示例
FROM oven/bun:1.2-alpine

WORKDIR /app
COPY package.json bun.lockb ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

RUN bun install --production

COPY . .

RUN bun run build

EXPOSE 3001
CMD ["bun", "run", "start"]
```

## 🤖 AI 友好特性

本项目专为 AI 辅助开发而设计：

### 1. 清晰的类型层次
- `packages/shared/src/types/` 中的完整 TypeScript 定义
- Zod schemas 用于运行时验证
- Phaser 类型扩展用于游戏开发

### 2. 模块化架构
- 每个包职责清晰
- 小而专注的文件（< 400 行）
- 定义良好的接口

### 3. 标准化通信
- 一致的 API 响应格式
- 优化的游戏状态同步
- 清晰的错误处理模式

### 4. 全面的工具
- 一键设置和开发
- 自动测试和 linting
- 数据库迁移

## 🔧 开发工作流

本项目使用 **iFlowCLI + VibeCoding** 方式维护，AI 负责写代码，你负责做决定。

### 工作流概述

通过 `/命令` 触发精心设计的开发流程——AI 自动头脑风暴、写计划、派遣子代理写代码、自我审查，你只需要在关键节点做决定。

**核心机制：子代理编排**

主模型不直接写代码，而是把不同任务派遣给绑定了特定模型的子代理执行。不同任务用最擅长它的模型：

| 角色 | 模型 |
|------|------|
| 主调度（orchestrator） | GLM-4.7 |
| 头脑风暴 | Kimi K2.5 |
| 写代码 / 规范审查 | GLM-5 |
| 代码质量审查 / 最终审查 | MiniMax M2.5 |

### 常用命令

| 命令 | 触发时机 | 执行模型 |
|------|----------|----------|
| `/context` | 每次开始新会话 | GLM-4.7 |
| `/brainstorm` | 有新功能想法时 | Kimi K2.5 |
| `/write-plan` | 设计确认后 | GLM-5 |
| `/execute-plan` | 计划确认后 | GLM-5 + MiniMax M2.5 |
| `/systematic-debugging` | 遇到 bug | GLM-5 |
| `/generate-card` | 新增游戏卡牌 | GLM-4.7 |
| `/edit-card` | 修改现有卡牌 | GLM-4.7 |

### 完整开发流程

**1. 建立上下文**
```
/context
```
输出当前分支、worktree 状态、roadmap 里进行中的任务、最近提交、未提交更改，以及一句话建议。

**2. 头脑风暴**
```
/brainstorm
```
Kimi K2.5 会和你对话，探索项目、提出方案、写设计文档。

**3. 写计划**
```
/write-plan
```
GLM-5 把设计文档拆解为精确的 TDD 任务序列。

**4. 执行**
```
/execute-plan
```
工作流自动创建 worktree、派遣子代理写代码、进行两阶段审查（规范+质量）。

**5. 收尾**
finishing-a-development-branch 提供四个选项：本地合并、创建 PR、保持原样、丢弃。

### 工作流文件

```
.iflow/
├── commands/          # /命令 入口文件
├── skills/            # 流程文档（技能）
├── agents/            # 子代理定义（绑定模型）
└── hooks/             # 自动触发的 hook
```

详细工作流指南请参考 `.iflow/skills/` 目录下的各个技能文档。

## 🐛 故障排除

### 常见问题

**1. 数据库连接被拒绝**
```bash
# 检查 Docker 是否运行
docker-compose ps

# 检查 PostgreSQL 日志
docker-compose logs postgres

# 验证 .env 中的连接字符串
echo $DATABASE_URL
```

**2. 端口已被占用**
```bash
# 查找使用端口的进程
sudo lsof -i :3000

# 或在 .env 中更改端口
SERVER_PORT=3002
```

**3. Bun 命令未找到**
```bash
# 将 Bun 添加到 PATH
export PATH="$HOME/.bun/bin:$PATH"

# 或重启终端
exec bash
```

**4. TypeScript 错误**
```bash
# 清理构建
bun run clean
bun install
bun run build
```

### 获取帮助
1. 检查浏览器控制台是否有错误
2. 检查服务器终端输出
3. 验证所有环境变量是否已设置
4. 确保所有依赖已安装

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

## 👥 贡献

1. Fork 仓库
2. 创建功能分支
3. 遵循开发工作流
4. 提交 Pull Request

## 🙏 致谢

- **Vue.js** - 渐进式 JavaScript 框架
- **Phaser** - 快速、免费、有趣的开源 HTML5 游戏框架
- **Hono.js** - 边缘计算的超快 Web 框架
- **Bun** - 极快的 JavaScript 运行时
- **UnoCSS** - 即时按需原子 CSS 引擎
- **Drizzle ORM** - 具有出色开发者体验的 TypeScript ORM

## 📞 支持

如有问题和疑问：
1. 查看故障排除部分
2. 查找现有 issues
3. 创建新的 issue 并提供详细信息

---

**祝你编码愉快，游戏开发顺利！** 🎮🚀