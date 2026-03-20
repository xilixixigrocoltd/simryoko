import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SimRyoko - Global eSIM for Travelers',
  description: 'Stay connected anywhere in the world with affordable eSIM data plans. No physical SIM needed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

/* ─── Navigation ─── */
function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-navy-900 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-navy-900">
            Sim<span className="text-orange-500">Ryoko</span>
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors">首页</a>
          <a href="/plans" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors">套餐方案</a>
          <a href="/help" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors">帮助中心</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a href="/plans" className="btn-primary text-sm !py-2 !px-5">
            立即购买
          </a>
        </div>
      </nav>
    </header>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-navy-950 font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">
                Sim<span className="text-orange-400">Ryoko</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              全球旅行eSIM服务商，覆盖200+国家和地区，让您随时随地保持连接。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">产品</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/plans" className="hover:text-orange-400 transition-colors">全部套餐</a></li>
              <li><a href="/plans?region=asia" className="hover:text-orange-400 transition-colors">亚洲</a></li>
              <li><a href="/plans?region=europe" className="hover:text-orange-400 transition-colors">欧洲</a></li>
              <li><a href="/plans?region=americas" className="hover:text-orange-400 transition-colors">美洲</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">支持</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/help" className="hover:text-orange-400 transition-colors">帮助中心</a></li>
              <li><a href="/help#install" className="hover:text-orange-400 transition-colors">安装指南</a></li>
              <li><a href="/help#faq" className="hover:text-orange-400 transition-colors">常见问题</a></li>
              <li><a href="/help#contact" className="hover:text-orange-400 transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">关注我们</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="https://t.me/+OqDSEA3Bj9Q0YjBl" className="hover:text-orange-400 transition-colors">Telegram 频道</a></li>
              <li><a href="https://t.me/+lUV96AsCFygxNDg9" className="hover:text-orange-400 transition-colors">Telegram 群组</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2025 SimRyoko. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">隐私政策</a>
            <a href="/terms" className="hover:text-slate-300 transition-colors">服务条款</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
