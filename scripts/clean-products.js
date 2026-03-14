#!/usr/bin/env node
/**
 * clean-products.js
 * Removes loss-making products (price <= agentPrice) and duplicates
 * (same country+dataSize+validDays, keeping lowest price).
 */
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'data', 'products-full.json');
const outputPath = path.join(__dirname, '..', 'data', 'products-cleaned.json');

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const products = data.products;

console.log(`Total products: ${products.length}`);

// Step 1: Remove loss products (price <= agentPrice)
const profitable = products.filter(p => parseFloat(p.price) > parseFloat(p.agentPrice));
const lossCount = products.length - profitable.length;
console.log(`Removed ${lossCount} loss-making products (price <= agentPrice)`);

// Step 2: Remove duplicates (same countries+dataSize+validDays), keep cheapest
const grouped = new Map();
for (const p of profitable) {
  const key = p.countries.map(c => c.code).sort().join(',') + ':' + p.dataSize + ':' + p.validDays;
  if (!grouped.has(key)) {
    grouped.set(key, p);
  } else {
    const existing = grouped.get(key);
    if (parseFloat(p.price) < parseFloat(existing.price)) {
      grouped.set(key, p);
    }
  }
}

const cleaned = [...grouped.values()].sort((a, b) => a.sortOrder - b.sortOrder);
const dupeCount = profitable.length - cleaned.length;
console.log(`Removed ${dupeCount} duplicate products`);
console.log(`Final product count: ${cleaned.length}`);

// Stats
const byType = {};
cleaned.forEach(p => { byType[p.type] = (byType[p.type] || 0) + 1; });

const output = {
  metadata: {
    total: cleaned.length,
    cleanedAt: new Date().toISOString(),
    removedLoss: lossCount,
    removedDuplicates: dupeCount,
    source: 'products-full.json'
  },
  stats: {
    total: cleaned.length,
    byType
  },
  products: cleaned
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Written to ${outputPath}`);
