# 支付系统说明

## 概述
本项目支持三种支付方式：
1. **Stripe** - 国际信用卡/借记卡支付
2. **USDT (TRC-20)** - 直接转账到钱包地址
3. **CryptoPay** - 通过Telegram机器人支付 (TON/USDT)

---

## API端点

### 1. Stripe支付
```
POST /api/stripe           → 创建PaymentIntent
POST /api/stripe/confirm   → 确认支付并自动发货
POST /api/stripe-webhook   → Stripe回调（争议/退款处理）
```

### 2. USDT TRC-20支付
```
POST /api/checkout         → 创建USDT订单
POST /api/checkout/verify  → 验证链上支付
GET  /api/payment/verify   → 查询支付状态
```

### 3. CryptoPay支付
```
POST /api/ton              → 创建CryptoPay发票
POST /api/ton/webhook      → 支付回调自动发货
```

---

## 订单状态流转

```
pending_payment (待付款)
    ↓ 支付成功
paid (已付款)
    ↓ 开始处理
processing (处理中)
    ↓ 发货成功
fulfilled (已完成)
    ↓ 发货失败
failed (失败)
```

其他状态：
- `underpaid` - 金额不足
- `pending_fulfillment` - 待人工处理
- `paid_pending_fulfillment` - 已付款待履约

---

## 支付成功自动处理流程

1. **Stripe**: 用户支付完成后，前端调用 `/api/stripe/confirm` 验证
2. **USDT**: 后台轮询或用户手动点击"确认付款"调用 `/api/checkout/verify`
3. **CryptoPay**: 支付成功后CryptoBot自动回调 `/api/ton/webhook`

统一处理逻辑：
1. 更新订单状态为 `paid`
2. 调用代理商API `placeOrderWithEsim()` 下单
3. 获取eSIM数据 (ICCID, LPA字符串, 激活码)
4. 发送eSIM邮件到用户邮箱
5. 更新订单状态为 `fulfilled`
6. 如果有推荐码，添加返利积分

---

## 环境变量

### 支付相关
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `STRIPE_SECRET_KEY` | Stripe Secret Key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook签名密钥 | `whsec_...` |
| `CRYPTOPAY_TOKEN` | CryptoBot API Token | 从 @CryptoBot 获取 |
| `USDT_WALLET` | USDT TRC20 钱包地址 | `TBuhp...` |
| `TRON_API_KEY` | TronGrid API Key | 可选 |

### 代理商API
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `API_BASE` | 代理商API地址 | `https://ciuh32wky.xigrocoltd.com/api` |
| `AGENT_USERNAME` | 代理商用户名 | `lx001` |
| `AGENT_PASSWORD` | 代理商密码 | `123123` |
| `B2B_TOKEN` | 长期JWT Token | 可选，优先使用 |

### 存储
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `CF_ACCOUNT_ID` | Cloudflare账户ID | `c78c07c8...` |
| `CF_KV_NAMESPACE_ID` | KV命名空间ID | `47826a9b...` |
| `CF_API_EMAIL` | CF邮箱 | `xilixi@xigrocoltd.com` |
| `CF_API_KEY` | CF API Key | `d293950d...` |

### 通知
| 变量名 | 说明 | 示例 |
|--------|------|------|
| `TELEGRAM_BOT_TOKEN` | TG机器人Token | `8764732212:AAH...` |
| `TELEGRAM_ADMIN_ID` | 管理员TG ID | `7867683484` |

---

## Stripe争议处理

当收到Stripe争议(dispute)时：
1. 自动从Stripe获取交易详情（IP、设备信息、支付方式）
2. 从KV获取订单记录（ICCID、发货时间）
3. 组装证据文本（交易详情、发货证明、服务条款）
4. 自动提交到Stripe后台
5. 发送Telegram通知管理员审核

管理员可以手动提交：`/submitdispute <dispute_id>`

---

## 推荐返利

用户购买时输入推荐码，推荐人获得10%订单金额返利：
- 累计待打款达到$10后自动通知管理员
- 管理员手动打款后使用 `/payoutref <code> <amount>` 标记已打款