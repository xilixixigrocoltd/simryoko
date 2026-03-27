/**
 * SimRyoko — Google Analytics 4 集成
 * 使用方法：在 Vercel 环境变量中设置 GA4_ID，或直接替换下面的 MEASUREMENT_ID
 *
 * 关键转化事件：
 *   view_country    → 用户打开国家套餐列表
 *   select_plan     → 用户选择套餐
 *   begin_checkout  → 用户开始结账（点击"支付"）
 *   purchase        → 支付成功（success.html）
 *   b2b_apply       → B2B 申请提交
 */

// GA4 Measurement ID（在 Vercel 环境变量 GA4_ID 中设置，或直接修改这里）
const GA4_ID = window._GA4_ID || 'G-5F6FMKR7J4';

if (GA4_ID && GA4_ID !== 'G-XXXXXXXXXX') {
  // 注入 gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure'
  });
} else {
  // 占位 gtag，避免调用时报错
  window.gtag = function() {};
  console.info('[Analytics] GA4_ID not configured. Set it in analytics.js or as window._GA4_ID.');
}

// ──────────────────────────────────────────────────────────────────────────────
// 自定义事件追踪函数（在各页面 JS 中调用）
// ──────────────────────────────────────────────────────────────────────────────

/** 用户打开了某国家/地区的套餐列表 */
window.trackViewCountry = function(countryCode, countryName) {
  gtag('event', 'view_country', {
    event_category: 'Shop',
    event_label: countryCode,
    country_code: countryCode,
    country_name: countryName
  });
};

/** 用户选择了某个套餐 */
window.trackSelectPlan = function(plan) {
  gtag('event', 'select_item', {
    item_list_name: 'Plans',
    items: [{
      item_id: plan.id,
      item_name: plan.nameEn || plan.name,
      price: parseFloat(plan.price),
      item_category: 'eSIM'
    }]
  });
};

/** 用户点击"购买"，进入支付流程 */
window.trackBeginCheckout = function(plan, paymentMethod) {
  gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: parseFloat(plan.price),
    payment_type: paymentMethod,
    items: [{
      item_id: plan.id,
      item_name: plan.nameEn || plan.name,
      price: parseFloat(plan.price),
      quantity: 1,
      item_category: 'eSIM'
    }]
  });
};

/** 支付成功 */
window.trackPurchase = function(orderId, productName, price, paymentMethod) {
  gtag('event', 'purchase', {
    transaction_id: orderId,
    value: price,
    currency: 'USD',
    payment_type: paymentMethod,
    items: [{
      item_name: productName,
      price: price,
      quantity: 1,
      item_category: 'eSIM'
    }]
  });
};

/** B2B 申请提交 */
window.trackB2BApply = function(company) {
  gtag('event', 'b2b_apply', {
    event_category: 'B2B',
    event_label: company
  });
};

/** 搜索 */
window.trackSearch = function(query) {
  gtag('event', 'search', { search_term: query });
};
