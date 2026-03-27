# SimRyoko 前端缺失页面清单

**日期**: 2026-03-14  
**负责人**: FullStack-Dev  
**状态**: 开发中

---

## 📋 缺失页面

### 1. 国家eSIM列表页 `/country/[code]`

**功能**:
- 显示指定国家的所有eSIM套餐
- 按流量/天数/价格筛选
- 排序功能

**组件**:
```tsx
// app/country/[code]/page.tsx
import { ProductCard } from '@/components/product/ProductCard'
import { FilterBar } from '@/components/ui/FilterBar'

interface CountryPageProps {
  params: { code: string }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { code } = params
  const products = await fetch(`/api/products?country=${code.toUpperCase()}`).then(r => r.json())
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {getCountryName(code)} eSIM Plans
      </h1>
      <FilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.data.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

---

### 2. 产品详情页 `/product/[id]`

**功能**:
- 显示单个产品详细信息
- 购买按钮
- 相关产品推荐

**组件**:
```tsx
// app/product/[id]/page.tsx
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params
  const product = await fetch(`/api/inventory/${id}`).then(r => r.json())
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-brand">
              {formatPrice(product.price)}
            </span>
            <span className="text-green-600">
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-gray-500">Data</span>
              <p className="font-semibold">{product.dataAmount} GB</p>
            </div>
            <div>
              <span className="text-gray-500">Validity</span>
              <p className="font-semibold">{product.validityDays} Days</p>
            </div>
          </div>
          
          <Button size="lg" className="w-full">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

### 3. 结账页 `/checkout`

**功能**:
- 订单确认
- Stripe支付集成
- 邮箱输入

**组件**:
```tsx
// app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!)

export default function CheckoutPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleCheckout = async () => {
    setLoading(true)
    
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const { sessionId } = await response.json()
    const stripe = await stripePromise
    
    await stripe?.redirectToCheckout({ sessionId })
    setLoading(false)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <Button
          onClick={handleCheckout}
          loading={loading}
          className="w-full"
        >
          Pay with Stripe
        </Button>
      </div>
    </div>
  )
}
```

---

### 4. 用户中心 `/account`

**功能**:
- 订单历史
- 个人信息
- eSIM管理

**组件**:
```tsx
// app/account/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const token = cookies().get('token')
  
  if (!token) {
    redirect('/login')
  }
  
  const orders = await fetch('/api/user/orders', {
    headers: { Authorization: `Bearer ${token.value}` }
  }).then(r => r.json())
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border-b pb-4">
                <div className="flex justify-between">
                  <span>Order #{order.id}</span>
                  <span className={order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{order.productName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### 5. 订单成功页 `/order/success`

**功能**:
- 显示订单确认
- 提供eSIM二维码
- 安装指南

**组件**:
```tsx
// app/order/success/page.tsx
import { QRCode } from '@/components/ui/QRCode'
import { Button } from '@/components/ui/Button'

interface SuccessPageProps {
  searchParams: { orderId?: string }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = searchParams
  
  if (!orderId) {
    return <div>Invalid order</div>
  }
  
  const order = await fetch(`/api/orders/${orderId}`).then(r => r.json())
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          ✅
        </div>
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Your eSIM</h2>
        <QRCode value={order.activationCode} size={200} />
        <p className="text-sm text-gray-500 mt-4">
          Scan this QR code to install your eSIM
        </p>
      </div>
      
      <div className="space-y-2">
        <Button variant="secondary" className="w-full">
          Download QR Code
        </Button>
        <Button variant="outline" className="w-full">
          View Installation Guide
        </Button>
      </div>
    </div>
  )
}
```

---

## 📁 目录结构

```
app/
├── page.tsx              # ✅ 已有
├── layout.tsx            # ✅ 已有
├── globals.css           # ✅ 已有
├── country/
│   └── [code]/
│       └── page.tsx      # ⬜ 待创建
├── product/
│   └── [id]/
│       └── page.tsx      # ⬜ 待创建
├── checkout/
│   └── page.tsx          # ⬜ 待创建
├── account/
│   └── page.tsx          # ⬜ 待创建
└── order/
    └── success/
        └── page.tsx      # ⬜ 待创建
```

---

## 🔧 API集成

所有页面需要调用的API:

| 端点 | 用途 |
|------|------|
| `/api/products?country=XX` | 获取国家产品 |
| `/api/inventory/:id` | 获取产品详情 |
| `/api/checkout` | 创建支付会话 |
| `/api/user/orders` | 获取用户订单 |
| `/api/orders/:id` | 获取订单详情 |

---

## 📞 联系

开发问题联系: FullStack-Dev-AI / 龙虾
