/**
 * 告警引擎 - 实时监控和告警触发
 */

const config = require('./config');
const metricsCollector = require('./metrics-collector');
const notification = require('./notification');

class AlertEngine {
  constructor() {
    this.activeAlerts = new Map(); // alertId -> alert
    this.alertHistory = [];
    this.lastCheck = Date.now();
  }

  // 初始化告警引擎
  async initialize() {
    console.log('[AlertEngine] 初始化告警引擎...');
    
    // 启动定期检查
    setInterval(() => this.checkAlerts(), config.ALERT_CHECK_INTERVAL);
    
    // 启动资源指标收集
    setInterval(() => {
      metricsCollector.collectResourceMetrics();
    }, config.COLLECTION_INTERVAL);

    // 定期清理过期告警
    setInterval(() => this.cleanupAlerts(), 60000);
  }

  // 检查所有告警规则
  checkAlerts() {
    const metrics = metricsCollector.getAggregatedMetrics(60000); // 1分钟窗口
    
    // 检查响应时间
    this.checkResponseTime(metrics);
    
    // 检查错误率
    this.checkErrorRate(metrics);
    
    // 检查资源使用
    this.checkResourceUsage(metrics);
    
    // 检查业务指标
    this.checkBusinessMetrics(metrics);

    this.lastCheck = Date.now();
  }

  // 检查响应时间
  checkResponseTime(metrics) {
    const { p95ResponseTime, maxResponseTime } = metrics.performance;
    const rules = config.RULES.responseTime;

    if (maxResponseTime > rules.critical) {
      this.triggerAlert({
        type: 'response_time',
        level: 'CRITICAL',
        title: '响应时间严重超标',
        message: `最大响应时间: ${maxResponseTime}ms (阈值: ${rules.critical}ms)`,
        metric: maxResponseTime,
        threshold: rules.critical,
        source: 'performance',
      });
    } else if (p95ResponseTime > rules.error) {
      this.triggerAlert({
        type: 'response_time',
        level: 'ERROR',
        title: '响应时间过高',
        message: `P95响应时间: ${p95ResponseTime}ms (阈值: ${rules.error}ms)`,
        metric: p95ResponseTime,
        threshold: rules.error,
        source: 'performance',
      });
    } else if (p95ResponseTime > rules.warning) {
      this.triggerAlert({
        type: 'response_time',
        level: 'WARNING',
        title: '响应时间偏慢',
        message: `P95响应时间: ${p95ResponseTime}ms (阈值: ${rules.warning}ms)`,
        metric: p95ResponseTime,
        threshold: rules.warning,
        source: 'performance',
      });
    }
  }

  // 检查错误率
  checkErrorRate(metrics) {
    const { errorRate, errorCount, totalRequests } = metrics.summary;
    const rules = config.RULES.errorRate;

    if (errorRate > rules.critical) {
      this.triggerAlert({
        type: 'error_rate',
        level: 'CRITICAL',
        title: '错误率严重超标',
        message: `错误率: ${(errorRate * 100).toFixed(2)}% (${errorCount}/${totalRequests} 请求)`,
        metric: errorRate,
        threshold: rules.critical,
        source: 'errors',
      });
    } else if (errorRate > rules.error) {
      this.triggerAlert({
        type: 'error_rate',
        level: 'ERROR',
        title: '错误率过高',
        message: `错误率: ${(errorRate * 100).toFixed(2)}% (${errorCount}/${totalRequests} 请求)`,
        metric: errorRate,
        threshold: rules.error,
        source: 'errors',
      });
    } else if (errorRate > rules.warning) {
      this.triggerAlert({
        type: 'error_rate',
        level: 'WARNING',
        title: '错误率偏高',
        message: `错误率: ${(errorRate * 100).toFixed(2)}% (${errorCount}/${totalRequests} 请求)`,
        metric: errorRate,
        threshold: rules.warning,
        source: 'errors',
      });
    }
  }

  // 检查资源使用
  checkResourceUsage(metrics) {
    if (!metrics.resources) return;

    const { cpu, memory } = metrics.resources;
    const cpuRules = config.RULES.cpuUsage;
    const memRules = config.RULES.memoryUsage;

    // CPU 检查
    if (cpu.usagePercent > cpuRules.critical) {
      this.triggerAlert({
        type: 'cpu_usage',
        level: 'CRITICAL',
        title: 'CPU使用率严重超标',
        message: `CPU使用率: ${cpu.usagePercent.toFixed(1)}% (阈值: ${cpuRules.critical}%)`,
        metric: cpu.usagePercent,
        threshold: cpuRules.critical,
        source: 'resources',
      });
    } else if (cpu.usagePercent > cpuRules.error) {
      this.triggerAlert({
        type: 'cpu_usage',
        level: 'ERROR',
        title: 'CPU使用率过高',
        message: `CPU使用率: ${cpu.usagePercent.toFixed(1)}% (阈值: ${cpuRules.error}%)`,
        metric: cpu.usagePercent,
        threshold: cpuRules.error,
        source: 'resources',
      });
    } else if (cpu.usagePercent > cpuRules.warning) {
      this.triggerAlert({
        type: 'cpu_usage',
        level: 'WARNING',
        title: 'CPU使用率偏高',
        message: `CPU使用率: ${cpu.usagePercent.toFixed(1)}% (阈值: ${cpuRules.warning}%)`,
        metric: cpu.usagePercent,
        threshold: cpuRules.warning,
        source: 'resources',
      });
    }

    // 内存检查
    if (memory.usagePercent > memRules.critical) {
      this.triggerAlert({
        type: 'memory_usage',
        level: 'CRITICAL',
        title: '内存使用率严重超标',
        message: `内存使用率: ${memory.usagePercent.toFixed(1)}%`,
        metric: memory.usagePercent,
        threshold: memRules.critical,
        source: 'resources',
      });
    } else if (memory.usagePercent > memRules.error) {
      this.triggerAlert({
        type: 'memory_usage',
        level: 'ERROR',
        title: '内存使用率过高',
        message: `内存使用率: ${memory.usagePercent.toFixed(1)}%`,
        metric: memory.usagePercent,
        threshold: memRules.error,
        source: 'resources',
      });
    } else if (memory.usagePercent > memRules.warning) {
      this.triggerAlert({
        type: 'memory_usage',
        level: 'WARNING',
        title: '内存使用率偏高',
        message: `内存使用率: ${memory.usagePercent.toFixed(1)}%`,
        metric: memory.usagePercent,
        threshold: memRules.warning,
        source: 'resources',
      });
    }
  }

  // 检查业务指标
  checkBusinessMetrics(metrics) {
    // 订单失败率检查
    const orderFailures = metrics.business['order_failed'] || 0;
    const orderTotal = (metrics.business['order_created'] || 0) + orderFailures;
    
    if (orderTotal > 0) {
      const orderFailureRate = orderFailures / orderTotal;
      const rules = config.RULES.orderFailureRate;

      if (orderFailureRate > rules.critical) {
        this.triggerAlert({
          type: 'order_failure_rate',
          level: 'CRITICAL',
          title: '订单失败率严重超标',
          message: `订单失败率: ${(orderFailureRate * 100).toFixed(2)}%`,
          metric: orderFailureRate,
          threshold: rules.critical,
          source: 'business',
        });
      }
    }
  }

  // 触发告警
  async triggerAlert(alertData) {
    const alertId = `${alertData.type}_${alertData.source}_${Date.now()}`;
    
    // 检查是否已经存在相同类型的活跃告警
    const existingAlert = Array.from(this.activeAlerts.values())
      .find(a => a.type === alertData.type && a.level === alertData.level);
    
    if (existingAlert) {
      // 更新已有告警
      existingAlert.lastTriggered = Date.now();
      existingAlert.count = (existingAlert.count || 1) + 1;
      existingAlert.lastMetric = alertData.metric;
      return;
    }

    const alert = {
      id: alertId,
      ...alertData,
      level: config.ALERT_LEVELS[alertData.level],
      status: 'active',
      createdAt: Date.now(),
      lastTriggered: Date.now(),
      count: 1,
      acknowledged: false,
      acknowledgedBy: null,
      resolvedAt: null,
    };

    this.activeAlerts.set(alertId, alert);
    
    // 记录到历史
    this.alertHistory.push({ ...alert });
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(-500);
    }

    // 发送通知
    await notification.sendAlert(alert);

    console.log(`[AlertEngine] 🔔 触发告警: ${alert.level.label} - ${alert.title}`);
  }

  // 解决告警
  resolveAlert(alertId, resolvedBy = 'system') {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return false;

    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    alert.resolvedBy = resolvedBy;
    
    this.activeAlerts.delete(alertId);

    // 发送解决通知
    notification.sendResolution(alert);

    console.log(`[AlertEngine] ✅ 告警已解决: ${alert.title}`);
    return true;
  }

  // 确认告警
  acknowledgeAlert(alertId, acknowledgedBy) {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = Date.now();

    return true;
  }

  // 清理过期告警
  cleanupAlerts() {
    const now = Date.now();
    const staleTimeout = 24 * 60 * 60 * 1000; // 24小时

    for (const [alertId, alert] of this.activeAlerts) {
      if (now - alert.lastTriggered > staleTimeout) {
        this.resolveAlert(alertId, 'timeout_cleanup');
      }
    }
  }

  // 获取活跃告警
  getActiveAlerts(level = null) {
    const alerts = Array.from(this.activeAlerts.values());
    if (level) {
      return alerts.filter(a => a.level.name === level.toLowerCase());
    }
    return alerts;
  }

  // 获取告警统计
  getAlertStats() {
    const active = Array.from(this.activeAlerts.values());
    return {
      total: active.length,
      byLevel: {
        critical: active.filter(a => a.level.name === 'critical').length,
        error: active.filter(a => a.level.name === 'error').length,
        warning: active.filter(a => a.level.name === 'warning').length,
        info: active.filter(a => a.level.name === 'info').length,
      },
      unacknowledged: active.filter(a => !a.acknowledged).length,
      history: this.alertHistory.slice(-100),
    };
  }
}

module.exports = new AlertEngine();