import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

    // 构建查询条件
    const where: any = { agentId: payload.agentId }
    if (status) {
      where.status = status.toUpperCase()
    }

    // 查询订单
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: true
        }
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      success: true,
      orders,
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
    const agent = await prisma.agent.findUnique({
      where: { id: payload.agentId }
    })

    if (!agent || agent.balance < cost) {
      return NextResponse.json(
        { error: '余额不足' },
        { status: 400 }
      )
    }

    // 计算利润
    const profit = price - cost

    // 创建订单
    const order = await prisma.order.create({
      data: {
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
        paymentStatus: 'PENDING'
      }
    })

    // 扣除余额
    await prisma.agent.update({
      where: { id: payload.agentId },
      data: {
        balance: { decrement: cost },
        totalSpend: { increment: cost },
        totalOrders: { increment: 1 }
      }
    })

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