/**
 * 监控仪表板 API
 * 
 * 提供实时监控数据展示
 */

const express = require('express');
const metricsCollector = require('./metrics-collector');
const alertEngine = require('./alert-engine');
const notification = require('./notification');
const config = require('./config');

const router = express.Router();

// 根路由测试
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Monitoring API is running' });
});

// 获取实时指标
router.get('/metrics', (req, res) => {
  const windowMs = parseInt(req.query.window) || 60000;
  const metrics = metricsCollector.getAggregatedMetrics(windowMs);
  
  res.json({
    success: true,
    data: metrics,
    timestamp: Date.now(),
  });
});

// 获取历史指标（用于图表）
router.get('/metrics/history', (req, res) => {
  const type = req.query.type || 'performance'; // performance, errors, resources, business
  const limit = Math.min(parseInt(req.query.limit) || 60, 300);
  
  const data = metricsCollector.metrics[type]?.slice(-limit) || [];
  
  res.json({
    success: true,
    data,
    count: data.length,
  });
});

// 获取活跃告警
router.get('/alerts', (req, res) => {
  const level = req.query.level;
  const alerts = alertEngine.getActiveAlerts(level);
  
  res.json({
    success: true,
    data: alerts,
    count: alerts.length,
  });
});

// 获取告警统计
router.get('/alerts/stats', (req, res) => {
  const stats = alertEngine.getAlertStats();
  
  res.json({
    success: true,
    data: stats,
  });
});

// 确认告警
router.post('/alerts/:alertId/acknowledge', (req, res) => {
  const { alertId } = req.params;
  const { acknowledgedBy } = req.body;
  
  const success = alertEngine.acknowledgeAlert(alertId, acknowledgedBy);
  
  res.json({
    success,
    message: success ? '告警已确认' : '告警不存在',
  });
});

// 解决告警
router.post('/alerts/:alertId/resolve', (req, res) => {
  const { alertId } = req.params;
  const { resolvedBy } = req.body;
  
  const success = alertEngine.resolveAlert(alertId, resolvedBy);
  
  res.json({
    success,
    message: success ? '告警已解决' : '告警不存在',
  });
});

// 获取仪表板概览
router.get('/dashboard/overview', (req, res) => {
  const metrics = metricsCollector.getAggregatedMetrics(60000);
  const alertStats = alertEngine.getAlertStats();
  
  // 计算健康度分数
  let healthScore = 100;
  
  // 扣分项
  if (metrics.performance.p95ResponseTime > 1000) healthScore -= 10;
  if (metrics.summary.errorRate > 0.05) healthScore -= 20;
  if (alertStats.byLevel.critical > 0) healthScore -= 30;
  if (alertStats.byLevel.error > 0) healthScore -= 15;
  if (alertStats.byLevel.warning > 0) healthScore -= 5;
  
  healthScore = Math.max(0, healthScore);
  
  const overview = {
    health: {
      score: healthScore,
      status: healthScore >= 90 ? 'healthy' : healthScore >= 70 ? 'degraded' : 'unhealthy',
    },
    traffic: {
      requests: metrics.summary.totalRequests,
      rps: metrics.summary.requestsPerSecond.toFixed(2),
      successRate: ((1 - metrics.summary.errorRate) * 100).toFixed(1) + '%',
    },
    performance: {
      avgResponse: metrics.performance.avgResponseTime + 'ms',
      p95Response: metrics.performance.p95ResponseTime + 'ms',
      p99Response: metrics.performance.p99ResponseTime + 'ms',
    },
    errors: {
      count: metrics.summary.errorCount,
      rate: (metrics.summary.errorRate * 100).toFixed(2) + '%',
      topErrors: Object.entries(metrics.errors.byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count]) => ({ type, count })),
    },
    resources: metrics.resources ? {
      cpu: metrics.resources.cpu.usagePercent.toFixed(1) + '%',
      memory: metrics.resources.memory.usagePercent.toFixed(1) + '%',
      uptime: formatUptime(metrics.resources.system.uptime),
    } : null,
    alerts: {
      total: alertStats.total,
      critical: alertStats.byLevel.critical,
      error: alertStats.byLevel.error,
      warning: alertStats.byLevel.warning,
      unacknowledged: alertStats.unacknowledged,
    },
    timestamp: Date.now(),
  };
  
  res.json({
    success: true,
    data: overview,
  });
});

// 获取端点统计
router.get('/endpoints', (req, res) => {
  const metrics = metricsCollector.getAggregatedMetrics(60000);
  
  res.json({
    success: true,
    data: metrics.endpoints,
  });
});

// 手动触发测试告警
router.post('/test/alert', (req, res) => {
  const { level = 'WARNING', title, message } = req.body;
  
  alertEngine.triggerAlert({
    type: 'test',
    level,
    title: title || '测试告警',
    message: message || '这是一条测试告警',
    metric: 0,
    threshold: 0,
    source: 'manual',
  });
  
  res.json({
    success: true,
    message: '测试告警已触发',
  });
});

// 发送测试消息
router.post('/test/notification', async (req, res) => {
  try {
    await notification.broadcast('🧪 *监控测试消息*\n\n这是一条来自监控系统的测试消息。');
    res.json({
      success: true,
      message: '测试消息已发送',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 辅助函数：格式化运行时间
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}天 ${hours}小时`;
  if (hours > 0) return `${hours}小时 ${minutes}分钟`;
  return `${minutes}分钟`;
}

// 使用 CommonJS 导出
module.exports = router;
module.exports.default = router;