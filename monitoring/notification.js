/**
 * 通知模块 - 集成 Telegram 告警通知
 */

const config = require('./config');

class NotificationService {
  constructor() {
    this.telegramConfig = config.NOTIFICATION.telegram;
    this.messageQueue = [];
    this.sending = false;
  }

  // 发送告警通知
  async sendAlert(alert) {
    const message = this.formatAlertMessage(alert);
    
    // 发送到各个渠道
    const channels = alert.level.notifyChannels;
    
    for (const channel of channels) {
      if (channel === 'telegram') {
        await this.sendToTelegram(message, alert);
      }
    }
  }

  // 发送告警解决通知
  async sendResolution(alert) {
    const message = this.formatResolutionMessage(alert);
    
    await this.sendToTelegram(message, { level: { name: 'info' } });
  }

  // 格式化告警消息
  formatAlertMessage(alert) {
    const emoji = {
      critical: '🔴',
      error: '🟠',
      warning: '🟡',
      info: '🔵',
    }[alert.level.name] || '⚪';

    return `${emoji} *${alert.level.label}*\n\n` +
      `*${alert.title}*\n` +
      `${alert.message}\n\n` +
      `📊 来源: ${alert.source}\n` +
      `⏰ 时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n` +
      `🆔 ID: \`${alert.id}\``;
  }

  // 格式化解决消息
  formatResolutionMessage(alert) {
    return `✅ *告警已解决*\n\n` +
      `*${alert.title}*\n` +
      `解决时间: ${new Date(alert.resolvedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n` +
      `持续时间: ${this.formatDuration(alert.resolvedAt - alert.createdAt)}`;
  }

  // 格式化时长
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`;
    } else if (minutes > 0) {
      return `${minutes}分钟${seconds % 60}秒`;
    } else {
      return `${seconds}秒`;
    }
  }

  // 发送到 Telegram
  async sendToTelegram(message, alert) {
    const token = this.telegramConfig.botToken;
    
    // 确定发送目标
    let chatIds = [];
    
    if (alert.level.name === 'critical') {
      // 严重告警发送到所有渠道
      chatIds = [
        this.telegramConfig.adminChatId,
        this.telegramConfig.groupChatId,
      ];
    } else if (alert.level.name === 'error') {
      // 错误告警发送到群组
      chatIds = [this.telegramConfig.groupChatId];
    } else {
      // 其他告警只发送到管理
      chatIds = [this.telegramConfig.adminChatId];
    }

    for (const chatId of chatIds) {
      try {
        await this.telegramRequest(token, 'sendMessage', {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        });
        console.log(`[Notification] 消息已发送到 ${chatId}`);
      } catch (error) {
        console.error(`[Notification] 发送失败:`, error.message);
      }
    }
  }

  // Telegram API 请求
  async telegramRequest(token, method, data) {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.description || 'Telegram API error');
    }

    return response.json();
  }

  // 发送每日报告
  async sendDailyReport(stats) {
    const message = this.formatDailyReport(stats);
    
    await this.sendToTelegram(message, { level: { name: 'info' } });
  }

  // 格式化每日报告
  formatDailyReport(stats) {
    return `📊 *每日监控报告*\n\n` +
      `*请求统计 (24小时)*\n` +
      `• 总请求: ${stats.requests?.toLocaleString() || 0}\n` +
      `• 成功: ${stats.success?.toLocaleString() || 0}\n` +
      `• 失败: ${stats.errors?.toLocaleString() || 0}\n` +
      `• 错误率: ${(stats.errorRate * 100).toFixed(2)}%\n\n` +
      `*性能指标*\n` +
      `• 平均响应: ${stats.avgResponseTime?.toFixed(0) || 0}ms\n` +
      `• P95响应: ${stats.p95ResponseTime?.toFixed(0) || 0}ms\n\n` +
      `*告警统计*\n` +
      `• 严重: ${stats.alerts?.critical || 0}\n` +
      `• 错误: ${stats.alerts?.error || 0}\n` +
      `• 警告: ${stats.alerts?.warning || 0}`;
  }

  // 广播消息到所有渠道
  async broadcast(message, parseMode = 'Markdown') {
    const token = this.telegramConfig.botToken;
    const chatIds = [
      this.telegramConfig.adminChatId,
      this.telegramConfig.groupChatId,
      this.telegramConfig.channelChatId,
    ];

    for (const chatId of chatIds) {
      try {
        await this.telegramRequest(token, 'sendMessage', {
          chat_id: chatId,
          text: message,
          parse_mode: parseMode,
        });
      } catch (error) {
        console.error(`[Notification] 广播到 ${chatId} 失败:`, error.message);
      }
    }
  }
}

module.exports = new NotificationService();