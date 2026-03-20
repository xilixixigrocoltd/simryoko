'use client'

import { useState } from 'react'
import { Search, Filter, Wifi, ArrowRight, Globe, ChevronDown } from 'lucide-react'

const regions = ['全部', '亚洲', '欧洲', '美洲', '大洋洲', '非洲', '多国套餐']

const plans = [
  { country: '日本', flag: '🇯🇵', region: '亚洲', slug: 'japan', options: [
    { days: 3, data: '3GB', price: 18 },
    { days: 7, data: '无限流量', price: 35 },
    { days: 15, data: '无限流量', price: 55 },
    { days: 30, data: '无限流量', price: 85 },
  ]},
  { country: '韩国', flag: '🇰🇷', region: '亚洲', slug: 'korea', options: [
    { days: 3, data: '3GB', price: 15 },
    { days: 5, data: '10GB', price: 28 },
    { days: 7, data: '无限流量', price: 38 },
    { days: 30, data: '无限流量', price: 78 },
  ]},
  { country: '泰国', flag: '🇹🇭', region: '亚洲', slug: 'thailand', options: [
    { days: 5, data: '5GB', price: 18 },
    { days: 7, data: '无限流量', price: 30 },
    { days: 15, data: '无限流量', price: 48 },
  ]},
  { country: '新加坡', flag: '🇸🇬', region: '亚洲', slug: 'singapore', options: [
    { days: 5, data: '5GB', price: 20 },
    { days: 7, data: '8GB', price: 25 },
    { days: 15, data: '15GB', price: 45 },
  ]},
  { country: '马来西亚', flag: '🇲🇾', region: '亚洲', slug: 'malaysia', options: [
    { days: 7, data: '5GB', price: 20 },
    { days: 15, data: '10GB', price: 35 },
  ]},
  { country: '越南', flag: '🇻🇳', region: '亚洲', slug: 'vietnam', options: [
    { days: 7, data: '5GB', price: 18 },
    { days: 15, data: '10GB', price: 30 },
  ]},
  { country: '美国', flag: '🇺🇸', region: '美洲', slug: 'usa', options: [
    { days: 7, data: '5GB', price: 35 },
    { days: 15, data: '20GB', price: 68 },
    { days: 30, data: '无限流量', price: 128 },
  ]},
  { country: '加拿大', flag: '🇨🇦', region: '美洲', slug: 'canada', options: [
    { days: 7, data: '5GB', price: 38 },
    { days: 15, data: '10GB', price: 65 },
  ]},
  { country: '英国', flag: '🇬🇧', region: '欧洲', slug: 'uk', options: [
    { days: 7, data: '5GB', price: 30 },
    { days: 15, data: '10GB', price: 50 },
    { days: 30, data: '20GB', price: 88 },
  ]},
  { country: '法国', flag: '🇫🇷', region: '欧洲', slug: 'france', options: [
    { days: 7, data: '5GB', price: 30 },
    { days: 15, data: '10GB', price: 50 },
  ]},
  { country: '德国', flag: '🇩🇪', region: '欧洲', slug: 'germany', options: [
    { days: 7, data: '5GB', price: 30 },
    { days: 15, data: '10GB', price: 50 },
  ]},
  { country: '欧洲多国', flag: '🇪🇺', region: '多国套餐', slug: 'europe-multi', options: [
    { days: 7, data: '5GB', price: 35 },
    { days: 15, data: '10GB', price: 58 },
    { days: 30, data: '20GB', price: 98 },
  ]},
  { country: '澳大利亚', flag: '🇦🇺', region: '大洋洲', slug: 'australia', options: [
    { days: 7, data: '5GB', price: 32 },
    { days: 15, data: '10GB', price: 55 },
  ]},
  { country: '新西兰', flag: '🇳🇿', region: '大洋洲', slug: 'new-zealand', options: [
    { days: 7, data: '5GB', price: 35 },
    { days: 15, data: '10GB', price: 58 },
  ]},
  { country: '土耳其', flag: '🇹🇷', region: '欧洲', slug: 'turkey', options: [
    { days: 7, data: '5GB', price: 22 },
    { days: 15, data: '10GB', price: 38 },
  ]},
  { country: '埃及', flag: '🇪🇬', region: '非洲', slug: 'egypt', options: [
    { days: 7, data: '3GB', price: 25 },
    { days: 15, data: '5GB', price: 40 },
  ]},
]

export default function PlansPage() {
  const [activeRegion, setActiveRegion] = useState('全部')
  const [search, setSearch] = useState('')

  const filtered = plans.filter((p) => {
    const matchRegion = activeRegion === '全部' || p.region === activeRegion
    const matchSearch = p.country.toLowerCase().includes(search.toLowerCase())
    return matchRegion && matchSearch
  })

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="bg-gradient-to-br from-navy-950 to-navy-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            全球eSIM套餐
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mb-8">
            选择您的旅行目的地，找到最适合的eSIM数据方案
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索国家或地区..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Region tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeRegion === r
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            共 <span className="font-semibold text-navy-900">{filtered.length}</span> 个目的地
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <a
              key={p.slug}
              href={`/plans/${p.slug}`}
              className="card group overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className="text-5xl leading-none">{p.flag}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-orange-500 transition-colors">
                      {p.country}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{p.region}</span>
                      <span className="mx-1">·</span>
                      <span>{p.options.length} 种方案</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Options preview */}
              <div className="px-6 pb-2">
                <div className="space-y-2">
                  {p.options.slice(0, 3).map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-medium">{opt.days}天</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">{opt.data}</span>
                      </div>
                      <span className="font-bold text-navy-900">¥{opt.price}</span>
                    </div>
                  ))}
                  {p.options.length > 3 && (
                    <div className="text-xs text-slate-400 text-center py-1">
                      +{p.options.length - 3} 种更多方案
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>4G/5G 高速</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-orange-500 group-hover:gap-2 transition-all">
                  查看详情 <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-navy-900 mb-2">未找到匹配结果</h3>
            <p className="text-slate-500 text-sm">请尝试其他搜索词或切换地区筛选</p>
          </div>
        )}
      </section>
    </div>
  )
}
