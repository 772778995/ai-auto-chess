#!/bin/bash

set -e

echo "🚀 Starting development servers..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory"
    exit 1
fi

# 检查环境文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# 启动数据库（如果 Docker 可用且未运行）
if command -v docker &> /dev/null; then
    if ! docker-compose ps | grep -q "Up"; then
        echo "🐘 Starting PostgreSQL database..."
        docker-compose up -d
        sleep 3
    else
        echo "✅ Database already running"
    fi
fi

# 启动开发服务器
echo ""
echo "🔌 Starting servers in development mode..."
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   WebSocket: ws://localhost:3001"
echo ""
echo "📋 Available endpoints:"
echo "   GET  http://localhost:3001/health       - Health check"
echo "   GET  http://localhost:3001/api          - API information"
echo "   WS   ws://localhost:3001/ws             - WebSocket connection"
echo ""

# 使用 concurrently 启动前后端
echo "🔄 Starting development servers..."
bun run dev

# 注意：package.json 中的 dev 脚本已经配置了 concurrently
# 如果这里直接运行，会启动两个进程

echo ""
echo "👋 Development servers stopped"
echo ""

exit 0