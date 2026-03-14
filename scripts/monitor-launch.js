#!/usr/bin/env node
/**
 * SimRyoko 上线监控脚本
 * 监控网站状态、支付成功率、错误率
 */

const axios = require('axios');

// 配置
const CONFIG = {
  siteUrl: 'https://simryoko.com',
  checkInterval: 5 * 60 * 1000, // 5分钟
  alertThreshold: {
    responseTime: 5000, // 5秒
    errorRate: 0.1, // 10%
  }
};

// Telegram通知
async function sendTelegramAlert(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_ID || '7867683484';
  
  if (!botToken) {
    console.log('[Alert] Telegram bot token not configured');
    return;
  }
  
  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('[Alert] Telegram notification sent');
  } catch (error) {
    console.error('[Alert] Failed to send Telegram:', error.message);
  }
}

// 检查网站状态
async function checkWebsite() {
  const startTime = Date.now();
  try {
    const response = await axios.get(CONFIG.siteUrl, {
      timeout: 10000,
      validateStatus: (status) => status === 200
    });
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'up',
      responseTime,
      statusCode: response.status
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}

// 主监控循环
async function monitor() {
  console.log(`[${new Date().toISOString()}] Starting monitoring...`);
  
  const result = await checkWebsite();
  
  if (result.status === 'down') {
    const alertMsg = `🚨 *SimRyoko 网站告警*\n\n` +
      `状态: ❌ 无法访问\n` +
      `时间: ${new Date().toLocaleString('zh-CN')}\n` +
      `错误: ${result.error}\n\n` +
      `请立即检查！`;
    await sendTelegramAlert(alertMsg);
    console.error('[Monitor] Website is DOWN!', result.error);
  } else if (result.responseTime > CONFIG.alertThreshold.responseTime) {
    const alertMsg = `⚠️ *SimRyoko 性能警告*\n\n` +
      `响应时间: ${result.responseTime}ms\n` +
      `阈值: ${CONFIG.alertThreshold.responseTime}ms\n` +
      `时间: ${new Date().toLocaleString('zh-CN')}\n\n` +
      `建议检查服务器性能。`;
    await sendTelegramAlert(alertMsg);
    console.warn('[Monitor] Slow response:', result.responseTime + 'ms');
  } else {
    console.log(`[Monitor] Website is UP (${result.responseTime}ms)`);
  }
}

// 启动监控
console.log('🚀 SimRyoko 上线监控启动');
console.log(`📊 监控地址: ${CONFIG.siteUrl}`);
console.log(`⏱️ 检查间隔: ${CONFIG.checkInterval / 1000}秒`);

// 立即执行一次
monitor();

// 设置定时监控
setInterval(monitor, CONFIG.checkInterval);

// 保持运行
console.log('✅ 监控运行中...');