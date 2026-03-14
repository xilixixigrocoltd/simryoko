import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// 内存存储
const agents: any[] = []

// 生成API Key
function generateApiKey(): string {
  return `sr_${crypto.randomBytes(32).toString('hex')}`
}

// 代理注册
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, telegramId, referralCode } = await req.json()

    // 验证必填字段
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingAgent = agents.find(a => a.email === email)
    if (existingAgent) {
      return NextResponse.json(
        { error: '该邮箱已注册' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 生成API Key
    const apiKey = generateApiKey()

    // 创建代理
    const agent = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      name,
      phone,
      telegramId,
      apiKey,
      balance: 0,
      level: 'BRONZE',
      createdAt: new Date()
    }
    agents.push(agent)

    return NextResponse.json({
      success: true,
      message: '注册成功',
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        apiKey: agent.apiKey
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
}
