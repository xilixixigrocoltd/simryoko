const express = require('express');
const path = require('path');
const compression = require('compression');

// 绝对路径
const ROOT_DIR = '/data/data/com.termux/files/home/.openclaw/workspace/esim-shop';

// 加载环境变量
require('dotenv').config();

// 验证必需环境变量（Vercel环境跳过严格检查）
const isVercel = process.env.VERCEL === '1';
const requiredEnv = ['AGENT_PASSWORD', 'SMTP_PASS', 'USDT_WALLET'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Warning: ${key} environment variable is not set`);
    if (!isVercel) {
      process.exit(1);
    }
  }
}

const app = express();

// 启用Gzip压缩 (对静态文件和API响应进行压缩)
app.use(compression({
  level: 6,           // 压缩级别 1-9, 6是平衡点
  threshold: 1024,    // 只压缩大于1KB的响应
  filter: (req, res) => {
    // 不压缩已压缩的文件
    if (req.headers['x-no-compression']) return false;
    // 使用内置filter, 但对HTML/CSS/JS强制压缩
    return compression.filter(req, res);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS配置
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://simkaze.com'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // 安全响应头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// 监控 API 路由
const dashboardRouter = require('./monitoring/dashboard');
app.use('/api/monitoring', dashboardRouter);
console.log('[Debug] Dashboard router loaded, type:', typeof dashboardRouter, 'has stack:', !!dashboardRouter.stack);

// 初始化监控系统
const monitoring = require('./monitoring');
monitoring.alertEngine.initialize();

// 其他 API
app.use('/api/v2/products', require('./api/products-v2'));
app.use('/api/inventory', require('./api/inventory'));
app.use('/api/products', require('./api/products'));
app.use('/api/checkout', require('./api/checkout'));
app.use('/api/payment', require('./api/checkout'));
app.use('/api/order-status', require('./api/order-status'));
app.use('/api/stripe', require('./api/stripe'));
app.use('/api/stripe-webhook', require('./api/stripe-webhook'));
app.use('/api/ton', require('./api/ton'));
app.use('/api/cryptopay-webhook', require('./api/cryptopay-webhook'));

// 静态文件 - 启用缓存 (从根目录服务)
const staticOptions = {
  maxAge: '1y',           // 静态资源缓存1年
  etag: true,
  lastModified: true
};

// 尝试从根目录提供静态文件
const rootStatic = express.static(ROOT_DIR, staticOptions);
app.use(rootStatic);

// 监控目录单独配置
app.use('/monitoring', express.static(path.join(ROOT_DIR, 'monitoring'), {
  maxAge: '1h',
  etag: true
}));

// 404 fallback
app.use((req, res) => res.sendFile(path.join(ROOT_DIR, 'index.html')));

// Vercel Serverless 适配
if (process.env.VERCEL) {
  // Vercel 环境：导出 handler
  module.exports = app;
} else {
  // 本地环境：监听端口
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 SimKaze running → http://localhost:${PORT}`);
    console.log(`   Shop:      http://localhost:${PORT}/shop.html`);
    console.log(`   API test:  http://localhost:${PORT}/api/products?country=JP`);
    console.log(`   监控面板:  http://localhost:${PORT}/monitoring/dashboard.html`);
    console.log(`   监控API:   http://localhost:${PORT}/api/monitoring/dashboard/overview\n`);
  });
}