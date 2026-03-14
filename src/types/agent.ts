export interface Agent {
  id: string
  email: string
  password: string
  name: string
  phone?: string
  telegramId?: string
  apiKey: string
  balance: number
  level: string
  totalSpend?: number
  totalOrders?: number
  lastLoginAt?: Date
  createdAt: Date
}

export interface Order {
  id: string
  agentId: string
  customerId?: string
  productId: string
  productName: string
  productData?: string
  productDays?: number
  cost: number
  price: number
  profit: number
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED'
  paymentMethod?: string
  paymentStatus?: string
  createdAt: Date
}

export interface JWTPayload {
  agentId: string
  email: string
  level: string
}
