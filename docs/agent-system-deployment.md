# SimRyoko 代理后台系统部署文档

## 📋 系统架构

```
┌─────────────────┐
│   Next.js App   │
│  (Frontend)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   API Routes    │
│  (Next.js API)  │
└────────┬────────┘
         │
┌────────▼────────┐
│  Prisma Client  │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## 🚀 部署步骤

### 1. 环境准备

```bash
# 克隆代码
git clone https://github.com/xilixixigrocoltd/SimRyoko.git
cd SimRyoko

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env
```

### 2. 配置环境变量

编辑 `.env` 文件：

```env
# 数据库（必填）
DATABASE_URL="postgresql://SimRyoko:SimRyoko123@localhost:5432/SimRyoko?schema=public"

# JWT密钥（必填，生产环境请修改）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 其他配置...
```

### 3. 启动数据库

**方式A：Docker（推荐）**

```bash
# 启动 PostgreSQL + Redis
docker-compose up -d

# 或使用脚本
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

**方式B：本地PostgreSQL**

```bash
# 创建数据库
createdb SimRyoko

# 创建用户
createuser -P SimRyoko
# 密码: SimRyoko123
```

### 4. 数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 查看数据库（可选）
npx prisma studio
```

### 5. 构建项目

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

### 6. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

**Vercel环境变量配置：**

在 Vercel Dashboard → Settings → Environment Variables 中添加：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | 你的数据库URL |
| `JWT_SECRET` | 你的JWT密钥 |
| `NEXT_PUBLIC_SITE_URL` | https://simryoko.com |

## 📊 数据库模型

### Agent（代理）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 唯一ID |
| email | String | 邮箱（唯一） |
| name | String | 姓名 |
| level | AgentLevel | 代理级别 |
| balance | Float | 账户余额 |
| apiKey | String | API密钥 |

### Order（订单）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 唯一ID |
| agentId | String | 代理ID |
| productId | String | 产品ID |
| price | Float | 售价 |
| cost | Float | 成本 |
| profit | Float | 利润 |
| status | OrderStatus | 订单状态 |

## 🔐 安全说明

1. **JWT密钥**：生产环境必须使用强随机字符串
2. **数据库密码**：避免使用默认密码
3. **API密钥**：定期轮换
4. **HTTPS**：生产环境强制使用HTTPS

## 🌐 访问地址

| 环境 | URL |
|------|-----|
| 开发 | http://localhost:3000 |
| 生产 | https://simryoko.com |

## 📁 代理后台路径

| 页面 | 路径 |
|------|------|
| 登录 | `/agent/login` |
| 注册 | `/agent/register` |
| 后台首页 | `/agent/dashboard` |
| 订单管理 | `/agent/orders` |

## 🛠️ 故障排查

### 数据库连接失败

```bash
# 检查数据库是否运行
docker ps

# 检查连接
npx prisma db pull
```

### 构建失败

```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

### 迁移失败

```bash
# 重置迁移
npx prisma migrate reset
```

## 📞 支持

- Telegram: @Simryokoesimbot
- Email: support@simryoko.com