# 监控告警系统 - 技术文档

## 系统概述

SimKaze 监控告警系统为 eSIM 电商平台提供全面的实时监控能力，包括性能指标、错误追踪、资源监控和业务事件分析。

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Express Server                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Products API│  │ Checkout API│  │ Other APIs  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│  ┌──────▼──────────────────────────────────▼──────┐    │
│  │           Monitoring Middleware                │    │
│  │    (自动收集请求响应时间、状态码、错误)          │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                                │
│         ┌───────────────┼───────────────┐               │
│         ▼               ▼               ▼               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  Metrics    │ │  Alert      │ │ Dashboard   │       │
│  │  Collector  │ │  Engine     │ │   API       │       │
│  │             │ │             │ │             │       │
│  │ - Performance│ │ - Rules    │ │ - Overview  │       │
│  │ - Errors    │ │ - Levels   │ │ - Alerts    │       │
│  │ - Resources │ │ - Notify   │ │ - History   │       │
│  │ - Business  │ │             │ │ - Endpoints │       │
│  └─────────────┘ └──────┬──────┘ └─────────────┘       │
│                         │                                │
│                  ┌──────▼──────┐                        │
│                  │ Notification│                        │
│                  │  (Telegram) │                        │
│                  └─────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

## 功能模块

### 1. 指标收集器 (metrics-collector.js)

**监控维度：**

| 维度 | 指标 | 说明 |
|------|------|------|
| 性能 | responseTime | 请求响应时间 |
| 性能 | p95/p99 | 95%/99%分位响应时间 |
| 错误 | errorRate | 错误率统计 |
| 错误 | byType | 按错误类型分类 |
| 资源 | cpuUsage | CPU 使用率 |
| 资源 | memoryUsage | 内存使用率 |
| 业务 | order_created | 订单创建 |
| 业务 | order_failed | 订单失败 |
| 业务 | payment_* | 支付相关事件 |

### 2. 告警引擎 (alert-engine.js)

**告警级别：**

| 级别 | 优先级 | 通知渠道 | 自动解决 |
|------|--------|----------|----------|
| CRITICAL (🔴 严重) | 1 | Telegram/SMS | 否 |
| ERROR (🟠 错误) | 2 | Telegram | 是 |
| WARNING (🟡 警告) | 3 | Telegram | 是 |
| INFO (🔵 信息) | 4 | - | 是 |

**告警规则：**

```javascript
// 响应时间阈值
responseTime: { critical: 5000ms, error: 3000ms, warning: 1500ms }

// 错误率阈值
errorRate: { critical: 20%, error: 10%, warning: 5% }

// 资源使用阈值
cpuUsage: { critical: 95%, error: 85%, warning: 75% }
memoryUsage: { critical: 95%, error: 85%, warning: 75% }

// 业务指标阈值
orderFailureRate: { critical: 15%, error: 10%, warning: 5% }
paymentFailureRate: { critical: 20%, error: 15%, warning: 10% }
```

### 3. 通知系统 (notification.js)

**通知渠道：**

- **Telegram 群组**: @Simryokoesim (ID: -1003847622485)
- **Telegram 频道**: @SimKaze eSIM (ID: -1003642242507)
- **个人消息**: 管理员 (ID: 7867683484)

**通知策略：**

- CRITICAL: 发送至所有渠道
- ERROR: 发送至群组
- WARNING: 发送至管理员

### 4. 仪表板 (dashboard.js / dashboard.html)

**API 端点：**

| 端点 | 说明 |
|------|------|
| GET /api/monitoring/dashboard/overview | 监控概览 |
| GET /api/monitoring/metrics | 实时指标 |
| GET /api/monitoring/metrics/history | 历史数据 |
| GET /api/monitoring/alerts | 活跃告警 |
| GET /api/monitoring/alerts/stats | 告警统计 |
| POST /api/monitoring/alerts/:id/acknowledge | 确认告警 |
| POST /api/monitoring/alerts/:id/resolve | 解决告警 |
| GET /api/monitoring/endpoints | 端点统计 |
| POST /api/monitoring/test/alert | 测试告警 |
| POST /api/monitoring/test/notification | 测试通知 |

## 告警响应流程

```
1. 触发条件满足
       │
       ▼
2. 检查是否已有相同类型活跃告警
       │
       ├─ 是 ──▶ 更新触发时间和计数
       │
       └─ 否 ──▶ 创建新告警
                  │
                  ▼
3. 根据级别确定通知渠道
       │
       ▼
4. 发送 Telegram 通知
       │
       ▼
5. 等待响应
       │
       ├─ 确认 ──▶ 标记为已确认
       │
       ├─ 解决 ──▶ 发送解决通知，关闭告警
       │
       └─ 超时 ──▶ 自动升级/关闭
```

## 使用指南

### 访问监控仪表板

```
http://localhost:3000/monitoring/dashboard.html
```

### 查看实时指标

```bash
curl http://localhost:3000/api/monitoring/dashboard/overview
```

### 查看活跃告警

```bash
curl http://localhost:3000/api/monitoring/alerts
```

### 手动触发测试告警

```bash
curl -X POST http://localhost:3000/api/monitoring/test/alert \
  -H "Content-Type: application/json" \
  -d '{"level": "WARNING", "title": "测试告警", "message": "这是一条测试消息"}'
```

### 确认告警

```bash
curl -X POST http://localhost:3000/api/monitoring/alerts/xxx/acknowledge \
  -H "Content-Type: application/json" \
  -d '{"acknowledgedBy": "admin"}'
```

### 解决告警

```bash
curl -X POST http://localhost:3000/api/monitoring/alerts/xxx/resolve \
  -H "Content-Type: application/json" \
  -d '{"resolvedBy": "admin"}'
```

## 扩展配置

### 修改告警阈值

编辑 `monitoring/config.js`：

```javascript
RULES: {
  responseTime: {
    critical: 3000,  // 修改临界值
    error: 2000,
    warning: 1000,
  },
  // ... 其他规则
}
```

### 添加新的告警规则

在 `alert-engine.js` 中添加新的检查方法：

```javascript
checkCustomMetric(metrics) {
  if (metrics.customValue > threshold) {
    this.triggerAlert({
      type: 'custom_metric',
      level: 'WARNING',
      title: '自定义指标告警',
      // ...
    });
  }
}
```

### 添加新的通知渠道

在 `notification.js` 中添加：

```javascript
async sendToSMS(message) {
  // 实现 SMS 发送逻辑
}

async sendToEmail(message) {
  // 实现 Email 发送逻辑
}
```

## 维护

### 数据清理

系统自动清理超过 24 小时的指标数据，无需手动处理。

### 日志监控

```bash
# 查看监控相关日志
tail -f server.log | grep -i monitoring
tail -f server.log | grep -i alert
```

## 性能考虑

- 指标收集：每 30 秒收集一次系统资源
- 告警检查：每 15 秒执行一次告警规则检查
- 数据保留：24 小时
- 最大历史数据点：60 个

## 故障排查

| 问题 | 解决方案 |
|------|----------|
| 监控数据不更新 | 检查 middleware 是否正确加载 |
| 告警未发送 | 验证 Telegram Bot Token 和 Chat ID |
| 仪表板加载失败 | 检查 dashboard.html 是否存在 |
| 内存持续增长 | 等待自动清理或手动调用 cleanup |