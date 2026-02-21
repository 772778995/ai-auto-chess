#!/bin/bash

set -e

echo "🎮 Setting up Game Project..."

# 检查 Bun 是否安装
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

echo "✅ Bun is installed: $(bun --version)"

# 检查 Docker 是否安装（可选，用于数据库）
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed: $(docker --version)"
else
    echo "⚠️  Docker is not installed. Database setup may require manual configuration."
fi

# 安装根依赖
echo "📦 Installing root dependencies..."
bun install

# 安装共享包依赖
echo "📦 Installing shared package dependencies..."
cd packages/shared && bun install && cd ../..

# 安装服务器依赖
echo "📦 Installing server dependencies..."
cd packages/server && bun install && cd ../..

# 安装前端依赖
echo "📦 Installing web dependencies..."
cd packages/web && bun install && cd ../..

# 创建环境文件
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# 启动数据库（如果 Docker 可用）
if command -v docker &> /dev/null; then
    echo "🐘 Starting PostgreSQL database..."
    docker-compose up -d

    echo "⏳ Waiting for database to be ready..."
    sleep 5

    # 检查数据库健康状态
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Database started successfully"
    else
        echo "❌ Database failed to start. Please check Docker logs."
    fi
fi

# 构建共享包
echo "🔨 Building shared package..."
cd packages/shared && bun run build && cd ../..

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run database migrations: bun run db:migrate"
echo "3. Start development servers: bun run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Available commands:"
echo "  bun run dev          - Start all development servers"
echo "  bun run build        - Build all packages for production"
echo "  bun run lint         - Run linting on all packages"
echo "  bun run test         - Run tests on all packages"
echo "  bun run db:up        - Start database with Docker"
echo "  bun run db:down      - Stop database"
echo "  bun run db:migrate   - Run database migrations"
echo ""

exit 0