/**
 * SimKaze Chat Widget - Vanilla JS Version
 * For static HTML sites
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiEndpoint: '/api/chat',
    telegramLink: 'https://t.me/Simryokoesimbot',
    position: 'bottom-right',
    primaryColor: '#FF6B35',
    botName: 'SimKaze客服',
    botAvatar: '🤖'
  };

  // FAQ Knowledge for client-side fallback
  const FAQ_RESPONSES = {
    '什么是eSIM': 'eSIM是嵌入式SIM卡，无需实体卡即可使用。购买后通过二维码激活，支持iPhone和Android。',
    '怎么激活': '购买后收到二维码 → 手机设置 → 蜂窝网络 → 添加eSIM → 扫描二维码 → 完成激活。',
    '支持哪些国家': '覆盖200+国家，包括日本、韩国、泰国、欧洲、美国、澳大利亚等热门目的地。',
    '价格': '日本1GB/7天 $4起，欧洲5GB/30天 $15起，全球套餐 $20起。比漫游便宜80%。',
    '多少钱': '日本1GB/7天 $4起，欧洲5GB/30天 $15起，全球套餐 $20起。比漫游便宜80%。',
    '怎么用': '购买后收到二维码 → 手机设置 → 蜂窝网络 → 添加eSIM → 扫描二维码 → 完成激活。',
    '查询用量': '购买后登录账户查看，或联系客服查询。',
    '退款': '未激活24小时内可退款，已激活不支持退款。如需退款请联系人工客服。',
    '支付': '支持信用卡(Stripe)、USDT、TON支付。',
    '客服': 'Telegram: @Simryokoesimbot\n邮箱: support@simkaze.com',
    '联系': 'Telegram: @Simryokoesimbot\n邮箱: support@simkaze.com',
    '有效期': '从激活日开始计算，套餐标注天数内有效。',
    '区别': '与Airalo同样的网络，更好的中文服务。价格更优，支持USDT支付。'
  };

  // State
  let isOpen = false;
  let messages = [
    { type: 'bot', text: '您好！我是SimKaze智能客服 🤖\n\n我可以帮您：\n• 查询产品/价格\n• 解答eSIM使用问题\n• 转接人工客服\n\n请问有什么可以帮您？' }
  ];

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'simkaze-chat-widget';
    widget.innerHTML = `
      <style>
        #simkaze-chat-widget {
          --primary: ${CONFIG.primaryColor};
          --primary-dark: #e55a2b;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .sr-chat-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .sr-chat-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        .sr-chat-button svg {
          width: 28px;
          height: 28px;
          color: white;
        }
        
        .sr-chat-window {
          position: fixed;
          bottom: 88px;
          right: 24px;
          width: 360px;
          height: 480px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          z-index: 9999;
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        
        .sr-chat-window.open {
          display: flex;
        }
        
        .sr-chat-header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .sr-chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .sr-chat-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .sr-chat-header h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        
        .sr-chat-header p {
          font-size: 12px;
          opacity: 0.8;
          margin: 0;
        }
        
        .sr-chat-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
        }
        
        .sr-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        }
        
        .sr-chat-message {
          margin-bottom: 12px;
          display: flex;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .sr-chat-message.user {
          justify-content: flex-end;
        }
        
        .sr-chat-message.bot {
          justify-content: flex-start;
        }
        
        .sr-chat-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-line;
        }
        
        .sr-chat-message.user .sr-chat-bubble {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .sr-chat-message.bot .sr-chat-bubble {
          background: white;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        
        .sr-chat-telegram-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 8px 12px;
          background: #0088cc;
          color: white;
          text-decoration: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .sr-chat-input-area {
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }
        
        .sr-chat-input-wrapper {
          display: flex;
          gap: 8px;
        }
        
        .sr-chat-input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .sr-chat-input:focus {
          border-color: var(--primary);
        }
        
        .sr-chat-send {
          width: 40px;
          height: 40px;
          background: var(--primary);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .sr-chat-send:hover {
          background: var(--primary-dark);
        }
        
        .sr-chat-send:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        .sr-chat-send svg {
          width: 18px;
          height: 18px;
          color: white;
        }
        
        .sr-chat-footer {
          text-align: center;
          padding-top: 8px;
          font-size: 11px;
          color: #9ca3af;
        }
        
        .sr-chat-loading {
          display: flex;
          justify-content: flex-start;
        }
        
        .sr-chat-loading-dots {
          background: white;
          padding: 12px 16px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
        }
        
        .sr-chat-loading-dots span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.4s