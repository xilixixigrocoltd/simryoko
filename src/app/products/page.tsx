"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Filter, Plane, Headphones, Zap, X } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductCard, { type Product } from "@/components/product/ProductCard";
import Link from "next/link";

const regions = [
  { label: "全部", value: "" },
  { label: "🌏 亚洲", value: "asia" },
  { label: "🌍 欧洲", value: "europe" },
  { label: "🌎 北美", value: "north-america" },
  { label: "🌏 东南亚", value: "southeast-asia" },
  { label: "🌍 大洋洲", value: "oceania" },
];

const popularCountries = [
  { label: "🇯🇵 日本", code: "JP" },
  { label: "🇰🇷 韩国", code: "KR" },
  { label: "🇹🇭 泰国", code: "TH" },
  { label: "🇺🇸 美国", code: "US" },
  { label: "🇬🇧 英国", code: "GB" },
  { label: "🇸🇬 新加坡", code: "SG" },
  { label: "🇦🇺 澳大利亚", code: "AU" },
  { label: "🇫🇷 法国", code: "FR" },
  { label: "🇩🇪 德国", code: "DE" },
  { label: "🇻🇳 越南", code: "VN" },
  { label: "🇲🇾 马来西亚", code: "MY" },
  { label: "🇮🇩 印尼", code: "ID" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchProducts = useCallback(async (country?: string, type?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ pageSize: "100" });
      if (country) params.set("country", country);
      if (type) params.set("type", type);

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      if (data.list && Array.isArray(data.list)) {
        setProducts(data.list);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      setError("加载失败，请刷新重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCountry, filterType);
  }, [selectedCountry, filterType, fetchProducts]);

  const handleBuy = (product: Product) => {
    window.location.href = `/checkout?productId=${product.id}`;
  };

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.countries?.some(
            (c) =>
              c.cn.includes(searchQuery) ||
              c.en.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : products;

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
            <Link href="/" className="hidden text-sm text-gray-600 hover:text-brand-600 sm:block">
              首页
            </Link>
            <a href="https://t.me/Simryokoesimbot" target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <Headphones className="h-4 w-4" /> 客服
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-accent-400/5 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">全球eSIM套餐</h1>
          <p className="mt-3 text-gray-500">覆盖200+国家和地区，找到最适合你的旅行套餐</p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索国家或地区..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Popular country filters */}
        <div className="mb-8">
          <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            热门目的地
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCountry("")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                !selectedCountry
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"
              }`}
            >
              全部
            </button>
            {popularCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code === selectedCountry ? "" : c.code)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCountry === c.code
                    ? "bg-brand-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div className="mb-8 flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">套餐类型：</span>
          {[
            { label: "全部", value: "" },
            { label: "本地套餐", value: "local" },
            { label: "区域套餐", value: "regional" },
            { label: "全球套餐", value: "global" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                filterType === t.value
                  ? "bg-brand-100 text-brand-700 font-medium"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
            <p className="mt-4 text-gray-500">加载产品中...</p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => fetchProducts(selectedCountry, filterType)}>
              重试
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mb-6 text-sm text-gray-400">
              共 {filteredProducts.length} 个套餐
              {selectedCountry && " · 已筛选"}
            </p>
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onBuy={handleBuy} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Globe className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">没有找到匹配的套餐</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCountry("");
                    setSearchQuery("");
                    setFilterType("");
                  }}
                >
                  清除筛选
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-gray-400">© 2026 SimRyoko. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
