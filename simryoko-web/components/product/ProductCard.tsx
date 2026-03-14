'use client'

import { motion } from 'framer-motion'
import { Wifi, Clock, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'

export interface Product {
  id: string
  country: string
  flag: string
  data: string
  duration: string
  price: number
  originalPrice?: number
  popular?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
    >
      {product.popular && (
        <span className="absolute -top-3 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
          🔥 热门
        </span>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{product.flag}</span>
        <div>
          <h3 className="font-bold text-lg text-dark">{product.country}</h3>
          <span className="text-sm text-gray-500">eSIM 流量套餐</span>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Wifi className="w-4 h-4 text-brand" />
          <span>{product.data} 高速流量</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-brand" />
          <span>{product.duration} 有效期</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="w-4 h-4 text-brand" />
          <span>即买即用 · 无需实体卡</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-brand">¥{product.price}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
          )}
          {discount > 0 && (
            <span className="ml-2 text-xs text-success font-semibold">-{discount}%</span>
          )}
        </div>
        <Button size="sm">购买</Button>
      </div>
    </motion.div>
  )
}
