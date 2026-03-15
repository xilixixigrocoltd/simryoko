import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4361ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2252" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "SimRyoko eSIM - 全球旅行eSIM流量套餐 | 200+国家即买即用",
    template: "%s | SimRyoko eSIM",
  },
  description: "SimRyoko提供覆盖200+国家和地区的eSIM流量套餐，即买即用，无需换卡。日本、韩国、泰国、美国、欧洲eSIM低至$3.99起，5分钟激活上网。",
  keywords: ["eSIM", "旅行eSIM", "国际流量", "出国上网", "日本eSIM", "韩国eSIM", "泰国eSIM", "美国eSIM", "欧洲eSIM", "SimRyoko", "eSIM购买", "travel eSIM", "海外上网卡"],
  metadataBase: new URL("https://simryoko.com"),
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/",
      "en": "/en",
      "ja": "/ja",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US", "ja_JP"],
    url: "https://simryoko.com",
    siteName: "SimRyoko eSIM",
    title: "SimRyoko eSIM - 全球旅行eSIM流量套餐 | 200+国家即买即用",
    description: "覆盖200+国家和地区的eSIM流量套餐，即买即用，无需换卡，低至$3.99起。",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SimRyoko eSIM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SimRyoko eSIM - 全球旅行eSIM",
    description: "200+国家eSIM流量套餐，即买即用",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SimRyoko" />
        <link rel="alternate" hrefLang="zh-CN" href="https://simryoko.com" />
        <link rel="alternate" hrefLang="en" href="https://simryoko.com/en" />
        <link rel="alternate" hrefLang="ja" href="https://simryoko.com/ja" />
        <link rel="alternate" hrefLang="x-default" href="https://simryoko.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SimRyoko",
              url: "https://simryoko.com",
              description: "全球旅行eSIM流量套餐服务商，覆盖200+国家和地区",
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USD",
                lowPrice: "3.99",
                highPrice: "68.00",
                offerCount: "200+",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
