import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimRyoko eSIM - 全球旅行eSIM服务",
  description: "SimRyoko提供覆盖200+国家和地区的eSIM流量套餐，即买即用，无需换卡，让您的旅途畅享网络。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
