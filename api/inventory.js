/**
 * Inventory API - GET /api/inventory/:id
 * 返回单个产品的库存及定价详情
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { setCors, applyRateLimit } = require('./_ratelimit');

const DATA_DIR = path.join(__dirname, '..', 'data');

function loadProducts() {
  const cleaned = path.join(DATA_DIR, 'products-cleaned.json');
  const full = path.join(DATA_DIR, 'products-full.json');
  const file = fs.existsSync(cleaned) ? cleaned : full;
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return raw.products || raw;
}

let cache = null;
let cacheTime = 0;
function getProducts() {
  const now = Date.now();
  if (cache && now - cacheTime < 5 * 60 * 1000) return cache;
  cache = loadProducts();
  cacheTime = now;
  return cache;
}

router.use((req, res, next) => {
  setCors(req, res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!applyRateLimit(req, res, 60, 60000)) return;
  next();
});

// GET /api/inventory/:id
router.get('/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
  const products = getProducts();
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300');
  res.json({
    success: true,
    data: {
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      stock: product.stock || 0,
      soldCount: product.soldCount || 0,
      price: parseFloat(product.price),
      costPrice: product.costPrice ? parseFloat(product.costPrice) : null,
      status: product.status || 'active',
      type: product.type,
      dataSize: product.dataSize || null,
      validDays: product.validDays || null,
      lastSynced: product.lastSynced || null,
    }
  });
});

// GET /api/inventory - 批量库存概览
router.get('/', (req, res) => {
  const products = getProducts();
  const lowStock = parseInt(req.query.lowStock) || 10;

  const summary = {
    total: products.length,
    inStock: products.filter(p => (p.stock || 0) > 0).length,
    outOfStock: products.filter(p => (p.stock || 0) === 0).length,
    lowStock: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= lowStock).length,
  };

  res.json({ success: true, data: summary });
});

module.exports = router;
