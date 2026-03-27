const express = require('express');
const path = require('path');
const compression = require('compression');

// 加载环境变量
require('dotenv').config();

const app = express();
const ROOT_DIR = '/opt/esim-shop';

// 启用Gzip压缩
app.use(compression({ level: 6, threshold: 1024 }));

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

// API 路由 - 在静态文件之前显式挂载
const fs = require('fs');
const apiDir = path.join(ROOT_DIR, 'api');

if (fs.existsSync(apiDir)) {
  fs.readdirSync(apiDir).forEach(file => {
    if (file.endsWith('.js') && !file.startsWith('_')) {
      const routeName = file.replace('.js', '');
      try {
        const handler = require(path.join(apiDir, file));
        // 挂载到 /api/{routeName}/*
        app.all(`/api/${routeName}/*`, (req, res) => {
          req.url = req.originalUrl;
          handler(req, res);
        });
        // 挂载到 /api/{routeName}
        app.all(`/api/${routeName}`, (req, res) => {
          req.url = req.originalUrl;
          handler(req, res);
        });
        console.log(`Loaded API: /api/${routeName}`);
      } catch (e) {
        console.error(`Failed to load ${file}:`, e.message);
      }
    }
  });
}

// 静态文件服务
app.use(express.static(ROOT_DIR, {
  index: ['index.html'],
  dotfiles: 'ignore'
}));

// SPA 路由回退
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
