"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Shield, Zap, Headphones, ChevronRight, Plane, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard, { type Product } from "@/components/product/ProductCard";

const features = [
  { icon: Zap, title: "即买即用", desc: "购买后扫码激活，秒速联网，无需等待邮寄" },
  { icon: Globe, title: "200+国家覆盖", desc: "全球热门目的地全覆盖，一张eSIM走天下" },
  { icon: Shield, title: "安全可靠", desc: "运营商级网络，数据加密传输，隐私有保障" },
  { icon: Headphones, title: "7×24客服", desc: "中英双语客服团队，随时为您解决网络问题" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products?pageSize=6');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.list && Array.isArray(data.list) && data.list.length > 0) {
          setProducts(data.list);
        } else {
          setError('暂无产品数据');
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('加载失败，请刷新重试');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const handleBuy = (product: Product) => {
    window.location.href = `/products/${product.id}`;
  };

  return (
    <main className="overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-700">SimRyoko</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#products" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">套餐</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">优势</a>
            <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener noreferrer">
              <Button size="sm">Telegram 客服</Button>
            </a>
          </div>
          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="菜单"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu-enter border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-brand-50 active:bg-brand-100">套餐</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-brand-50 active:bg-brand-100">优势</a>
            <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener noreferrer" className="mt-2 block">
              <Button size="md" className="w-full">Telegram 客服</Button>
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-400/5 pt-16 pb-8 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(67,97,238,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-semibold text-brand-700">
              🌍 覆盖200+国家和地区
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 xs:text-4xl sm:text-5xl md:text-7xl">
              旅行上网<br />
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                从未如此简单
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:mt-6 sm:text-lg md:text-xl">
              SimRyoko eSIM — 即买即用，无需换卡，全球网络一键连接。
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="#products">
                <Button size="lg" icon={<ChevronRight className="h-5 w-5" />}>浏览套餐</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-gray-50 py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center" {...fadeUp}>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">热门eSIM套餐</h2>
            <p className="mt-3 text-gray-500">选择目的地，即刻出发</p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">加载产品中...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onBuy={handleBuy} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <a href="/products">
              <Button variant="ghost">查看全部套餐 →</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center" {...fadeUp}>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">为什么选择 SimRyoko</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                  <f.icon className="h-7 w-7 text-brand-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center text-white">
          <h2 className="text-3xl font-extrabold">准备好出发了吗？</h2>
          <div className="mt-8">
            <a href="#products">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">立即选购</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12 pb-24 md:pb-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-gray-400">© 2026 SimRyoko. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-lg md:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <a href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 text-brand-600">
            <Globe className="h-5 w-5" />
            <span className="text-[10px] font-medium">首页</span>
          </a>
          <a href="#products" className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500">
            <Zap className="h-5 w-5" />
            <span className="text-[10px] font-medium">套餐</span>
          </a>
          <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500">
            <Headphones className="h-5 w-5" />
            <span className="text-[10px] font-medium">客服</span>
          </a>
        </div>
      </div>
    </main>
  );
}
