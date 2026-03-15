"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Wifi, Clock, Zap, Globe, Shield, Smartphone,
  ChevronRight, Check, Plane, Headphones,
} from "lucide-react";
import Button from "@/components/ui/Button";
import type { Product } from "@/components/product/ProductCard";

function formatDataSize(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`;
  }
  return `${mb}MB`;
}

function getFlagEmoji(code: string): string {
  const flags: Record<string, string> = {
    JP: "🇯🇵", KR: "🇰🇷", TH: "🇹🇭", US: "🇺🇸", AU: "🇦🇺",
    GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", IT: "🇮🇹", ES: "🇪🇸",
    SG: "🇸🇬", MY: "🇲🇾", ID: "🇮🇩", VN: "🇻🇳", PH: "🇵🇭",
    CN: "🇨🇳", HK: "🇭🇰", TW: "🇹🇼",
  };
  return flags[code] || "🌍";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products?pageSize=100`);
        const data = await res.json();
        if (data.list) {
          const found = data.list.find((p: Product) => String(p.id) === String(params.id));
          if (found) {
            setProduct(found);
            // Find related products (same country)
            const country = found.countries?.[0]?.code;
            if (country) {
              setRelatedProducts(
                data.list
                  .filter((p: Product) => p.id !== found.id && p.countries?.some((c: any) => c.code === country))
                  .slice(0, 3)
              );
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-lg text-gray-500">产品未找到</p>
        <Link href="/products"><Button variant="outline">返回产品列表</Button></Link>
      </div>
    );
  }

  const country = product.countries?.[0];
  const countryName = country?.cn || "全球";
  const countryCode = country?.code || "GL";
  const flag = getFlagEmoji(countryCode);
  const isAvailable = product.status === "active" && product.stock > 0;

  const features = [
    { icon: Wifi, text: `${formatDataSize(product.dataSize)} 高速流量` },
    { icon: Clock, text: `${product.validDays} 天有效期` },
    { icon: Zap, text: "即买即用，无需等待" },
    { icon: Globe, text: "支持热点共享" },
    { icon: Shield, text: "数据加密，安全可靠" },
    { icon: Smartphone, text: "无需换卡，保留原号" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-700">SimRyoko</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-sm text-gray-600 hover:text-brand-600">
              全部套餐
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-brand-600">首页</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-brand-600">套餐</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <span className="text-5xl">{flag}</span>
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {product.name}
                  </h1>
                  {product.nameEn && (
                    <p className="text-sm text-gray-400">{product.nameEn}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-3 py-0.5 text-xs font-medium text-brand-700">
                      {product.type === "local" ? "本地套餐" : product.type === "regional" ? "区域套餐" : "全球套餐"}
                    </span>
                    {product.isHot && (
                      <span className="rounded-full bg-red-50 px-3 py-0.5 text-xs font-medium text-red-600">
                        🔥 热门
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key specs */}
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600">{formatDataSize(product.dataSize)}</p>
                  <p className="text-xs text-gray-500">流量</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600">{product.validDays}天</p>
                  <p className="text-xs text-gray-500">有效期</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">套餐特点</h3>
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <f.icon className="h-4 w-4 flex-shrink-0 text-brand-500" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* Coverage */}
              {product.countries && product.countries.length > 1 && (
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold text-gray-900">覆盖地区</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.countries.map((c) => (
                      <span
                        key={c.code}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                      >
                        {getFlagEmoji(c.code)} {c.cn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* How to use */}
              <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <h3 className="mb-4 font-semibold text-gray-900">使用步骤</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "购买套餐", desc: "选择套餐，填写邮箱完成支付" },
                    { step: "2", title: "接收QR码", desc: "支付成功后邮箱收到eSIM安装二维码" },
                    { step: "3", title: "扫码安装", desc: "在手机设置中添加eSIM，扫描QR码" },
                    { step: "4", title: "开启使用", desc: "到达目的地后开启数据漫游即可上网" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                        {s.step}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{s.title}</p>
                        <p className="text-sm text-gray-500">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Purchase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm text-gray-400">价格</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500">$</span>
                  <span className="text-4xl font-extrabold text-brand-700">
                    {product.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {product.stock < 100 && (
                <p className="mb-4 text-xs text-orange-600">⚡ 库存紧张：仅剩 {product.stock} 件</p>
              )}

              <div className="mb-6 space-y-2">
                {["安全支付", "即时发送", "7天退款保障"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!isAvailable}
                onClick={() => router.push(`/checkout?productId=${product.id}`)}
              >
                {isAvailable ? "立即购买" : "暂时缺货"}
              </Button>

              <a
                href="https://t.me/Simryokoesimbot"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-600"
              >
                <Headphones className="h-4 w-4" />
                购买咨询
              </a>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-gray-900">同地区其他套餐</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getFlagEmoji(p.countries?.[0]?.code || "")}</span>
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{formatDataSize(p.dataSize)}</span>
                    <span>{p.validDays}天</span>
                  </div>
                  <p className="text-lg font-bold text-brand-600">${p.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
