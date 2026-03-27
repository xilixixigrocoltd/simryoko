# 组件代码模板

**用途**: 直接复制使用  
**技术栈**: React + TypeScript + Tailwind  
**依赖**: framer-motion, lucide-react

---

## 1. Button 组件

```tsx
// components/ui/Button.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon,
    rightIcon,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      outline: 'border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-50',
      ghost: 'text-neutral-700 hover:bg-neutral-100',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

**使用示例**:
```tsx
<Button>立即购买</Button>
<Button variant="secondary">了解更多</Button>
<Button isLoading>加载中</Button>
<Button leftIcon={<ShoppingCart />}>加入购物车</Button>
```

---

## 2. ProductCard 组件

```tsx
// components/product/ProductCard.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDataSize } from '@/lib/utils'
import { Product } from '@/types'
import { MapPin, Signal } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
  comparePrice?: number
}

export function ProductCard({ product, onAddToCart, comparePrice }: ProductCardProps) {
  const { 
    id, 
    name, 
    price, 
    originalPrice, 
    dataSize, 
    validDays, 
    country, 
    stock, 
    isHot, 
    hasVoice,
    soldCount 
  } = product

  const discount = originalPrice ? Math.round((1 - price/originalPrice) * 100) : 0
  const savings = comparePrice ? comparePrice - price : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
    >
      {/* 标签 */}
      <div className="absolute left-4 top-4 flex gap-2">
        {isHot && <Badge variant="hot">热销</Badge>}
        {hasVoice && <Badge variant="voice">语音</Badge>}
        {discount > 30 && <Badge variant="save">省{discount}%</Badge>}
      </div>

      {/* 国家信息 */}
      <div className="mb-4 pt-8">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{country.flag}</span>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{country.name}</h3>
            <p className="text-sm text-neutral-500">{name}</p>
          </div>
        </div>
      </div>

      {/* 价格 */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold text-primary-500">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-base text-neutral-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {savings > 0 && (
            <span className="text-sm font-medium text-green-500">
              比Airalo省{formatPrice(savings)}
            </span>
          )}
        </div>
      </div>

      {/* 规格 */}
      <div className="mb-4 space-y-2 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Signal className="h-4 w-4" />
          <span>{formatDataSize(dataSize)} / {validDays}天</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>覆盖{country.name}全国</span>
        </div>
      </div>

      {/* 库存和销量 */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <StockIndicator stock={stock} />
        {soldCount > 0 && (
          <span className="text-neutral-500">已售 {soldCount.toLocaleString()}</span>
        )}
      </div>

      {/* 按钮 */}
      <Button 
        onClick={onAddToCart} 
        className="w-full"
        disabled={stock <= 0}
      >
        {stock <= 0 ? '暂时缺货' : '立即购买'}
      </Button>
    </motion.div>
  )
}
```

---

## 3. Badge 组件

```tsx
// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'hot' | 'new' | 'recommend' | 'voice' | 'save'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'hot', children, className }: BadgeProps) {
  const variants = {
    hot: 'bg-primary-500 text-white',
    new: 'bg-green-500 text-white',
    recommend: 'bg-blue-500 text-white',
    voice: 'bg-purple-500 text-white',
    save: 'bg-green-100 text-green-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
```

---

## 4. StockIndicator 组件

```tsx
// components/product/StockIndicator.tsx
import { cn } from '@/lib/utils'

interface StockIndicatorProps {
  stock: number
  className?: string
}

export function StockIndicator({ stock, className }: StockIndicatorProps) {
  if (stock > 100) {
    return (
      <span className={cn('flex items-center gap-1 text-green-600', className)}>
        <span className="h-2 w-2 rounded-full bg-green-500" />
        库存充足
      </span>
    )
  }
  
  if (stock > 10) {
    return (
      <span className={cn('flex items-center gap-1 text-yellow-600', className)}>
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        库存紧张 (剩{stock}件)
      </span>
    )
  }
  
  if (stock > 0) {
    return (
      <span className={cn('flex items-center gap-1 text-orange-600', className)}>
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        仅剩{stock}件
      </span>
    )
  }
  
  return (
    <span className={cn('flex items-center gap-1 text-red-600', className)}>
      <span className="h-2 w-2 rounded-full bg-red-500" />
      暂时缺货
    </span>
  )
}
```

---

## 5. Input 组件

```tsx
// components/ui/Input.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search'
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error, ...props }, ref) => {
    if (variant === 'search') {
      return (
        <div className="relative">
          <Search className="absolute left-4 left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-neutral-400" />
          <input
            ref={ref}
            className={cn(
              'h-16 w-full rounded-full border-2 border-neutral-200',
              'bg-white pl-14 pr-6 text-lg',
              'placeholder:text-neutral-400',
              'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10',
              'transition-all duration-200',
              className
            )}
            {...props}
          />
        </div>
      )
    }

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-lg border px-4',
            'bg-white text-base',
            'placeholder:text-neutral-400',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10',
            'transition-all duration-200',
            error ? 'border-red-500' : 'border-neutral-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
```

---

## 6. PriceComparison 组件

```tsx
// components/sections/PriceComparison.tsx
'use client'

import { motion } from 'framer-motion'

const comparisons = [
  { product: '亚洲500MB/3天', us: 1.53, airalo: 5.00, ubigi: 6.00 },
  { product: '日本1GB/7天', us: 4.00, airalo: 8.00, ubigi: 9.50 },
  { product: '欧洲10GB/30天', us: 28.00, airalo: 35.00, ubigi: 38.00 },
  { product: '全球+语音', us: 15.00, airalo: null, note: 'Airalo无此产品' },
]

export function PriceComparison() {
  return (
    <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            为什么更便宜？
          </h2>
          <p className="text-white/80 text-lg">
            同款产品，更低的价格
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <table className="w-full">
            <thead className="bg-secondary-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left">产品</th>
                <th className="px-6 py-4 text-center">SimKaze</th>
                <th className="px-6 py-4 text-center">Airalo</th>
                <th className="px-6 py-4 text-center">节省</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item, index) => (
                <motion.tr
                  key={item.product}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="px-6 py-4 font-medium">{item.product}</td>
                  <td className="px-6 py-4 text-center text-2xl font-bold text-primary-500">
                    ${item.us}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.airalo ? (
                      <span className="text-neutral-400 line-through">
                        ${item.airalo}
                      </span>
                    ) : (
                      <span className="text-neutral-400">{item.note}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.airalo ? (
                      <span className="font-bold text-green-500">
                        {Math.round((1 - item.us/item.airalo) * 100)}%
                      </span>
                    ) : (
                      <span className="font-bold text-primary-500">唯一</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
```

---

## 7. ProductFilter 组件

```tsx
// components/product/ProductFilter.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const filters = {
  data: ['全部', '500MB', '1GB', '3GB', '5GB', '10GB+', '无限'],
  days: ['全部', '3天', '7天', '15天', '30天'],
  price: ['全部', '$0-5', '$5-10', '$10-20', '$20-50', '$50+'],
}

export function ProductFilter() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }))
  }

  const clearFilters = () => {
    setActiveFilters({})
  }

  return (
    <div className="mb-8 space-y-4">
      {Object.entries(filters).map(([category, options]) => (
        <div key={category} className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-500 min-w-[60px]">
            {category === 'data' && '流量:'}
            {category === 'days' && '有效期:'}
            {category === 'price' && '价格:'}
          </span>
          {options.map(option => (
            <button
              key={option}
              onClick={() => toggleFilter(category, option)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                activeFilters[category] === option
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ))}
      
      {Object.values(activeFilters).some(Boolean) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          清除筛选
        </Button>
      )}
    </div>
  )
}
```

---

## 8. Hero 组件

```tsx
// components/sections/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'

const hotSearches = ['日本', '韩国', '欧洲', '美国', '亚洲$1.53起']

export function Hero() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-secondary-500 to-secondary-700">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-hero mb-6 text-white">
            全球eSIM，一站购齐
          </h1>
          <p className="mb-8 text-xl text-white/80">
            2,720款产品，214国覆盖，$1.53起
          </p>

          {/* 搜索框 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-6 max-w-2xl"
          >
            <Input
              variant="search"
              placeholder="搜索国家或地区，如：日本、欧洲..."
            />
          </motion.div>

          {/* 热门搜索 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items
-center justify-center gap-3'
          >
            <span className="text-white/60">热门:</span>
            {hotSearches.map((term) => (
              <button
                key={term}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" className="mt-8">
              <Search className="mr-2 h-5 w-5" />
              立即搜索目的地
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 9. 工具函数

```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function formatDataSize(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024
    return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`
  }
  return `${mb}MB`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
```

---

## 10. 类型定义

```ts
// types/index.ts
export interface Country {
  code: string
  name: string
  nameEn: string
  flag: string
}

export interface Product {
  id: number
  name: string
  nameEn: string
  type: 'local' | 'regional' | 'global'
  price: number
  originalPrice?: number
  costPrice?: number
  dataSize: number // MB
  validDays: number
  country: Country
  countries?: Country[]
  operator?: string
  operatorTitle?: string
  stock: number
  soldCount: number
  isHot: boolean
  isRecommend: boolean
  hasVoice: boolean
  hasSMS: boolean
  voiceMinutes?: number
  smsCount?: number
  rating: number
  reviewCount: number
  features?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalAmount: number
  discount: number
  finalAmount: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  createdAt: string
  paidAt?: string
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  orders: Order[]
}
```

---

**组件模板完成**  
**组件数**: 10个  
**可直接复制使用**
