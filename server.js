const express = require('express');
const path = require('path');
const compression = require('compression');

// 绝对路径
const ROOT_DIR = '/data/data/com.termux/files/home/.openclaw/workspace/esim-shop';

// 环境变量
process.env.API_BASE      = 'https://ciuh32wky.xigrocoltd.com/api';
process.env.AGENT_USERNAME= 'lx001';
process.env.AGENT_PASSWORD= '123123';
process.env.USDT_WALLET   = 'TBuhpRpFPV1HkdfaPEdxsKgTE43jV911rL';
process.env.SMTP_HOST     = 'smtp.exmail.qq.com';
process.env.SMTP_PORT     = '465';
process.env.SMTP_USER     = 'xilixi@xigrocoltd.com';
process.env.SMTP_PASS     = 'x8F7Jr4gn8i9Y95m';
process.env.FROM_EMAIL    = 'xilixi@xigrocoltd.com';
process.env.FROM_NAME     = 'SimRyoko';

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
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 SimRyoko running → http://localhost:${PORT}`);
  console.log(`   Shop:      http://localhost:${PORT}/shop.html`);
  console.log(`   API test:  http://localhost:${PORT}/api/products?country=JP`);
  console.log(`   监控面板:  http://localhost:${PORT}/monitoring/dashboard.html`);
  console.log(`   监控API:   http://localhost:${PORT}/api/monitoring/dashboard/overview\n`);
});