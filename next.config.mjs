/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Vercel 标准服务器模式 - 支持 API Routes / SSR / ISR
  output: 'standalone',
  distDir: '.next',
  // 图片优化配置
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.xigrocoltd.com' },
    ],
  },
  // 重定向规则
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
