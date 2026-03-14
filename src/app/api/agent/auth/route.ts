import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// 内存存储（生产环境应使用数据库）
const agents: any[] = []
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 代理登录
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 查找代理
    const agent = agents.find(a => a.email === email)

    if (!agent) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, agent.password)
    if (!isValid) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 更新最后登录时间
    agent.lastLoginAt = new Date()

    // 生成JWT
    const token = jwt.sign(
      { 
        agentId: agent.id, 
        email: agent.email,
        level: agent.level || 'standard'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        level: agent.level || 'standard',
        balance: agent.balance || 0,
        apiKey: agent.apiKey
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}
