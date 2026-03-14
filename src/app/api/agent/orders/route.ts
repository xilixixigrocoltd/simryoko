import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// 内存存储
const orders: any[] = []
const agents: any[] = []
const JWT_SECRET = process.env.JWT_SECRET || 'simryoko-jwt-secret-change-in-production'

// 验证JWT
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { agentId: string; email: string; level: string }
  } catch {
    return null
  }
}

// 获取代理订单列表
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'token无效' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 过滤订单
    let agentOrders = orders.filter(o => o.agentId === payload.agentId)
    if (status) {
      agentOrders = agentOrders.filter(o => o.status === status.toUpperCase())
    }

    const total = agentOrders.length
    const paginatedOrders = agentOrders.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: '获取订单失败' },
      { status: 500 }
    )
  }
}

// 创建订单
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'token无效' }, { status: 401 })
    }

    const { productId, productName, productData, productDays, cost, price, customerId } = await req.json()

    // 检查代理余额
    const agent = agents.find(a => a.id === payload.agentId)
    if (!agent || agent.balance < cost) {
      return NextResponse.json(
        { error: '余额不足' },
        { status: 400 }
      )
    }

    // 计算利润
    const profit = price - cost

    // 创建订单
    const order = {
      id: crypto.randomUUID(),
      agentId: payload.agentId,
      customerId,
      productId,
      productName,
      productData,
      productDays,
      cost,
      price,
      profit,
      status: 'PENDING',
      paymentMethod: 'BALANCE',
      paymentStatus: 'PENDING',
      createdAt: new Date()
    }
    orders.push(order)

    // 扣除余额
    agent.balance -= cost
    agent.totalSpend = (agent.totalSpend || 0) + cost
    agent.totalOrders = (agent.totalOrders || 0) + 1

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: '创建订单失败' },
      { status: 500 }
    )
  }
}
