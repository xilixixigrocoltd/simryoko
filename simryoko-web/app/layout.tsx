import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SimRyoko eSIM - 全球旅行eSIM套餐',
  description: '便捷购买全球eSIM流量套餐，覆盖200+国家和地区，即买即用。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
