#!/bin/bash

# SimRyoko 数据库初始化脚本

echo "🚀 初始化 SimRyoko 数据库..."

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 启动数据库
echo "📦 启动 PostgreSQL..."
docker-compose up -d postgres

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 5

# 检查数据库是否就绪
until docker exec simryoko-db pg_isready -U simryoko > /dev/null 2>&1; do
    echo "⏳ 等待数据库就绪..."
    sleep 2
done

echo "✅ 数据库已就绪"

# 安装依赖
echo "📦 安装 Prisma..."
npm install -g prisma

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 运行迁移
echo "🔄 运行数据库迁移..."
npx prisma migrate dev --name init

# 种子数据（可选）
# echo "🌱 插入种子数据..."
# npx prisma db seed

echo "✅ 数据库初始化完成！"
echo ""
echo "📋 连接信息："
echo "  URL: postgresql://simryoko:simryoko123@localhost:5432/simryoko"
echo ""
echo "🎯 下一步："
echo "  1. 复制 .env.example 到 .env"
echo "  2. 更新 DATABASE_URL"
echo "  3. 运行 npm run dev 启动开发服务器"