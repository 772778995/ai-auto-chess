# 🎮 Game Project - Full Stack TypeScript Game

A modern full-stack game project built with TypeScript, featuring real-time multiplayer gameplay, modern tooling, and AI-friendly architecture.

## ✨ Features

- **Real-time Multiplayer**: WebSocket-based real-time gameplay with efficient state synchronization
- **Modern Tech Stack**: Vue 3, Phaser, Hono.js, Bun, PostgreSQL, UnoCSS
- **TypeScript Everywhere**: Full-stack type safety from database to frontend
- **AI-Friendly Architecture**: Well-structured codebase optimized for AI-assisted development
- **Optimized Communication**: msgpackr serialization and jsondiffpatch for efficient updates
- **Modern Styling**: UnoCSS with attribute mode (`_flex="~"` instead of `class="flex"`)

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Phaser 3** - 2D game framework
- **UnoCSS** - Atomic CSS engine (attribute mode with `_` prefix)
- **Pinia** - State management
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety

### Backend
- **Hono.js** - Lightweight web framework
- **Bun** - JavaScript runtime (faster than Node.js)
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database queries
- **WebSocket** - Real-time communication

### Development Tools
- **Oxlint** - Fast linter written in Rust
- **Vitest** - Testing framework
- **Playwright** - E2E testing
- **Drizzle Kit** - Database migrations
- **msgpackr** - Efficient binary serialization
- **jsondiffpatch** - JSON diff algorithm for efficient updates

## 🚀 Quick Start

### Prerequisites
- **Bun** (>=1.2.0) - [Installation Guide](https://bun.sh/docs/installation)
- **Docker & Docker Compose** (optional, for database)

### Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd game-project

# 2. Run setup script (Linux/macOS)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Or on Windows (using Git Bash or WSL)
# bash scripts/setup.sh

# 3. Start development
./scripts/dev.sh
```

### Manual Setup
```bash
# Install dependencies
bun install

# Build shared package
cd packages/shared && bun run build && cd ../..

# Start database (if using Docker)
docker-compose up -d

# Start development servers
bun run dev
```

## 📁 Project Structure

```
game-project/
├── package.json              # Root workspace configuration
├── uno.config.ts            # UnoCSS configuration
├── docker-compose.yml       # PostgreSQL Docker setup
├── .env.example             # Environment template
│
├── packages/
│   ├── shared/              # Shared types and utilities
│   │   ├── src/types/       # Game, API, Phaser types
│   │   ├── src/utils/       # diff, msgpack, constants
│   │   └── src/schemas/     # Zod validation schemas
│   │
│   ├── server/              # Backend server
│   │   ├── src/db/         # Database schema and connection
│   │   ├── src/routes/     # API routes
│   │   ├── src/sockets/    # WebSocket handlers
│   │   └── src/services/   # Business logic
│   │
│   └── web/                 # Frontend application
│       ├── src/game/       # Phaser game engine
│       ├── src/components/ # Vue components
│       ├── src/stores/     # Pinia stores
│       ├── src/api/        # API client
│       └── src/pages/      # Route pages
│
├── scripts/                 # Development scripts
└── docs/                   # Documentation (when needed)
```

## ⚙️ Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://game_user:game_password@localhost:5432/game_db"

# Server
SERVER_PORT=3001
SERVER_HOST="0.0.0.0"
NODE_ENV="development"

# Security
JWT_SECRET="change-this-to-a-random-secret-key"

# Game
GAME_TICK_RATE=60
GAME_MAX_PLAYERS=10
GAME_WORLD_WIDTH=1920
GAME_WORLD_HEIGHT=1080

# WebSocket
WS_ENABLED=true

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### UnoCSS Configuration
Special attribute mode with `_` prefix requirement:
- All UnoCSS classes must use `_` prefix
- Must have a value (e.g., `_flex="~"` not `_flex`)
- Configured in `uno.config.ts` and `packages/web/vite.config.ts`

Example usage in Vue components:
```vue
<div _flex="~" _justify="center" _items="center" _p="4">
  <button _game-btn>Play Game</button>
</div>
```

## 🎮 Game Development

### Phaser Integration
The game engine is integrated with Vue 3:
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

### Real-time Communication
- **WebSocket**: Real-time game state updates
- **msgpackr**: Binary serialization for efficiency
- **jsondiffpatch**: Send only changed data

Example WebSocket message flow:
```typescript
// 1. Client sends player input
ws.send({
  type: 'player_input',
  payload: { up: true, right: false, attack: true }
})

// 2. Server computes game state
const newState = updateGameState(oldState, inputs)

// 3. Server sends only the differences
const diff = computeGameStateDiff(oldState, newState)
ws.send({
  type: 'game_state',
  payload: { diff, timestamp: Date.now() }
})
```

## 📚 API Documentation

### HTTP API
- `GET /health` - Health check
- `GET /api` - API information
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/game/state` - Game state
- `GET /api/v1/rooms` - Game rooms
- `GET /api/v1/stats` - Player statistics

### WebSocket API
Connect to `ws://localhost:3001/ws`
- Message types: `handshake`, `auth`, `player_input`, `game_state`, `player_join`, `player_leave`
- Automatic reconnection with exponential backoff
- Heartbeat detection

## 🧪 Testing

```bash
# Run unit tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run E2E tests
bun run test:e2e

# Run linting
bun run lint

# Fix linting issues
bun run lint:fix

# Type checking
bun run type-check
```

## 🐳 Database

### Using Docker (Recommended)
```bash
# Start PostgreSQL
bun run db:up

# Stop PostgreSQL
bun run db:down

# Run migrations
bun run db:migrate

# Generate migrations from schema changes
bun run db:generate

# Open Drizzle Studio
bun run db:studio
```

### Manual PostgreSQL Setup
1. Install PostgreSQL 16+
2. Create database:
   ```sql
   CREATE DATABASE game_db;
   CREATE USER game_user WITH PASSWORD 'game_password';
   GRANT ALL PRIVILEGES ON DATABASE game_db TO game_user;
   ```
3. Update `DATABASE_URL` in `.env`

## 🚀 Deployment

### Production Build
```bash
# Build all packages
bun run build

# Start production server
cd packages/server && bun run start
```

### Docker Deployment
```dockerfile
# Example Dockerfile for server
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

## 🤖 AI-Friendly Features

This project is designed for AI-assisted development:

### 1. Clear Type Hierarchy
- Complete TypeScript definitions in `packages/shared/src/types/`
- Zod schemas for runtime validation
- Phaser type extensions for game development

### 2. Modular Architecture
- Each package has clear responsibilities
- Small, focused files (< 400 lines)
- Well-defined interfaces

### 3. Standardized Communication
- Consistent API response format
- Optimized game state synchronization
- Clear error handling patterns

### 4. Comprehensive Tooling
- One-command setup and development
- Automated testing and linting
- Database migrations

## 🔧 Development Workflow

### 1. Plan First
Use the planner agent for complex features:
```bash
# The project includes agent orchestration
# Use Task tool with subagent_type=planner for planning
```

### 2. Test-Driven Development
Write tests first:
```bash
# Use TDD guide agent
bun run test:watch
```

### 3. Code Review
After writing code, run code review:
```bash
# Code quality checks are built into the workflow
```

### 4. Security Check
Before committing, run security review:
```bash
# Security guidelines are enforced
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection refused**
   ```bash
   # Check if Docker is running
   docker-compose ps

   # Check PostgreSQL logs
   docker-compose logs postgres

   # Verify connection string in .env
   echo $DATABASE_URL
   ```

2. **Port already in use**
   ```bash
   # Find process using port
   sudo lsof -i :3000

   # Or change port in .env
   SERVER_PORT=3002
   ```

3. **Bun command not found**
   ```bash
   # Add Bun to PATH
   export PATH="$HOME/.bun/bin:$PATH"

   # Or restart terminal
   exec bash
   ```

4. **TypeScript errors**
   ```bash
   # Clean build
   bun run clean
   bun install
   bun run build
   ```

### Getting Help
1. Check browser console for errors
2. Check server terminal output
3. Verify all environment variables are set
4. Ensure all dependencies are installed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development workflow
4. Submit a pull request

## 🙏 Acknowledgments

- **Vue.js** - The Progressive JavaScript Framework
- **Phaser** - Fast, free, and fun open source HTML5 game framework
- **Hono.js** - Ultrafast web framework for the Edges
- **Bun** - Incredibly fast JavaScript runtime
- **UnoCSS** - The instant on-demand atomic CSS engine
- **Drizzle ORM** - TypeScript ORM with awesome DX

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Look for existing issues
3. Create a new issue with detailed information

---

**Happy coding and game development!** 🎮🚀