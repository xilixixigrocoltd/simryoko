/**
 * SimKaze i18n — 多语言切换系统
 * 支持: en (English) | zh (中文)
 */

const TRANSLATIONS = {
  en: {
    // Nav
    'nav.shop': 'Shop eSIMs',
    'nav.business': 'For Business',
    'nav.how': 'How It Works',
    'nav.wholesale': 'Wholesale →',
    'nav.getesim': 'Get eSIM',
    'nav.shop.m': '🛒 Shop eSIMs',
    'nav.business.m': '🤝 For Business',
    'nav.how.m': '📖 How It Works',
    'nav.faq.m': '❓ FAQ',
    'nav.getesim.m': 'Get eSIM →',

    // Hero
    'hero.pill': '✈️  Trusted by travelers in 200+ countries',
    'hero.h1': 'Travel SIM-free.<br/><span class="hero-accent">Stay connected.</span>',
    'hero.desc': 'Instant eSIM for every destination. Buy, scan, go.<br/>No queues. No physical SIM card. From <strong>$2</strong>.',
    'hero.search.placeholder': 'Search destination… e.g. Japan, Europe',
    'hero.search.btn': 'Search',
    'hero.popular': 'Popular:',
    'hero.stats.countries': 'Countries',
    'hero.stats.plans': 'eSIM Plans',
    'hero.stats.delivery': 'Instant Delivery',
    'hero.stats.support': '24/7 Support',

    // Destinations
    'dest.title': 'Popular Destinations',
    'dest.subtitle': 'Instant eSIM for the world\'s most-visited countries',
    'dest.viewall': 'View All Plans',
    'dest.from': 'From',
    'dest.shop': 'Shop Plans →',

    // How it works
    'how.title': 'Up and Running in Minutes',
    'how.subtitle': 'No store visits. No SIM cards. Just instant connectivity.',
    'how.step1.title': 'Choose your plan',
    'how.step1.desc': 'Browse 2,600+ eSIM plans for 200+ countries. Filter by destination, data size, and duration.',
    'how.step2.title': 'Pay securely',
    'how.step2.desc': 'Pay by credit card or USDT. Your order is processed instantly — no waiting.',
    'how.step3.title': 'Receive by email',
    'how.step3.desc': 'Your eSIM QR code lands in your inbox within minutes. Check spam if needed.',
    'how.step4.title': 'Scan & travel',
    'how.step4.desc': 'Go to Settings → Mobile → Add eSIM. Scan the QR code. Enable when you land.',

    // Features
    'feat.compat.title': 'Works on Your Phone',
    'feat.compat.desc': 'Compatible with iPhone XS and newer, Samsung Galaxy S20+, Google Pixel 3+, and thousands more eSIM-enabled devices.',
    'feat.instant.title': 'Truly Instant',
    'feat.instant.desc': 'No shipping. No physical card. Your eSIM is delivered to your email within minutes of payment.',
    'feat.dual.title': 'Keep Your Number',
    'feat.dual.desc': 'Use your existing SIM for calls and texts while the eSIM handles data. Dual SIM made easy.',
    'feat.coverage.title': '200+ Countries',
    'feat.coverage.desc': 'From Japan to Europe to South America — we have eSIM coverage wherever your travels take you.',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Is my phone compatible?',
    'faq.a1': 'Most phones released after 2018 support eSIM. Look for an EID number in Settings → About → Status. iPhone XS+, Samsung Galaxy S20+, Google Pixel 3+, and many others are supported.',
    'faq.q2': 'How fast will I receive it?',
    'faq.a2': 'Instantly — your eSIM QR code is emailed within minutes of payment confirmation. Check your spam folder if it doesn\'t arrive.',
    'faq.q3': 'When does the plan start?',
    'faq.a3': 'Your data plan activates when you first connect in the destination country, not when you install the eSIM. Install early, activate on arrival.',
    'faq.q4': 'Can I use it as a hotspot?',
    'faq.a4': 'Yes! Share your eSIM data with laptops, tablets, or other phones via Wi-Fi hotspot.',
    'faq.q5': 'What payment methods are accepted?',
    'faq.a5': 'We accept major credit cards (Visa, Mastercard, Amex) via Stripe, and USDT cryptocurrency (TRC-20 and ERC-20).',
    'faq.q6': 'What if my eSIM doesn\'t work?',
    'faq.a6': 'Contact our support via Telegram @Simryokoesimbot. We\'ll resolve any issues quickly — usually within 1 hour.',

    // CTA
    'cta.title': 'Ready to travel smarter?',
    'cta.subtitle': 'Join thousands of travelers who never worry about connectivity.',
    'cta.btn': 'Browse All Plans →',

    // Footer
    'footer.tagline': 'Instant eSIM for global travelers.',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.shop': 'Shop eSIMs',
    'footer.b2b': 'Business / B2B',
    'footer.japan': 'Japan eSIM',
    'footer.korea': 'Korea eSIM',
    'footer.europe': 'Europe eSIM',
    'footer.about': 'About',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.faq': 'FAQ',
    'footer.telegram': 'Telegram Support',
    'footer.rights': 'All rights reserved.',

    // Shop page
    'shop.title': 'Browse eSIM Plans',
    'shop.subtitle': '2,600+ plans for 200+ countries. Instant delivery.',
    'shop.search': 'Search destination…',
    'shop.filter.all': 'All',
    'shop.filter.asia': 'Asia',
    'shop.filter.europe': 'Europe',
    'shop.filter.americas': 'Americas',
    'shop.filter.global': 'Global',
    'shop.buy': 'Buy Now',
    'shop.days': 'days',
    'shop.loading': 'Loading plans…',

    // Checkout
    'checkout.title': 'Complete Your Order',
    'checkout.email': 'Your Email',
    'checkout.email.placeholder': 'eSIM will be sent here',
    'checkout.pay.card': 'Pay with Card',
    'checkout.pay.usdt': 'Pay with USDT',
    'checkout.secure': '🔒 Secure checkout · Instant delivery',
    'checkout.summary': 'Order Summary',

    // B2B
    'b2b.hero.title': 'Grow Your Business with eSIM',
    'b2b.hero.subtitle': 'Wholesale eSIM rates for travel agents, tour operators, and digital resellers. Up to 85% margins.',
    'b2b.apply': 'Apply for Partnership',
    'b2b.margins': 'Example Margins',
    'b2b.benefits.title': 'Why Partner with SimKaze?',
  },

  zh: {
    // Nav
    'nav.shop': '购买 eSIM',
    'nav.business': '企业合作',
    'nav.how': '使用方法',
    'nav.wholesale': '批发合作 →',
    'nav.getesim': '立即购买',
    'nav.shop.m': '🛒 购买 eSIM',
    'nav.business.m': '🤝 企业合作',
    'nav.how.m': '📖 使用方法',
    'nav.faq.m': '❓ 常见问题',
    'nav.getesim.m': '立即购买 →',

    // Hero
    'hero.pill': '✈️  全球 200+ 个国家的旅行者信赖之选',
    'hero.h1': '无需实体 SIM 卡，<br/><span class="hero-accent">随时随地保持连接。</span>',
    'hero.desc': '即时激活，到达即用。买好、扫码、出发。<br/>无需排队，无需实体卡，最低仅需 <strong>$2</strong>。',
    'hero.search.placeholder': '搜索目的地，如：日本、欧洲',
    'hero.search.btn': '搜索',
    'hero.popular': '热门：',
    'hero.stats.countries': '覆盖国家',
    'hero.stats.plans': 'eSIM 套餐',
    'hero.stats.delivery': '即时发货',
    'hero.stats.support': '全天候客服',

    // Destinations
    'dest.title': '热门目的地',
    'dest.subtitle': '为全球最热门目的地提供即时 eSIM',
    'dest.viewall': '查看全部套餐',
    'dest.from': '低至',
    'dest.shop': '选购套餐 →',

    // How it works
    'how.title': '几分钟内轻松上网',
    'how.subtitle': '无需去实体店，无需 SIM 卡，即买即用。',
    'how.step1.title': '选择套餐',
    'how.step1.desc': '浏览 200+ 个国家的 2600+ 款 eSIM 套餐，按目的地、流量和有效期筛选。',
    'how.step2.title': '安全付款',
    'how.step2.desc': '支持信用卡或 USDT 加密货币付款，订单即时处理，无需等待。',
    'how.step3.title': '邮件接收',
    'how.step3.desc': '付款成功后几分钟内，eSIM 二维码发送至您的邮箱，请也检查垃圾邮件文件夹。',
    'how.step4.title': '扫码出发',
    'how.step4.desc': '进入手机设置 → 移动网络 → 添加 eSIM，扫描二维码，到达目的地后开启即可。',

    // Features
    'feat.compat.title': '兼容您的手机',
    'feat.compat.desc': '支持 iPhone XS 及更新型号、三星 Galaxy S20+、Google Pixel 3+ 等数千款支持 eSIM 的设备。',
    'feat.instant.title': '真正即时到达',
    'feat.instant.desc': '无需邮寄，无需实体卡。付款成功后几分钟内，eSIM 即发送至您的邮箱。',
    'feat.dual.title': '保留原有号码',
    'feat.dual.desc': '原 SIM 卡继续用于通话和短信，eSIM 专门处理数据流量，双卡双待轻松实现。',
    'feat.coverage.title': '200+ 个国家',
    'feat.coverage.desc': '从日本到欧洲，从东南亚到美洲，无论您前往何处，我们都有对应的 eSIM 套餐。',

    // FAQ
    'faq.title': '常见问题',
    'faq.q1': '我的手机是否兼容 eSIM？',
    'faq.a1': '2018 年后发布的大多数手机都支持 eSIM。在设置→关于本机→状态中查找 EID 号码，有则表示支持。iPhone XS+、三星 Galaxy S20+、Google Pixel 3+ 等均支持。',
    'faq.q2': '多久可以收到 eSIM？',
    'faq.a2': '即时到达——付款确认后几分钟内，eSIM 二维码即发送至您的邮箱。如未收到，请检查垃圾邮件文件夹。',
    'faq.q3': '套餐什么时候开始计算？',
    'faq.a3': '套餐在您到达目的地国家首次连接时开始计算，而非安装时。您可提前安装，到达后再启用。',
    'faq.q4': '可以用作热点分享吗？',
    'faq.a4': '可以！您可以通过 Wi-Fi 热点将 eSIM 流量分享给笔记本、平板或其他手机。',
    'faq.q5': '支持哪些付款方式？',
    'faq.a5': '支持主流信用卡（Visa、Mastercard、Amex）通过 Stripe 付款，以及 USDT 加密货币（TRC-20 和 ERC-20）。',
    'faq.q6': 'eSIM 无法使用怎么办？',
    'faq.a6': '请通过 Telegram @Simryokoesimbot 联系客服，我们通常在 1 小时内解决问题。',

    // CTA
    'cta.title': '准备好更智慧地旅行了吗？',
    'cta.subtitle': '加入数千名无需担心网络连接的旅行者行列。',
    'cta.btn': '浏览全部套餐 →',

    // Footer
    'footer.tagline': '为全球旅行者提供即时 eSIM。',
    'footer.product': '产品',
    'footer.company': '公司',
    'footer.support': '客服支持',
    'footer.shop': '购买 eSIM',
    'footer.b2b': '企业合作 / B2B',
    'footer.japan': '日本 eSIM',
    'footer.korea': '韩国 eSIM',
    'footer.europe': '欧洲 eSIM',
    'footer.about': '关于我们',
    'footer.terms': '服务条款',
    'footer.privacy': '隐私政策',
    'footer.contact': '联系我们',
    'footer.faq': '常见问题',
    'footer.telegram': 'Telegram 客服',
    'footer.rights': '保留所有权利。',

    // Shop page
    'shop.title': '浏览 eSIM 套餐',
    'shop.subtitle': '200+ 个国家的 2600+ 款套餐，即时发货。',
    'shop.search': '搜索目的地…',
    'shop.filter.all': '全部',
    'shop.filter.asia': '亚洲',
    'shop.filter.europe': '欧洲',
    'shop.filter.americas': '美洲',
    'shop.filter.global': '全球',
    'shop.buy': '立即购买',
    'shop.days': '天',
    'shop.loading': '加载套餐中…',

    // Checkout
    'checkout.title': '完成订单',
    'checkout.email': '您的邮箱',
    'checkout.email.placeholder': 'eSIM 将发送至此邮箱',
    'checkout.pay.card': '信用卡付款',
    'checkout.pay.usdt': 'USDT 付款',
    'checkout.secure': '🔒 安全结账 · 即时发货',
    'checkout.summary': '订单摘要',

    // B2B
    'b2b.hero.title': '与我们合作，拓展您的 eSIM 业务',
    'b2b.hero.subtitle': '为旅行社、旅游运营商和数字产品分销商提供批发 eSIM 价格，利润空间最高达 85%。',
    'b2b.apply': '申请合作',
    'b2b.margins': '利润参考',
    'b2b.benefits.title': '为什么选择 SimKaze？',
  }
};

// ─── 核心函数 ───────────────────────────────────────

function getLang() {
  return localStorage.getItem('simkaze_lang') || 
    (navigator.language.startsWith('zh') ? 'zh' : 'en');
}

function setLang(lang) {
  localStorage.setItem('simkaze_lang', lang);
  applyLang(lang);
  updateToggle(lang);
}

function t(key) {
  const lang = getLang();
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
}

function applyLang(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  // 更新所有带 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = dict[key];
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 更新 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  // 更新 html lang 属性
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // 触发自定义事件，让页面脚本响应语言变化
  document.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));
}

function updateToggle(lang) {
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.textContent = lang === 'zh' ? 'EN' : '中文';
    btn.title = lang === 'zh' ? 'Switch to English' : '切换到中文';
  }
}

// ─── 语言切换按钮 HTML ──────────────────────────────

function injectLangToggle() {
  // 在 nav-actions 或 nav 区域注入按钮
  const style = `
    <style>
    #langToggle {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.35);
      color: inherit;
      padding: 5px 13px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.03em;
      transition: background 0.2s, border-color 0.2s;
      margin-right: 6px;
    }
    .nav #langToggle {
      border-color: rgba(102,126,234,0.4);
      color: #667eea;
    }
    #langToggle:hover {
      background: rgba(102,126,234,0.1);
      border-color: #667eea;
    }
    </style>
  `;
  if (!document.getElementById('i18n-style')) {
    const s = document.createElement('div');
    s.id = 'i18n-style';
    s.innerHTML = style;
    document.head.appendChild(s);
  }

  const btn = document.createElement('button');
  btn.id = 'langToggle';
  const lang = getLang();
  btn.textContent = lang === 'zh' ? 'EN' : '中文';
  btn.title = lang === 'zh' ? 'Switch to English' : '切换到中文';
  btn.onclick = () => {
    const current = getLang();
    setLang(current === 'zh' ? 'en' : 'zh');
  };

  // 插入到 nav-actions
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.insertBefore(btn, navActions.firstChild);
  } else {
    const nav = document.querySelector('nav, .nav');
    if (nav) nav.appendChild(btn);
  }
}

// ─── 初始化 ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  injectLangToggle();
  applyLang(getLang());
});
