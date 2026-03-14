"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Zap, Headphones, ChevronRight, Plane } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard, { type Product } from "@/components/product/ProductCard";

const products: Product[] = [
  { id: "jp-3", region: "亚洲", country: "日本", flag: "🇯🇵", dataAmount: "3GB", duration: "7天", price: 25 },
  { id: "kr-5", region: "亚洲", country: "韩国", flag: "🇰🇷", dataAmount: "5GB", duration: "7天", price: 30, popular: true },
  { id: "th-5", region: "东南亚", country: "泰国", flag: "🇹🇭", dataAmount: "5GB", duration: "10天", price: 22 },
  { id: "us-10", region: "北美", country: "美国", flag: "🇺🇸", dataAmount: "10GB", duration: "15天", price: 48 },
  { id: "eu-10", region: "欧洲", country: "欧洲多国", flag: "🇪🇺", dataAmount: "10GB", duration: "30天", price: 68, popular: true },
  { id: "au-5", region: "大洋洲", country: "澳大利亚", flag: "🇦🇺", dataAmount: "5GB", duration: "10天", price: 35 },
];

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
  return (
    <main className="overflow-x-hidden">
      {/* ===== Nav ===== */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-700">SimRyoko</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#products" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">套餐</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">优势</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">常见问题</a>
            <Button size="sm">下载APP</Button>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-400/5 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(67,97,238,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-4 inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700">
              🌍 覆盖200+国家和地区
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl">
              旅行上网
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                从未如此简单
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 md:text-xl">
              SimRyoko eSIM — 即买即用，无需换卡，全球网络一键连接。
              <br className="hidden md:block" />
              让每一次出行都畅享无忧网络。
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" icon={<ChevronRight className="h-5 w-5" />}>
                浏览套餐
              </Button>
              <Button variant="outline" size="lg">
                了解更多
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Products ===== */}
      <section id="products" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">热门eSIM套餐</h2>
            <p className="mt-3 text-gray-500">选择目的地，即刻出发</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="ghost" size="lg">
              查看全部套餐 →
            </Button>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">为什么选择 SimRyoko</h2>
            <p className="mt-3 text-gray-500">我们让全球上网变得简单、快速、可靠</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow"
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

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl px-6 text-center text-white">
          <h2 className="text-3xl font-extrabold md:text-4xl">准备好出发了吗？</h2>
          <p className="mt-4 text-lg text-brand-100">
            加入数万旅行者的选择，用SimRyoko eSIM开启无忧旅途
          </p>
          <div className="mt-8">
            <Button variant="secondary" size="lg">
              立即选购 🚀
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-brand-600" />
              <span className="font-bold text-brand-700">SimRyoko</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-brand-600 transition-colors">关于我们</a>
              <a href="#" className="hover:text-brand-600 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-brand-600 transition-colors">使用条款</a>
              <a href="https://t.me/+lUV96AsCFygxNDg9" className="hover:text-brand-600 transition-colors">Telegram</a>
            </div>
            <p className="text-sm text-gray-400">© 2026 SimRyoko. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
