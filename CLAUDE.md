# 游戏项目 - 全栈 TypeScript 游戏

一个现代化的全栈游戏项目，基于 TypeScript 构建，支持实时多人游戏、现代工具链，专为 AI 辅助开发优化。

## 特性

- **实时多人游戏**: 基于 WebSocket 的实时游戏玩法，高效状态同步
- **现代技术栈**: Vue 3、Phaser、Hono.js、Bun、PostgreSQL、UnoCSS
- **全栈 TypeScript**: 从数据库到前端的完整类型安全
- **AI 友好架构**: 结构清晰的代码库，专为 AI 辅助开发优化
- **优化通信**: 使用 msgpackr 序列化和 jsondiffpatch 高效更新
- **现代样式**: UnoCSS 属性模式

## 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- Phaser 3 - 2D 游戏框架
- UnoCSS - 原子化 CSS 引擎
- Pinia - 状态管理
- Vite - 构建工具
- TypeScript - 类型安全

### 后端
- Hono.js - 轻量级 Web 框架
- Bun - JavaScript 运行时
- PostgreSQL - 关系型数据库
- Drizzle ORM - 类型安全数据库查询
- WebSocket - 实时通信

### 开发工具
- Oxlint - Rust 编写的快速代码检查工具
- Vitest - 测试框架
- Playwright - 端到端测试
- Drizzle Kit - 数据库迁移

## 快速开始

```bash
# 安装依赖
bun install

# 构建共享包
cd packages/shared && bun run build && cd ../..

# 启动数据库
docker-compose up -d

# 启动开发服务器
bun run dev
```

## 项目结构

```
packages/
├── shared/     # 共享类型和工具
├── server/     # 后端服务器 (Hono.js + WebSocket)
└── web/        # 前端应用 (Vue 3 + Phaser)
```

## 可用命令

```bash
bun run dev         # 启动开发服务器
bun run build       # 构建所有包
bun run test        # 运行测试
bun run lint        # 代码检查
bun run db:up       # 启动数据库
bun run db:migrate  # 运行迁移
```

## API 端点

- GET /health - 健康检查
- GET /api - API 信息
- POST /api/v1/auth/login - 用户认证
- GET /api/v1/rooms - 游戏房间
- WebSocket /ws - 实时通信 (ws://localhost:3001/ws)

## 环境变量

将 .env.example 复制为 .env:
- DATABASE_URL - 数据库连接
- SERVER_PORT=3001 - 服务器端口
- NODE_ENV - 运行环境

## 许可证

MIT