const express = require('express');
const path = require('path');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next(); });

// API 路由
app.use('/api/products',       require('./api/products'));
app.use('/api/checkout',       require('./api/checkout'));
app.use('/api/payment/verify', require('./api/payment/verify'));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 404 fallback
app.use((req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 SimRyoko running → http://localhost:${PORT}`);
  console.log(`   Shop:      http://localhost:${PORT}/shop.html`);
  console.log(`   API test:  http://localhost:${PORT}/api/products?country=JP\n`);
});
