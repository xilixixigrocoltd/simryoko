# SimRyoko 安全修复清单

**日期**: 2026-03-14  
**负责人**: Security-Lead  
**状态**: 紧急修复中

---

## 🔴 P0 - 严重安全漏洞（立即修复）

### 1. CORS全开放

**问题**: `allow_origins=["*"]`

**修复**:
```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://simryoko.com",
        "https://www.simryoko.com",
        "https://api.simryoko.com",
        "http://localhost:3000"  # 开发环境
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

---

### 2. 数据库密码硬编码

**问题**: `password='SimRyoko123'`

**修复**:
```python
# config.py
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    # 无默认值，必须从环境变量读取
    
    class Config:
        env_file = ".env"

settings = Settings()

# 使用时
if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL must be set")
```

---

### 3. 无API认证

**修复**: 添加JWT认证中间件

```python
# auth.py
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime, timedelta

security = HTTPBearer()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# 使用
@app.get("/api/orders")
async def get_orders(user: dict = Depends(verify_token)):
    # 已认证
    pass
```

---

### 4. Stripe密钥泄露

**问题**: 密钥记录在memory文件中

**修复**:
```bash
# 1. 从memory文件删除
sed -i '/sk_live_/d' /data/data/com.termux/files/home/.openclaw/workspace/memory/*.md
sed -i '/pk_live_/d' /data/data/com.termux/files/home/.openclaw/workspace/memory/*.md

# 2. 使用.env文件
echo "STRIPE_SECRET_KEY=sk_live_..." >> .env
echo "STRIPE_WEBHOOK_SECRET=whsec_..." >> .env

# 3. 添加到.gitignore
echo ".env" >> .gitignore
```

---

### 5. 订单金额客户端可控

**修复**: 服务端校验价格

```python
# orders.py
@app.post("/api/orders")
async def create_order(order: OrderCreate):
    # 根据product_id查询真实价格
    product = await get_product(order.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # 校验金额
    if order.amount != product.price:
        raise HTTPException(
            status_code=400, 
            detail=f"Price mismatch. Expected: {product.price}, got: {order.amount}"
        )
    
    # 创建订单
    return await create_order_db(order)
```

---

## 🟡 P1 - 中等问题

### 6. 添加速率限制

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/products")
@limiter.limit("100/minute")
async def get_products():
    pass
```

### 7. Webhook签名验证

```python
import stripe

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # 处理事件
    return {"status": "ok"}
```

---

## 🛡️ 安全扫描脚本

```python
#!/usr/bin/env python3
# security_scan.py

import os
import re

def scan_for_secrets():
    """扫描代码中的敏感信息"""
    patterns = [
        r'sk_live_[a-zA-Z0-9]{24,}',
        r'pk_live_[a-zA-Z0-9]{24,}',
        r'password\s*=\s*["\'][^"\']+["\']',
        r'api[_-]?key\s*=\s*["\'][^"\']+["\']',
        r'secret\s*=\s*["\'][^"\']+["\']',
    ]
    
    issues = []
    
    for root, dirs, files in os.walk('.'):
        # 跳过node_modules和.git
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__']]
        
        for file