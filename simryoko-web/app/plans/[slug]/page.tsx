'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Wifi, Clock, Globe, Shield, Smartphone, Zap, ChevronDown, ChevronUp, HelpCircle, Star, MapPin } from 'lucide-react'

/* ─── Mock data (replace with real API) ─── */
const planData: Record<string, any> = {
  japan: {
    country: '日本',
    flag: '🇯🇵',
    region: '亚洲',
    networks: ['NTT Docomo', 'SoftBank', 'KDDI'],
    coverageNote: '全日本覆盖，包含冲绳、北海道等离岛',
    options: [
      { id: 'jp-3d-3g', days: 3, data: '3GB', price: 18, dailyLimit: '1GB/天', speed: '4G LTE' },
      { id: 'jp-7d-unl', days: 7, data: '无限流量', price: 35, dailyLimit: '2GB高速后降速', speed: '4G/5G', popular: true },
      { id: 'jp-15d-unl', days: 15, data: '无限流量', price: 55, dailyLimit: '2GB高速后降速', speed: '4G/5G' },
      { id: 'jp-30d-unl', days: 30, data: '无限流量', price: 85, dailyLimit: '3GB高速后降速', speed: '4G/5G' },
    ],
  },
}

// Fallback for any slug
const fallback = {
  country: '目的地',
  flag: '🌍',
  region: '全球',
  networks: ['当地运营商'],
  coverageNote: '主要城市及地区覆盖',
  options: [
    { id: 'gen-7d', days: 7, data: '5GB', price: 30, dailyLimit: '-', speed: '4G LTE' },
    { id: 'gen-15d', days: 15, data: '10GB', price: 50, dailyLimit: '-', speed: '4G LTE', popular: true },
    { id: 'gen-30d', days: 30, data: '20GB', price: 88, dailyLimit: '-', speed: '4G/5G' },
  ],
}

const faqs = [
  { q: '什么是eSIM？', a: 'eSIM是内置在设备中的虚拟SIM卡，无需插入物理卡片。通过扫描QR码即可激活使用，支持iPhone XS及以上机型、大部分新款Android手机。' },
  { q: '如何激活eSIM？', a: '购买后您将收到一个QR码。进入手机设置 > 蜂窝网络 > 添加eSIM，扫描QR码即可完成激活。建议在出发前完成安装，到达目的地后开启数据漫游即可使用。' },
  { q: '可以使用多久？', a: '有效期从您首次连接网络时开始计算，而非购买时间。请在到达目的地后再激活数据。' },
  { q: '支持哪些设备？', a: '支持所有带eSIM功能的设备，包括 iPhone XS/XR 及更新机型、Google Pixel 3 及更新、Samsung Galaxy S20 及更新等。购买前请确认您的设备支持eSIM。' },
  { q: '可以打电话和发短信吗？', a: '本产品为纯数据eSIM，不支持传统通话和短信。但您可以使用微信、WhatsApp等应用进行网络通话和消息收发。' },
]

export default function PlanDetailPage({ params }: { params: { slug: string } }) {
  const plan = planData[params.slug] || { ...fallback, country: decodeURIComponent(params.slug) }
  const [selected, setSelected] = useState(
    plan.options.findIndex((o: any) => o.popular) !== -1
      ? plan.options.findIndex((o: any) => o.popular)
      : 0
  )
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const current = plan.options[selected]

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 to-navy-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <a href="/plans" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> 返回全部套餐
          </a>

          <div className="flex items-center gap-5">
            <div className="text-6xl md:text-7xl">{plan.flag}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {plan.country} eSIM
              </h1>
              <div className="flex items-center gap-3 mt-2 text-slate-400 text-sm">
                <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {plan.region}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Wifi className="w-4 h-4" /> {plan.networks.join(' / ')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Plan options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plan selector */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">选择套餐方案</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {plan.options.map((opt: any, i: number) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(i)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
                      selected === i
                        ? 'border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {opt.popular && (
                      <div className="absolute -top-2.5 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                        最受欢迎
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-navy-900">{opt.days}天</div>
                        <div className="text-sm text-slate-500">{opt.data}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-navy-900">¥{opt.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> {opt.speed}</span>
                      {opt.dailyLimit !== '-' && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {opt.dailyLimit}</span>
                      )}
                    </div>

                    {/* Check indicator */}
                    {selected === i && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">套餐详情</h2>
              <div className="card p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <DetailItem icon={Globe} label="覆盖范围" value={plan.coverageNote} />
                  <DetailItem icon={Wifi} label="网络类型" value={current.speed} />
                  <DetailItem icon={Clock} label="有效期" value={`${current.days}天（首次连接后计算）`} />
                  <DetailItem icon={Shield} label="网络运营商" value={plan.networks.join('、')} />
                  <DetailItem icon={Smartphone} label="设备要求" value="支持eSIM的手机/平板" />
                  <DetailItem icon={Zap} label="激活方式" value="扫描QR码，即刻激活" />
                </div>
              </div>
            </div>

            {/* Included */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">套餐包含</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  '高速移动数据',
                  '无需实体SIM卡',
                  '即买即用QR码',
                  '24小时客服支持',
                  '不限制热点分享',
                  '无合约无押金',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 py-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">常见问题</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="card overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-semibold text-navy-900 text-sm pr-4">{faq.q}</span>
                      {expandedFaq === i
                        ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      }
                    </button>
                    {expandedFaq === i && (
                      <div className="px-5 pb-5 pt-0 text-sm text-slate-500 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-6 border-2 border-navy-100">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{plan.flag}</div>
                  <h3 className="text-lg font-bold text-navy-900">{plan.country} eSIM</h3>
                  <p className="text-sm text-slate-500 mt-1">{current.days}天 · {current.data}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-slate-400">¥</span>
                    <span className="text-4xl font-extrabold text-navy-900">{current.price}</span>
                  </div>
                  <div className="text-center text-xs text-slate-400 mt-1">
                    约 ¥{(current.price / current.days).toFixed(1)}/天
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3 mb-6">
                  <SummaryRow label="数据流量" value={current.data} />
                  <SummaryRow label="有效期" value={`${current.days}天`} />
                  <SummaryRow label="网络" value={current.speed} />
                  <SummaryRow label="覆盖" value={plan.region} />
                </div>

                <button className="btn-primary w-full text-base !py-3.5 mb-3">
                  立即购买
                </button>

                <button className="btn-outline w-full text-sm !py-3">
                  加入购物车
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>安全支付 · 即时发送</span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-sm font-semibold text-navy-900">4.9/5 用户评分</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  超过50,000名旅行者信赖SimRyoko。购买后3分钟内即可收到eSIM激活码。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-navy-600" />
      </div>
      <div>
        <div className="text-xs text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-navy-900">{value}</div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </div>
  )
}
