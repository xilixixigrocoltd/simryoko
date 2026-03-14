'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AgentInfo {
  id: string
  name: string
  email: string
  level: string
  balance: number
  apiKey: string
}

interface Order {
  id: string
  productName: string
  status: string
  price: number
  createdAt: string
}

export default function AgentDashboard() {
  const router = useRouter()
  const [agent, setAgent] = useState<AgentInfo | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('agent_token')
    const agentInfo = localStorage.getItem('agent_info')

    if (!token || !agentInfo) {
      router.push('/agent/login')
      return
    }

    setAgent(JSON.parse(agentInfo))
    fetchOrders(token)
  }, [router])

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch('/api/agent/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders.slice(0, 5))
      }
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('agent_token')
    localStorage.removeItem('agent_info')
    router.push('/agent/login')
  }

  const getLevelText = (level: string) => {
    const levels: Record<string, string> = {
      BRONZE: '普通代理',
      SILVER: '银牌代理',
      GOLD: '金牌代理',
      PLATINUM: '铂金代理'
    }
    return levels[level] || level
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      BRONZE: 'bg-gray-100 text-gray-800',
      SILVER: 'bg-blue-100 text-blue-800',
      GOLD: 'bg-yellow-100 text-yellow-800',
      PLATINUM: 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  if (!agent) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-orange-500">
                SimRyoko
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-700">代理后台</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{agent.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">账户余额</div>
            <div className="text-2xl font-bold text-gray-900">${agent.balance.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">代理级别</div>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(agent.level)}`}>
              {getLevelText(agent.level)}
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">API Key</div>
            <div className="text-sm font-mono text-gray-700 truncate">{agent.apiKey}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">邮箱</div>
            <div className="text-sm text-gray-700 truncate">{agent.email}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              浏览产品
            </Link>
            <Link
              href="/agent/orders"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              查看全部订单
            </Link>
            <button
              onClick={() => alert('充值功能开发中')}
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              充值余额
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
            <Link href="/agent/orders" className="text-sm text-orange-500 hover:text-orange-600">
              查看全部 →
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无订单
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">产品</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{order.productName}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">${order.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'COMPLETED' ? '已完成' :
                           order.status === 'PENDING' ? '待处理' : order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}