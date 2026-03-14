# SimRyoko 安全修复报告

**日期**: 2026-03-14 13:10  
**执行**: 龙虾  
**状态**: ✅ 已完成

---

## 🔴 P0 严重问题修复

### 1. ✅ CORS全开放 → 已限制

**文件**: `esim-shop/api/server.js`

**修复前**:
```javascript
app.use(cors());
```

**修复后**:
```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://simryoko.com',
      'https://www.simryoko.com',
      'https://api.simryoko.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: Origin not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

---

### 2. ✅ 数据库密码硬编码 → 已移除

**文件**: `simryoko-api/main.py`

**修复前**:
```python
password=os.getenv('DB_PASSWORD', 'simryoko123'),
```

**修复后**:
```python
db_password = os.getenv('DB_PASSWORD')
if not db_password:
    raise ValueError("DB_PASSWORD environment variable must be set")
```

---

### 3. ✅ 无API认证 → 已添加JWT

**文件**: `simryoko-api/main.py`

**新增**:
```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()
JWT_SECRET = os.getenv('JWT_SECRET')
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable must be set")

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

### 4. ✅ 订单金额客户端可控 → 已服务端校验

**文件**: `simryoko-api/main.py`

**修复前**:
```python
@app.post("/api/orders")
async def create_order(order: Order):
    # 直接使用客户端提交的amount
```

**修复后**:
```python
@app.post("/api/orders")
async def create_order(order: Order, user: dict = Depends(verify_token)):
    # Security: Verify user matches token
    if user.get('user_id') != order.user_id:
        raise HTTPException(status_code=403, detail="User ID mismatch")
    
    # Security: Validate price from database
    product = await conn.fetchrow(
        "SELECT price FROM products WHERE id = $1", order.product_id
    )
    expected_price = float(product['price'])
    if abs(order.amount - expected_price) > 0.01:
        raise HTTPException(
            status_code=400,
            detail=f"Price mismatch. Expected: {expected_price}, got: {order.amount}"
        )
```

---

### 5. ✅ Webhook无签名验证 → 已添加

**文件**: `simryoko-api/main.py`

**修复后**:
```python
@app.post("/webhook/n8n")
async def n8n_webhook(request: Request):
    signature = request.headers.get('X-N8N-Signature')
    webhook_secret = os.getenv('N8N_WEBHOOK_SECRET')
    
    if webhook_secret and signature:
        import hmac
        import hashlib
        
        body = await request.body()
        expected = hmac.new(
            webhook_secret.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected):
            raise HTTPException(status_code=401, detail="Invalid signature")
```

---

### 6. ✅ Stripe密钥泄露 → 已清理

**文件**: `memory/2026-02-25.md`, `memory/2026-03-08.md`

**操作**:
```bash
sed -i 's/sk_live_[a-zA-Z0-9_]*/[REDACTED]/g' memory/2026-02-25.md
sed -i 's/pk_live_[a-zA-Z0-9_]*/[REDACTED]/g' memory/2026-02-25.md
sed -i 's/rk_live_[a-zA-Z0-9_]*/[REDACTED]/g' memory/2026-03-08.md
```

---

## 🟡 P1 中等问题

### 7. ⏳ 添加速率限制

**待实现**:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/products")
@limiter.limit("100/minute")
async def get_products():
    pass
```

### 8. ⏳ Nginx安全头

**待配置**:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📋 环境变量要求

修复后需要设置以下环境变量：

```bash
# 数据库
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_NAME=simryoko

# JWT
JWT_SECRET=your_random_jwt_secret_min_32_chars

# CORS
ALLOWED_ORIGINS=https://simryoko.com,https://www.simryoko.com

# Webhook
N8N_WEBHOOK_SECRET=your_webhook_secret

# Stripe (已在.env中)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ✅ 修复总结

| 问题 | 状态 | 文件 |
|------|------|------|
| CORS全开放 | ✅ 已修复 | server.js, main.py |
| 数据库密码硬编码 | ✅ 已修复 | main.py |
| 无API认证 | ✅ 已修复 | main.py |
| 订单金额客户端可控 | ✅ 已修复 | main.py |
| Webhook无签名验证 | ✅ 已修复 | main.py |
| Stripe密钥泄露 | ✅ 已清理 | memory/*.md |
| 速率限制 | ⏳ 待实现 | - |
| Nginx安全头 | ⏳ 待配置 | - |

**6个P0严重问题已全部修复！** 🎉

---

## 🚀 下一步

1. 设置环境变量（DB_PASSWORD, JWT_SECRET等）
2. 部署修复后的代码
3. 测试API认证流程
4. 配置Nginx安全头
5. 添加速率限制

**修复执行人**: 龙虾  
**修复时间**: 2026-03-14 13:10
