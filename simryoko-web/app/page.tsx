'use client'

import { motion } from 'framer-motion'
import { Globe, Shield, Zap, Headphones, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import ProductCard, { Product } from '@/components/product/ProductCard'

const popularProducts: Product[] = [
  { id: '1', country: '日本', flag: '🇯🇵', data: '3GB', duration: '7天', price: 25, originalPrice: 35, popular: true },
  { id: '2', country: '韩国', flag: '🇰🇷', data: '5GB', duration: '7天', price: 30, originalPrice: 42 },
  { id: '3', country: '泰国', flag: '🇹🇭', data: '5GB', duration: '10天', price: 22, originalPrice: 30, popular: true },
  { id: '4', country: '美国', flag: '🇺🇸', data: '10GB', duration: '15天', price: 58, originalPrice: 75 },
  { id: '5', country: '新加坡', flag: '🇸🇬', data: '3GB', duration: '7天', price: 20 },
  { id: '6', country: '欧洲多国', flag: '🇪🇺', data: '10GB', duration: '30天', price: 88, originalPrice: 120, popular: true },
]

const features = [
  { icon: Globe, title: '200+ 国家覆盖', desc: '全球主流运营商合作，信号稳定' },
  { icon: Zap, title: '即买即用', desc: '扫码激活，无需等待实体卡邮寄' },
  { icon: Shield, title: '安全可靠', desc: '数据加密，隐私保护，放心使用' },
  { icon: Headphones, title: '7×24 客服', desc: '中英双语客服，随时解决问题' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-dark-2 to-[#0F1629] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(108,99,255,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              全球旅行
              <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
                {' '}eSIM{' '}
              </span>
              轻松出发
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              覆盖 200+ 国家和地区，即买即用的 eSIM 流量套餐。
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>告别换卡烦恼，让旅途更自由。
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Button size="lg" className="flex-1 sm:flex-none min-w-0">
                浏览套餐 <ChevronRight className="ml-1 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="flex-1 sm:flex-none min-w-0 border-white/30 text-white hover:bg-white/10 hover:text-white">
                了解 eSIM
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 sm:p-6"
            >
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">🔥 热门套餐</h2>
          <a href="/shop" className="text-brand font-medium flex items-center hover:underline">
            查看全部 <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand to-purple-500 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">准备好出发了吗？</h2>
          <p className="text-lg opacity-90 mb-8">3分钟完成购买，扫码即可激活使用</p>
          <Button size="lg" className="bg-white text-brand hover:bg-gray-100">
            立即选购 <ChevronRight className="ml-1 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg font-bold text-white mb-2">SimRyoko</p>
          <p className="text-sm">© 2026 SimRyoko. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
