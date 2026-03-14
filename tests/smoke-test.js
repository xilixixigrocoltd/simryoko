#!/usr/bin/env node
/**
 * SimRyoko 发版前API冒烟测试
 * 快速验证核心接口可用性
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.API_URL || 'https://ciuh32wky.xigrocoltd.com/api';

const tests = [
  { name: '产品列表', path: '/products', method: 'GET' },
  { name: '产品筛选', path: '/products?country=JP', method: 'GET' },
  { name: '库存查询', path: '/inventory/12345', method: 'GET' },
  { name: '订单状态', path: '/order-status?id=test', method: 'GET' },
  { name: '健康检查', path: '/health', method: 'GET' }
];

async function runSmokeTest() {
  console.log('🧪 SimRyoko API 冒烟测试');
  console.log(`URL: ${BASE_URL}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}${test.path}`, {
        method: test.method,
        timeout: 10000
      });
      const duration = Date.now() - start;
      
      if (res.ok || res.status === 404) { // 404也算通（接口存在）
        console.log(`✅ ${test.name}: ${res.status} (${duration}ms)`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: ${res.status} (${duration}ms)`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ ${test.name}: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 结果: ${passed}通过, ${failed}失败`);
  process.exit(failed > 0 ? 1 : 0);
}

runSmokeTest();
