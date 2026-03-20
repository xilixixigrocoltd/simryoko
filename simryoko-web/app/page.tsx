'use client'

import { Globe, Zap, Shield, Smartphone, ChevronRight, Star, MapPin, Wifi, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PopularPlans />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}

/* ═══════════════════════════════════════════
   Hero Section
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-navy-400/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-orange-300 text-sm font-medium mb-8">
              <Wifi className="w-4 h-4" />
              覆盖 200+ 国家和地区
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              旅行上网
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                从此简单
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-lg">
              无需实体SIM卡，扫码即用。享受全球高速网络，资费透明，即买即连。
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/plans" className="btn-primary text-base !py-3.5 !px-8 !rounded-2xl">
                浏览套餐
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a href="/help#how" className="btn-outline !border-white/20 !text-white hover:!bg-white/10 hover:!border-white/40 text-base !py-3.5 !px-8 !rounded-2xl">
                了解更多
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-xs text-slate-400 mt-0.5">活跃用户</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-xs text-slate-400 mt-0.5">覆盖国家</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                  用户评分
                </div>
              </div>
            </div>
          </div>

          {/* Right: Floating cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {/* Main phone mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[560px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[3rem] border-2 border-slate-700 shadow-2xl p-3">
                <div className="w-full h-full bg-gradient-to-b from-navy-800 to-navy-950 rounded-[2.4rem] flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white font-bold text-lg mb-1">日本 eSIM</div>
                  <div className="text-slate-400 text-sm mb-6">7天 · 无限流量</div>
                  <div className="text-3xl font-extrabold text-orange-400 mb-6">¥35</div>
                  <div className="w-full bg-orange-500 text-white text-center py-3 rounded-xl font-semibold text-sm">
                    立即激活
                  </div>
                </div>
              </div>

              {/* Floating card 1 */}
              <div className="absolute top-8 -left-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">安全加密</div>
                    <div className="text-slate-400 text-xs">数据全程保护</div>
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute bottom-16 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">即买即用</div>
                    <div className="text-slate-400 text-xs">3分钟完成激活</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Features
   ═══════════════════════════════════════════ */
function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: '全球覆盖',
      desc: '200+国家和地区无缝连接，一张eSIM走遍全球',
      color: 'bg-navy-100 text-navy-700',
    },
    {
      icon: Zap,
      title: '即买即用',
      desc: '购买后扫描QR码即可激活，无需等待物流配送',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Shield,
      title: '安全可靠',
      desc: '运营商级网络质量，数据加密传输，隐私无忧',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: Smartphone,
      title: '多设备支持',
      desc: '支持iPhone、Android及平板等多种eSIM兼容设备',
      color: 'bg-purple-100 text-purple-700',
    },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">为什么选择 SimRyoko</h2>
          <p className="section-subtitle mx-auto">简单、快速、可靠的全球eSIM服务</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-8 text-center group hover:-translate-y-1">
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Popular Plans Preview
   ═══════════════════════════════════════════ */
function PopularPlans() {
  const plans = [
    { country: '日本', flag: '🇯🇵', days: 7, data: '无限流量', price: 35, popular: true },
    { country: '韩国', flag: '🇰🇷', days: 5, data: '10GB', price: 28, popular: false },
    { country: '泰国', flag: '🇹🇭', days: 7, data: '无限流量', price: 30, popular: false },
    { country: '美国', flag: '🇺🇸', days: 15, data: '20GB', price: 68, popular: false },
    { country: '欧洲多国', flag: '🇪🇺', days: 15, data: '10GB', price: 58, popular: false },
    { country: '新加坡', flag: '🇸🇬', days: 7, data: '8GB', price: 25, popular: false },
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title mb-3">热门目的地</h2>
            <p className="section-subtitle">旅行者最爱的eSIM套餐方案</p>
          </div>
          <a href="/plans" className="inline-flex items-center gap-1.5 text-orange-500 font-semibold hover:text-orange-600 transition-colors">
            查看全部 <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <a key={p.country} href={`/plans/${p.country}`} className="card p-6 group relative overflow-hidden">
              {p.popular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  热门
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="text-4xl">{p.flag}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy-900 mb-1 group-hover:text-orange-500 transition-colors">
                    {p.country}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{p.days}天</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{p.data}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-navy-900">
                    ¥{p.price}
                  </div>
                  <div className="text-xs text-slate-400">起</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>4G/5G高速网络</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   How It Works
   ═══════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { num: '01', title: '选择套餐', desc: '根据目的地和需求挑选合适的eSIM方案' },
    { num: '02', title: '在线支付', desc: '支持微信、支付宝等多种支付方式' },
    { num: '03', title: '扫码激活', desc: '收到QR码后，在设备设置中扫描添加eSIM' },
    { num: '04', title: '开始上网', desc: '到达目的地后自动连接当地网络，即刻在线' },
  ]

  return (
    <section className="py-24 bg-navy-950 text-white overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">四步开始使用</h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">简单四步，开启全球无忧上网体验</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative text-center group">
              {/* Connector line */}
              {i < 3 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                {s.num}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Testimonials
   ═══════════════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    { name: '张小明', location: '去日本旅行', text: '在成田机场落地就有网络了，整个旅程都很顺畅，再也不用找WiFi了！', rating: 5 },
    { name: '李晓华', location: '欧洲自驾游', text: '一张eSIM跑了5个国家，Google Maps全程导航无压力，性价比超高。', rating: 5 },
    { name: '王佳', location: '泰国度假', text: '比租WiFi蛋方便太多了，手机直接用，速度也很快，强烈推荐！', rating: 5 },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">用户怎么说</h2>
          <p className="section-subtitle mx-auto">来自真实旅行者的真实评价</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                  <span className="text-navy-700 font-bold text-sm">{t.name[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-navy-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-navy-400/20 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">准备好出发了吗？</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto">
              选择您的目的地，3分钟完成eSIM激活，开启无忧上网之旅
            </p>
            <a href="/plans" className="btn-primary text-lg !py-4 !px-10 !rounded-2xl">
              立即选购 <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
