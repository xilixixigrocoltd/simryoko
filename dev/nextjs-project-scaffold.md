# Next.js 项目脚手架 v1.0

**用途**: 快速创建SimRyoko项目  
**技术栈**: Next.js 14 + TypeScript + Tailwind CSS  
**预计时间**: 15分钟

---

## 第一步：项目初始化

```bash
# 1. 创建项目
npx create-next-app@latest simryoko-web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

# 2. 进入项目
cd simryoko-web

# 3. 安装依赖
npm install \
  framer-motion \
  lucide-react \
  @headlessui/react \
  next-i18next \
  react-i18next \
  i18next \
  swr \
  @stripe/stripe-js \
  @stripe/react-stripe-js

# 4. 安装开发依赖
npm install -D \
  @types/node \
  @types/react \
  @types/react-dom \
  prettier \
  eslint-config-prettier
```

---

## 第二步：目录结构

```
simryoko-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   ├── globals.css              # 全局样式
│   ├── country/
│   │   └── [code]/
│   │       └── page.tsx         # 国家页
│   ├── regional/
│   │   └── [slug]/
│   │       └── page.tsx         # 区域页
│   ├── global/
│   │   └── page.tsx             # 全球页
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx         # 产品详情
│   ├── search/
│   │   └── page.tsx             # 搜索页
│   ├── checkout/
│   │   └── page.tsx             # 结账页
│   ├── account/
│   │   ├── page.tsx             # 账户中心
│   │   ├── orders/
│   │   │   └── page.tsx         # 我的订单
│   │   └── esims/
│   │       └── page.tsx         # 我的eSIM
│   └── api/                     # API路由
│       ├── products/
│       │   └── route.ts         # 产品列表API
│       └── orders/
│           └── route.ts         # 订单API
│
├── components/                   # 组件
│   ├── ui/                      # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Icon.tsx
│   ├── product/                 # 产品相关
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   ├── PriceComparison.tsx
│   │   └── StockIndicator.tsx
│   ├── layout/                  # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Container.tsx
│   └── sections/                # 页面区块
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── PopularProducts.tsx
│       ├── PriceComparison.tsx
│       ├── VoiceSection.tsx
│       └── FAQ.tsx
│
├── hooks/                        # 自定义Hooks
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCart.ts
│   └── useLocale.ts
│
├── lib/                          # 工具函数
│   ├── api.ts                   # API调用
│   ├── utils.ts                 # 通用工具
│   ├── constants.ts             # 常量
│   └── i18n.ts                  # 国际化配置
│
├── types/                        # TypeScript类型
│   └── index.ts
│
├── public/                       # 静态资源
│   ├── images/
│   ├── icons/
│   └── locales/                 # 翻译文件
│       ├── zh-CN/
│       ├── en/
│       ├── ja/
│       └── ko/
│
├── styles/                       # 样式
│   └── globals.css
│
├── tailwind.config.ts           # Tailwind配置
├── next.config.js               # Next.js配置
├── tsconfig.json                # TypeScript配置
└── package.json
```

---

## 第三步：配置文件

### 3.1 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0',
          100: '#FFE6DC',
          200: '#FFC9B8',
          300: '#FFA08A',
          400: '#FF7A5C',
          500: '#FF6B35', // 品牌主色
          600: '#E55A2B',
          700: '#CC4A23',
          800: '#A33D1D',
          900: '#7A2E16',
        },
        secondary: {
          50: '#E8F4F8',
          100: '#D1E9F1',
          200: '#A3D3E3',
          300: '#75BDD5',
          400: '#47A7C7',
          500: '#1E3A5F', // 品牌辅助色
          600: '#1A3352',
          700: '#162B46',
          800: '#12243A',
          900: '#0E1C2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'hero': ['56px', { lineHeight: '62px', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '28px', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(255, 107, 53, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
```

### 3.2 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['simryoko.com', 'cdn.simryoko.com'],
  },
  i18n: {
    locales: ['zh-CN', 'en', 'ja', 'ko'],
    defaultLocale: 'zh-CN',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ciuh32wky.xigrocoltd.com/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
```

### 3.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 第四步：核心组件代码

### 4.1 Button.tsx

```typescript
// components/ui/Button.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95',
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
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

### 4.2 ProductCard.tsx

```typescript
// components/product/ProductCard.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StockIndicator } from './StockIndicator'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { id, name, price, originalPrice, dataSize, validDays, country, stock, isHot, hasVoice } = product

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
    >
      {/* 标签 */}
      <div className="absolute left-4 top-4 flex gap-2">
        {isHot && <Badge variant="hot">热销</Badge>}
        {hasVoice && <Badge variant="voice">语音</Badge>}
      </div>

      {/* 国家信息 */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{country.flag}</span>
          <h3 className="text-h4 font-semibold text-neutral-900">{country.name}</h3>
        </div>
        <p className="text-body-sm text-neutral-500">{name}</p>
      </div>

      {/* 价格 */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-hero font-bold text-primary-500">${price}</span>
          {originalPrice && (
            <>
              <span className="text-body text-neutral-400 line-through">${originalPrice}</span>
              <span className="text-body-sm text-success-500">省{Math.round((1 - price/originalPrice) * 100)}%</span>
            </>
          )}
        </div>
      </div>

      {/* 规格 */}
      <div className="mb-4 space-y-2 text-body-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <span>📶</span>
          <span>{dataSize >= 1024 ? `${dataSize/1024}GB` : `${dataSize}MB`} / {validDays}天</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🌐</span>
          <span>覆盖{country.name}全国</span>
        </div>
      </div>

      {/* 库存 */}
      <StockIndicator stock={stock} className="mb-4" />

      {/* 按钮 */}
      <Button onClick={onAddToCart} className="w-full">
        立即购买
      </Button>
    </motion.div>
  )
}
```

### 4.3 types/index.ts

```typescript
// types/index.ts

export interface Country {
  code: string
  name: string
  flag: string
}

export interface Product {
  id: number
  name: string
  type: 'local' | 'regional' | 'global'
  price: number
  originalPrice?: number
  costPrice?: number
  dataSize: number // MB
  validDays: number
  country: Country
  countries?: Country[]
  operator?: string
  stock: number
  soldCount: number
  isHot: boolean
  isRecommend: boolean
  hasVoice: boolean
  hasSMS: boolean
  rating: number
  reviewCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalAmount: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  createdAt: string
}
```

### 4.4 lib/utils.ts

```typescript
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
    return `${(mb / 1024).toFixed(1)}GB`
  }
  return `${mb}MB`
}
```

---

## 第五步：页面代码

### 5.1 首页 page.tsx

```typescript
// app/page.tsx
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { PopularProducts } from '@/components/sections/PopularProducts'
import { PriceComparison } from '@/components/sections/PriceComparison'
import { VoiceSection } from '@/components/sections/VoiceSection'
import { FAQ } from '@/components/sections/FAQ'

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <PopularProducts />
      <PriceComparison />
      <VoiceSection />
      <FAQ />
    </main>
  )
}
```

### 5.2 国家页 page.tsx

```typescript
// app/country/[code]/page.tsx
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilter } from '@/components/product/ProductFilter'
import { getProductsByCountry } from '@/lib/api'

interface CountryPageProps {
  params: { code: string }
  searchParams: { 
    data?: string
    days?: string
    sort?: string 
  }
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const { code } = params
  const products = await getProductsByCountry(code, searchParams)
  
  if (!products.length) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* 国家Header */}
      <div className="mb-8">
        <h1 className="text-h1 mb-2">{products[0].country.name}</h1>
        <p className="text-body-lg text-neutral-600">
          共 {products.length} 款产品可选
        </p>
      </div>

      {/* 筛选器 */}
      <ProductFilter />

      {/* 产品网格 */}
      <ProductGrid products={products} />
    </main>
  )
}
```

---

## 第六步：启动项目

```bash
# 1. 开发模式
npm run dev

# 2. 构建
npm run build

# 3. 生产启动
npm start

# 4. 代码检查
npm run lint

# 5. 格式化
npx prettier --write .
```

---

## 第七步：部署配置

### 7.1 Vercel部署

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod
```

### 7.2 环境变量

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://ciuh32wky.xigrocoltd.com/api
NEXT_PUBLIC_STRIPE_PK=pk_live_...
STRIPE_SK=sk_live_...
```

---

## 快速检查清单

项目创建完成后检查:

- [ ] `npm run dev` 正常启动
- [ ] 首页显示正常
- [ ] Tailwind样式生效
- [ ] 组件能正常渲染
- [ ] API调用正常
- [ ] 构建无错误

---

**脚手架完成**  
**预计搭建时间**: 15-30分钟  
**下一步**: 开始开发具体页面
