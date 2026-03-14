import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    const existingAgent = await prisma.agent.findUnique({
      where: { email }
    })

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
    const agent = await prisma.agent.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        telegramId,
        apiKey,
        balance: 0,
        level: 'BRONZE'
      }
    })

    // 处理推荐码
    if (referralCode) {
      const referrer = await prisma.agent.findFirst({
        where: { apiKey: referralCode }
      })

      if (referrer) {
        await prisma.referral.create({
          data: {
            agentId: referrer.id,
            referredId: agent.id
          }
        })
      }
    }

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