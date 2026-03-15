import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'
import { Agent } from '@/types/agent'
import { agents } from '@/lib/store'

// 输入验证schema
const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少8位').regex(/[A-Z]/, '密码需包含大写字母').regex(/[a-z]/, '密码需包含小写字母').regex(/[0-9]/, '密码需包含数字'),
  name: z.string().min(2, '姓名至少2位').max(50, '姓名最多50位'),
  phone: z.string().regex(/^\+?[\d\s-]{8,20}$/, '手机号格式不正确').optional(),
  telegramId: z.string().regex(/^[a-zA-Z0-9_]{5,32}$/, 'Telegram ID格式不正确').optional(),
  referralCode: z.string().optional()
})

// 生成API Key
function generateApiKey(): string {
  return `sr_${crypto.randomBytes(32).toString('hex')}`
}

// 代理注册
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // 验证输入
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password, name, phone, telegramId, referralCode } = result.data

    // 检查邮箱是否已存在
    const existingAgent = agents.find(a => a.email === email)
    if (existingAgent) {
      return NextResponse.json(
        { error: '该邮箱已注册' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 生成API Key
    const apiKey = generateApiKey()

    // 创建代理
    const agent: Agent = {
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
