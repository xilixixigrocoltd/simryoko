/**
 * SimKaze Cookie Consent Banner
 * GDPR合规 - 用户同意后才加载GA4
 */

(function() {
  'use strict';
  
  const COOKIE_KEY = 'simkaze_cookie_consent';
  const GA_ID = 'G-5F6FMKR7J4';
  
  // 检查是否已同意
  function hasConsent() {
    return localStorage.getItem(COOKIE_KEY) === 'granted';
  }
  
  // 加载GA4
  function loadGA() {
    if (window.gtag) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  
  // 显示横幅
  function showBanner() {
    if (hasConsent() || document.getElementById('cookie-banner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1a1a2e;
        color: #fff;
        padding: 16px 20px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      ">
        <span>
          我们使用Cookie和Google Analytics来改善您的体验。
          <a href="/privacy" style="color: #FF6B35; text-decoration: none;">隐私政策</a>
        </span>
        <div style="display: flex; gap: 12px;">
          <button id="cookie-decline" style="
            padding: 8px 16px;
            border: 1px solid #666;
            background: transparent;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
          ">拒绝</button>
          <button id="cookie-accept" style="
            padding: 8px 16px;
            border: none;
            background: #FF6B35;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          ">同意</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // 同意
    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'granted');
      banner.remove();
      loadGA();
    });
    
    // 拒绝
    document.getElementById('cookie-decline').addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'denied');
      banner.remove();
    });
  }
  
  // 初始化
  if (hasConsent()) {
    loadGA();
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
