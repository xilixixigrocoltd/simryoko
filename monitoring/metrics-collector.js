/**
 * 指标收集器 - 多维度监控指标收集
 * 
 * 监控维度：
 * 1. 性能指标 - 响应时间、吞吐量
 * 2. 错误指标 - 错误率、异常类型
 * 3. 资源指标 - CPU、内存、磁盘
 * 4. 业务指标 - 订单、支付、库存
 */

const os = require('os');
const config = require('./config');

class MetricsCollector {
  constructor() {
    this.metrics = {
      performance: [],
      errors: [],
      resources: [],
      business: [],
    };
    this.counters = {
      requests: 0,
      errors: 0,
      success: 0,
      byEndpoint: {},
      byStatus: {},
      byErrorType: {},
    };
    this.lastCleanup = Date.now();
  }

  // 记录请求
  recordRequest(endpoint, statusCode, responseTime, error = null) {
    this.counters.requests++;
    
    // 按端点统计
    if (!this.counters.byEndpoint[endpoint]) {
      this.counters.byEndpoint[endpoint] = { total: 0, errors: 0, totalTime: 0 };
    }
    this.counters.byEndpoint[endpoint].total++;
    this.counters.byEndpoint[endpoint].totalTime += responseTime;
    
    // 按状态码统计
    if (!this.counters.byStatus[statusCode]) {
      this.counters.byStatus[statusCode] = 0;
    }
    this.counters.byStatus[statusCode]++;

    // 记录响应时间
    this.metrics.performance.push({
      timestamp: Date.now(),
      endpoint,
      statusCode,
      responseTime,
      error: error ? error.message : null,
    });

    // 记录错误
    if (error || statusCode >= 400) {
      this.counters.errors++;
      this.counters.byEndpoint[endpoint].errors++;
      
      const errorType = this.categorizeError(error, statusCode);
      if (!this.counters.byErrorType[errorType]) {
        this.counters.byErrorType[errorType] = 0;
      }
      this.counters.byErrorType[errorType]++;

      this.metrics.errors.push({
        timestamp: Date.now(),
        endpoint,
        statusCode,
        errorType,
        message: error ? error.message : `HTTP ${statusCode}`,
        stack: error ? error.stack : null,
      });
    } else {
      this.counters.success++;
    }
  }

  // 错误分类
  categorizeError(error, statusCode) {
    if (error) {
      if (error.name === 'ValidationError') return 'validation';
      if (error.name === 'UnauthorizedError') return 'auth';
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') return 'network';
      if (error.message.includes('timeout')) return 'timeout';
      return 'server';
    }
    if (statusCode === 404) return 'not_found';
    if (statusCode === 401 || statusCode === 403) return 'auth';
    if (statusCode === 429) return 'rate_limit';
    if (statusCode >= 500) return 'server';
    if (statusCode >= 400) return 'client';
    return 'unknown';
  }

  // 记录业务指标
  recordBusinessEvent(eventType, data = {}) {
    this.metrics.business.push({
      timestamp: Date.now(),
      eventType,
      ...data,
    });
  }

  // 收集系统资源指标
  collectResourceMetrics() {
    const cpuLoad = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    const metrics = {
      timestamp: Date.now(),
      cpu: {
        load1: cpuLoad[0],
        load5: cpuLoad[1],
        load15: cpuLoad[2],
        usagePercent: (cpuLoad[0] / os.cpus().length) * 100,
      },
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: (usedMem / totalMem) * 100,
      },
      system: {
        uptime: os.uptime(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
      },
    };

    this.metrics.resources.push(metrics);
    return metrics;
  }

  // 获取聚合指标
  getAggregatedMetrics(windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // 过滤时间窗口内的数据
    const recentPerf = this.metrics.performance.filter(m => m.timestamp > windowStart);
    const recentErrors = this.metrics.errors.filter(m => m.timestamp > windowStart);
    const recentBusiness = this.metrics.business.filter(m => m.timestamp > windowStart);

    // 计算性能指标
    const responseTimes = recentPerf.map(m => m.responseTime).sort((a, b) => a - b);
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
    const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;
    const maxResponseTime = responseTimes[responseTimes.length - 1] || 0;

    // 计算错误率
    const totalRequests = recentPerf.length || 1;
    const errorCount = recentErrors.length;
    const errorRate = errorCount / totalRequests;

    // 按端点统计
    const endpointStats = {};
    for (const [endpoint, stats] of Object.entries(this.counters.byEndpoint)) {
      endpointStats[endpoint] = {
        total: stats.total,
        errors: stats.errors,
        errorRate: stats.total > 0 ? stats.errors / stats.total : 0,
        avgResponseTime: stats.total > 0 ? stats.totalTime / stats.total : 0,
      };
    }

    // 业务指标统计
    const businessStats = {};
    for (const event of recentBusiness) {
      if (!businessStats[event.eventType]) {
        businessStats[event.eventType] = 0;
      }
      businessStats[event.eventType]++;
    }

    // 获取最新资源指标
    const latestResources = this.metrics.resources[this.metrics.resources.length - 1] || null;

    return {
      window: windowMs,
      timestamp: now,
      summary: {
        totalRequests,
        successCount: this.counters.success,
        errorCount,
        errorRate,
        requestsPerSecond: totalRequests / (windowMs / 1000),
      },
      performance: {
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        p95ResponseTime: Math.round(p95ResponseTime * 100) / 100,
        p99ResponseTime: Math.round(p99ResponseTime * 100) / 100,
        maxResponseTime: Math.round(maxResponseTime * 100) / 100,
      },
      errors: {
        byType: this.counters.byErrorType,
        byStatus: this.counters.byStatus,
        recent: recentErrors.slice(-10),
      },
      endpoints: endpointStats,
      business: businessStats,
      resources: latestResources,
    };
  }

  // 清理过期数据
  cleanup() {
    const now = Date.now();
    const retention = config.METRICS_RETENTION;
    const cutoff = now - retention;

    const beforeCount = {
      performance: this.metrics.performance.length,
      errors: this.metrics.errors.length,
      resources: this.metrics.resources.length,
      business: this.metrics.business.length,
    };

    this.metrics.performance = this.metrics.performance.filter(m => m.timestamp > cutoff);
    this.metrics.errors = this.metrics.errors.filter(m => m.timestamp > cutoff);
    this.metrics.resources = this.metrics.resources.filter(m => m.timestamp > cutoff);
    this.metrics.business = this.metrics.business.filter(m => m.timestamp > cutoff);

    this.lastCleanup = now;
    
    return {
      cleaned: {
        performance: beforeCount.performance - this.metrics.performance.length,
        errors: beforeCount.errors - this.metrics.errors.length,
        resources: beforeCount.resources - this.metrics.resources.length,
        business: beforeCount.business - this.metrics.business.length,
      },
      remaining: {
        performance: this.metrics.performance.length,
        errors: this.metrics.errors.length,
        resources: this.metrics.resources.length,
        business: this.metrics.business.length,
      },
    };
  }

  // 重置计数器
  resetCounters() {
    this.counters = {
      requests: 0,
      errors: 0,
      success: 0,
      byEndpoint: {},
      byStatus: {},
      byErrorType: {},
    };
  }
}

module.exports = new MetricsCollector();