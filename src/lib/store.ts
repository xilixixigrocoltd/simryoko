import { Agent } from '@/types/agent'

// 内存存储（⚠️ 生产环境必须使用数据库，否则重启丢失数据）
// 使用全局变量确保在 Next.js 热重载和 serverless 环境中保持单例

declare global {
  // eslint-disable-next-line no-var
  var __agents: Agent[] | undefined
  // eslint-disable-next-line no-var
  var __orders: any[] | undefined
}

// Agent 存储
export const agents: Agent[] = global.__agents || []
if (!global.__agents) {
  global.__agents = agents
}

// Order 存储（用于内存存储模式）
export const orders: any[] = global.__orders || []
if (!global.__orders) {
  global.__orders = orders
}

// 持久化到文件的辅助函数（可选，用于减少数据丢失）
export function persistToFile() {
  // 注意：此功能仅在 Node.js 环境可用，Vercel serverless 不支持文件写入
  // 生产环境请使用数据库
}

// 从文件加载的辅助函数（可选）
export function loadFromFile() {
  // 注意：此功能仅在 Node.js 环境可用
  // 生产环境请使用数据库
}
