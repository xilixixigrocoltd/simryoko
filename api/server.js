#!/usr/bin/env node
/**
 * SimKaze eSIM API Server
 * Endpoints:
 *   GET /api/products     - List products (filter, search, paginate)
 *   GET /api/products/:id - Single product detail
 *   GET /api/inventory/:id - Stock/inventory for a product
 *   GET /api/health       - Health check
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Security: Restrict CORS to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://simkaze.com',
      'https://www.simkaze.com',
      'https://api.simkaze.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: Origin not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Load cleaned products
const dataPath = path.join(__dirname, '..', 'data', 'products-cleaned.json');
const { products, metadata, stats } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Index by ID for O(1) lookup
const productsById = new Map();
products.forEach(p => productsById.set(p.id, p));

// ─── Health ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', products: products.length, uptime: process.uptime() });
});

// ─── GET /api/products ───
app.get('/api/products', (req, res) => {
  let result = [...products];
  const { country, type, search, minData, maxData, minDays, maxDays, minPrice, maxPrice, sort, order, page, limit: lim, isHot, isRecommend } = req.query;

  // Filters
  if (country) {
    const cc = country.toUpperCase();
    result = result.filter(p => p.countries.some(c => c.code === cc));
  }
  if (type) result = result.filter(p => p.type === type);
  if (isHot !== undefined) result = result.filter(p => p.isHot === (isHot === 'true'));
  if (isRecommend !== undefined) result = result.filter(p => p.isRecommend === (isRecommend === 'true'));
  if (minData) result = result.filter(p => p.dataSize >= parseInt(minData));
  if (maxData) result = result.filter(p => p.dataSize <= parseInt(maxData));
  if (minDays) result = result.filter(p => p.validDays >= parseInt(minDays));
  if (maxDays) result = result.filter(p => p.validDays <= parseInt(maxDays));
  if (minPrice) result = result.filter(p => parseFloat(p.price) >= parseFloat(minPrice));
  if (maxPrice) result = result.filter(p => parseFloat(p.price) <= parseFloat(maxPrice));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.countries.some(c => c.cn.includes(q) || c.en.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sort) {
    const dir = order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const av = sort === 'price' ? parseFloat(a[sort]) : a[sort];
      const bv = sort === 'price' ? parseFloat(b[sort]) : b[sort];
      return av > bv ? dir : av < bv ? -dir : 0;
    });
  }

  // Pagination
  const total = result.length;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(lim) || 20));
  const totalPages = Math.ceil(total / pageSize);
  const start = (pageNum - 1) * pageSize;
  result = result.slice(start, start + pageSize);

  res.json({
    data: result,
    pagination: { page: pageNum, limit: pageSize, total, totalPages }
  });
});

// ─── GET /api/products/:id ───
app.get('/api/products/:id', (req, res) => {
  const product = productsById.get(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ data: product });
});

// ─── GET /api/inventory/:id ───
app.get('/api/inventory/:id', (req, res) => {
  const product = productsById.get(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({
    data: {
      id: product.id,
      name: product.name,
      stock: product.stock,
      soldCount: product.soldCount,
      status: product.status,
      available: product.stock > 0 && product.status === 'active'
    }
  });
});

// ─── Start ───
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SimKaze API running on port ${PORT}`);
  console.log(`Products loaded: ${products.length}`);
});

module.exports = app;
