# SimRyoko 部署检查清单

**日期**: 2026-03-14  
**负责人**: DevOps-Lead  
**状态**: 待执行

---

## 🔴 P0 - 阻塞部署（必须完成）

### 1. Vercel配置

| 步骤 | 操作 | 状态 |
|------|------|------|
| 1.1 | 登录 https://vercel.com/dashboard | ⬜ |
| 1.2 | 获取 Organization ID (team_xxxxxxxx 或 user_xxxxxxxx) | ⬜ |
| 1.3 | 连接 GitHub 仓库 (xilixixigrocoltd/SimRyoko) | ⬜ |
| 1.4 | 设置环境变量（见下方列表） | ⬜ |
| 1.5 | 配置自定义域名 (simryoko.com) | ⬜ |

**环境变量清单**:
```
# 数据库
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# API认证
JWT_SECRET=随机字符串
API_KEY=随机字符串

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare
CF_ACCOUNT_ID=...
CF_KV_NAMESPACE_ID=...
CF_API_EMAIL=xilixi@xigrocoltd.com
CF_API_KEY=...

# 其他
CRON_SECRET=随机字符串
NEXT_PUBLIC_API_URL=https://api.simryoko.com
```

### 2. GitHub Secrets

| Secret | 值 | 状态 |
|--------|-----|------|
| VERCEL_TOKEN | `[Vercel Token]` | ⬜ |
| VERCEL_PROJECT_ID | prj_SbPkDXGAojvyJhkpz0iiBix0m13L | ⬜ |
| VERCEL_ORG_ID | [待提供] | ⬜ |

**操作步骤**:
1. 访问 https://github.com/xilixixigrocoltd/SimRyoko/settings/secrets
2. 点击 "New repository secret"
3. 添加上述3个secrets

### 3. Cloudflare DNS

| 步骤 | 操作 | 状态 |
|------|------|------|
| 3.1 | 登录 https://dash.cloudflare.com | ⬜ |
| 3.2 | 选择 simryoko.com | ⬜ |
| 3.3 | DNS → 添加 CNAME: @ → cname.vercel-dns.com (Proxied) | ⬜ |
| 3.4 | SSL/TLS → 选择 "Full (strict)" | ⬜ |
| 3.5 | 添加 Page Rules（见下方） | ⬜ |

**Page Rules**:
```
规则1: api.simryoko.com/*
- 缓存: Bypass
- SSL: Full (strict)

规则2: simryoko.com/*
- 缓存: Standard
- Edge TTL: 2 hours
- Browser TTL: 1 hour
```

---

## 🟡 P1 - 优化配置

### 4. Sentry监控

| 步骤 | 操作 | 状态 |
|------|------|------|
| 4.1 | 注册 https://sentry.io | ⬜ |
| 4.2 | 创建项目 "SimRyoko" | ⬜ |
| 4.3 | 获取 DSN | ⬜ |
| 4.4 | 添加到环境变量 SENTRY_DSN | ⬜ |

### 5. Google Analytics

| 步骤 | 操作 | 状态 |
|------|------|------|
| 5.1 | 确认 GA4 ID: G-5F6FMKR7J4 | ⬜ |
| 5.2 | 添加到环境变量 NEXT_PUBLIC_GA_ID | ⬜ |

---

## 🟢 P2 - 可选配置

### 6. 其他监控
- [ ] Uptime监控 (UptimeRobot)
- [ ] 日志聚合 (Logflare)
- [ ] 性能监控 (Web Vitals)

---

## 📋 验证清单

部署完成后验证：

| 检查项 | 命令/URL | 期望结果 |
|--------|----------|----------|
| 首页访问 | https://simryoko.com | 200 OK |
| API健康 | https://api.simryoko.com/health | {status: "ok"} |
| SSL证书 | SSL Labs测试 | A+评级 |
| 安全头 | securityheaders.com | A评级 |
| 性能 | PageSpeed Insights | >90分 |

---

## 🚀 一键部署脚本

```bash
#!/bin/bash
# deploy.sh - 一键部署脚本

set -e

echo "🚀 SimRyoko 部署脚本"

# 1. 检查环境变量
echo "📋 检查环境变量..."
required_vars=("DATABASE_URL" "JWT_SECRET" "STRIPE_SECRET_KEY")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 缺少环境变量: $var"
    exit 1
  fi
done

# 2. 安装依赖
echo "📦 安装依赖..."
npm ci

# 3. 构建
echo "🔨 构建项目..."
npm run build

# 4. 数据库迁移
echo "🗄️ 数据库迁移..."
npm run db:migrate

# 5. 部署到Vercel
echo "☁️ 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
```

---

## 📞 紧急联系

部署问题联系: DevOps-Lead-AI / 龙虾
