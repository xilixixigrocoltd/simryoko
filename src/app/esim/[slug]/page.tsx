import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, Zap, Shield, Smartphone, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { allCountries, countryBySlug, type CountryData } from "@/data/countries";
import ProductList from "./ProductList";

// ─── Static generation for all countries ───
export function generateStaticParams() {
  return allCountries.map((c) => ({ slug: c.slug }));
}

// ─── Dynamic SEO metadata ───
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = countryBySlug.get(params.slug);
  if (!country) return {};
  return {
    title: `${country.zh}eSIM卡 - ${country.en} eSIM | SimRyoko`,
    description: country.metaDesc,
    openGraph: {
      title: `${country.zh}eSIM流量卡 | SimRyoko旅行eSIM`,
      description: country.metaDesc,
      type: "website",
      url: `https://simryoko.com/esim/${country.slug}`,
    },
    alternates: {
      canonical: `https://simryoko.com/esim/${country.slug}`,
    },
  };
}

// ─── Page component ───
export default function CountryPage({ params }: { params: { slug: string } }) {
  const country = countryBySlug.get(params.slug);
  if (!country) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {country.zh} eSIM卡
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-2">
            {country.en} eSIM Data Plans
          </p>
          <p className="text-base text-gray-400 max-w-3xl mt-4">
            {country.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#plans" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition">
              查看套餐 <ChevronRight className="w-4 h-4" />
            </a>
            <Link href="/#faq" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 px-6 py-3 rounded-lg font-medium transition">
              使用指南
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "即买即用", desc: "在线购买，扫码激活，落地即用" },
            { icon: Globe, title: "当地网络", desc: `接入${country.zh}当地运营商优质网络` },
            { icon: Shield, title: "安全可靠", desc: "数据加密传输，隐私有保障" },
            { icon: Smartphone, title: "无需换卡", desc: "保留原号码，eSIM独立使用" },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <f.icon className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{country.zh} eSIM套餐</h2>
        <p className="text-gray-400 mb-8">选择适合您{country.zh}旅程的数据套餐</p>
        <ProductList countryCode={country.code} />
      </section>

      {/* Tips */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{country.zh} eSIM使用贴士</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <ul className="space-y-3">
            {country.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to use */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">如何使用eSIM</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "购买套餐", desc: `选择您需要的${country.zh}数据套餐并完成支付` },
            { step: "2", title: "扫码安装", desc: "收到QR码后，在手机设置中扫码添加eSIM" },
            { step: "3", title: "激活使用", desc: `到达${country.zh}后开启数据漫游，即可上网` },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Schema (JSON-LD) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": `${country.zh}eSIM怎么用？`, "acceptedAnswer": { "@type": "Answer", "text": `购买SimRyoko ${country.zh}eSIM后，您会收到一个QR码。在手机设置中添加eSIM计划，扫描QR码即可安装。到达${country.zh}后开启数据漫游即可使用。` }},
          { "@type": "Question", "name": `去${country.zh}旅游需要买SIM卡吗？`, "acceptedAnswer": { "@type": "Answer", "text": `如果您的手机支持eSIM，无需购买实体SIM卡。SimRyoko提供${country.zh}eSIM，在线购买即可使用，省去在当地寻找SIM卡的麻烦。` }},
          { "@type": "Question", "name": `${country.zh}eSIM多少钱？`, "acceptedAnswer": { "@type": "Answer", "text": `SimRyoko ${country.zh}eSIM套餐价格根据流量和天数不同而异，提供多种选择满足不同需求。请查看上方套餐详情。` }},
        ]
      })}} />
    </main>
  );
}
