'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  productName: string
  productData: string
  productDays: string
  price: number
  cost: number
  profit: number
  status: string
  paymentStatus: string
  createdAt: string
  customer?: {
    name: string
    email: string
  }
}

export default function AgentOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('agent_token')
    if (!token) {
      router.push('/agent/login')
      return
    }
    fetchOrders(token)
  }, [router, filter, pagination.page])

  const fetchOrders = async (token: string) => {
    try {
      const statusParam = filter !== 'ALL' ? `&status=${filter}` : ''
      const res = await fetch(
        `/api/agent/orders?page=${pagination.page}&limit=${pagination.limit}${statusParam}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
        setPagination(data.pagination)
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

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: '待处理',
      PAID: '已支付',
      PROCESSING: '处理中',
      COMPLETED: '已完成',
      CANCELLED: '已取消',
      REFUNDED: '已退款'
    }
    return texts[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      REFUNDED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

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
              <span className="text-gray-700">订单管理</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/agent/dashboard" className="text-gray-600 hover:text-gray-900">
                返回后台
              </Link>
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
        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">状态筛选：</span>
            {['ALL', 'PENDING', 'PAID', 'PROCESSING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status)
                  setPagination({ ...pagination, page: 1 })
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? '全部' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              订单列表
              <span className="ml-2 text-sm text-gray-500">
                (共 {pagination.total} 单)
              </span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无订单
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">订单号</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">产品</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">客户</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">售价</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">成本</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">利润</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-mono text-gray-900">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{order.productName}</div>
                        <div className="text-xs text-gray-500">
                          {order.productData} / {order.productDays}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {order.customer?.name || '匿名客户'}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ${order.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        ${order.cost.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-green-600">
                        +${order.profit.toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                第 {pagination.page} / {pagination.pages} 页
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.pages}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}