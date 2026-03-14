/**
 * 监控告警系统 - 主入口
 * 
 * 功能：
 * 1. 多维度监控指标收集（性能/错误/资源/业务）
 * 2. 实时告警机制
 * 3. 监控仪表板 API
 * 4. 告警分级和响应流程
 * 5. 集成到 AI Team 通知系统 (Telegram)
 */

const express = require('express');
const metricsCollector = require('./metrics-collector');
const alertEngine = require('./alert-engine');
const dashboardRouter = require('./dashboard');

/**
 * 创建监控中间件
 * 用于 Express 应用，自动收集请求指标
 */
function createMonitoringMiddleware() {
  return (req, res, next) => {
    const startTime = Date.now();
    const endpoint = req.path;
    
    // 记录原始 end 方法
    const originalEnd = res.end;
    
    res.end = function(...args) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // 记录指标
      metricsCollector.recordRequest(endpoint, statusCode, responseTime);
      
      // 调用原始 end 方法
      return originalEnd.apply(this, args);
    };
    
    next();
  };
}

/**
 * 创建业务指标记录中间件
 * 用于特定业务事件
 */
function createBusinessMiddleware(eventType) {
  return (req, res, next) => {
    // 在业务逻辑完成后记录
    const originalJson = res.json;
    
    res.json = function(...args) {
      const data = args[0];
      
      // 根据响应判断业务事件
      if (data && data.success === false) {
        metricsCollector.recordBusinessEvent(`${eventType}_failed`, {
          endpoint: req.path,
          reason: data.error,
        });
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        metricsCollector.recordBusinessEvent(`${eventType}_success`, {
          endpoint: req.path,
        });
      }
      
      return originalJson.apply(this, args);
    };
    
    next();
  };
}

/**
 * 初始化监控系统
 */
async function initializeMonitoring(app) {
  console.log('[Monitoring] 初始化监控系统...');
  
  // 添加监控中间件（排除监控 API 本身）
  const monitorMiddleware = createMonitoringMiddleware();
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/monitoring')) {
      return next(); // 跳过监控 API 的请求
    }
    return monitorMiddleware(req, res, next);
  });
  
  // 注册仪表板路由
  app.use('/api/monitoring', dashboardRouter);
  
  // 初始化告警引擎
  await alertEngine.initialize();
  
  // 收集初始资源指标
  metricsCollector.collectResourceMetrics();
  
  console.log('[Monitoring] 监控系统初始化完成');
  
  return {
    middleware: createMonitoringMiddleware(),
    recordBusinessEvent: (type, data) => metricsCollector.recordBusinessEvent(type, data),
    getMetrics: (windowMs) => metricsCollector.getAggregatedMetrics(windowMs),
    getAlerts: (level) => alertEngine.getActiveAlerts(level),
    getAlertStats: () => alertEngine.getAlertStats(),
    triggerAlert: (data) => alertEngine.triggerAlert(data),
  };
}

/**
 * 导出模块
 */
module.exports = {
  initializeMonitoring,
  createMonitoringMiddleware,
  createBusinessMiddleware,
  metricsCollector,
  alertEngine,
};