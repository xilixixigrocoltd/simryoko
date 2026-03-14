/**
 * 监控告警系统配置
 */

module.exports = {
  // 监控采集间隔 (ms)
  COLLECTION_INTERVAL: 30000, // 30秒

  // 指标保留时间 (ms) - 24小时
  METRICS_RETENTION: 24 * 60 * 60 * 1000,

  // 告警检查间隔 (ms)
  ALERT_CHECK_INTERVAL: 15000, // 15秒

  // 告警级别定义
  ALERT_LEVELS: {
    CRITICAL: {
      name: 'critical',
      label: '🔴 严重',
      priority: 1,
      notifyChannels: ['telegram', 'sms'], // 可扩展
      autoResolve: false,
     EscalationTimeout: 300000, // 5分钟后升级
    },
    ERROR: {
      name: 'error',
      label: '🟠 错误',
      priority: 2,
      notifyChannels: ['telegram'],
      autoResolve: true,
     EscalationTimeout: 900000, // 15分钟后升级
    },
    WARNING: {
      name: 'warning',
      label: '🟡 警告',
      priority: 3,
      notifyChannels: ['telegram'],
      autoResolve: true,
     EscalationTimeout: 1800000, // 30分钟后升级
    },
    INFO: {
      name: 'info',
      label: '🔵 信息',
      priority: 4,
      notifyChannels: [],
      autoResolve: true,
     EscalationTimeout: 0,
    },
  },

  // 通知渠道配置
  NOTIFICATION: {
    telegram: {
      // 从环境变量读取（安全）
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      // 群组和频道ID
      adminChatId: process.env.TELEGRAM_ADMIN_ID || '7867683484',
      groupChatId: process.env.TELEGRAM_GROUP_ID || '-1003847622485',
      channelChatId: process.env.TELEGRAM_CHANNEL_ID || '-1003642242507',
    },
  },

  // 告警规则配置
  RULES: {
    // 性能指标
    responseTime: {
      critical: 5000, // 5秒
      error: 3000,    // 3秒
      warning: 1500,  // 1.5秒
    },
    errorRate: {
      critical: 0.2,  // 20%
      error: 0.1,     // 10%
      warning: 0.05,  // 5%
    },
    // 资源指标
    cpuUsage: {
      critical: 95,
      error: 85,
      warning: 75,
    },
    memoryUsage: {
      critical: 95,
      error: 85,
      warning: 75,
    },
    // 业务指标
    orderFailureRate: {
      critical: 0.15,
      error: 0.1,
      warning: 0.05,
    },
    paymentFailureRate: {
      critical: 0.2,
      error: 0.15,
      warning: 0.1,
    },
    // 库存指标
    lowStockThreshold: {
      critical: 5,
      error: 10,
      warning: 20,
    },
  },

  // 仪表板配置
  DASHBOARD: {
    refreshInterval: 10000, // 10秒
    maxDataPoints: 60,      // 最多显示60个数据点
  },
};