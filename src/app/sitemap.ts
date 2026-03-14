import { MetadataRoute } from 'next'

const countries = [
  { slug: 'japan', zh: '日本', en: 'Japan', ja: '日本' },
  { slug: 'south-korea', zh: '韩国', en: 'South Korea', ja: '韓国' },
  { slug: 'thailand', zh: '泰国', en: 'Thailand', ja: 'タイ' },
  { slug: 'united-states', zh: '美国', en: 'United States', ja: 'アメリカ' },
  { slug: 'united-kingdom', zh: '英国', en: 'United Kingdom', ja: 'イギリス' },
  { slug: 'france', zh: '法国', en: 'France', ja: 'フランス' },
  { slug: 'germany', zh: '德国', en: 'Germany', ja: 'ドイツ' },
  { slug: 'italy', zh: '意大利', en: 'Italy', ja: 'イタリア' },
  { slug: 'spain', zh: 'スペイン', en: 'Spain', ja: 'スペイン' },
  { slug: 'australia', zh: '澳大利亚', en: 'Australia', ja: 'オーストラリア' },
  { slug: 'singapore', zh: '新加坡', en: 'Singapore', ja: 'シンガポール' },
  { slug: 'malaysia', zh: '马来西亚', en: 'Malaysia', ja: 'マレーシア' },
  { slug: 'indonesia', zh: '印度尼西亚', en: 'Indonesia', ja: 'インドネシア' },
  { slug: 'vietnam', zh: '越南', en: 'Vietnam', ja: 'ベトナム' },
  { slug: 'philippines', zh: '菲律宾', en: 'Philippines', ja: 'フィリピン' },
  { slug: 'taiwan', zh: '台湾', en: 'Taiwan', ja: '台湾' },
  { slug: 'hong-kong', zh: '香港', en: 'Hong Kong', ja: '香港' },
  { slug: 'macau', zh: '澳门', en: 'Macau', ja: 'マカオ' },
  { slug: 'india', zh: '印度', en: 'India', ja: 'インド' },
  { slug: 'turkey', zh: '土耳其', en: 'Turkey', ja: 'トルコ' },
  { slug: 'egypt', zh: '埃及', en: 'Egypt', ja: 'エジプト' },
  { slug: 'south-africa', zh: '南非', en: 'South Africa', ja: '南アフリカ' },
  { slug: 'brazil', zh: '巴西', en: 'Brazil', ja: 'ブラジル' },
  { slug: 'mexico', zh: '墨西哥', en: 'Mexico', ja: 'メキシコ' },
  { slug: 'canada', zh: '加拿大', en: 'Canada', ja: 'カナダ' },
  { slug: 'new-zealand', zh: '新西兰', en: 'New Zealand', ja: 'ニュージーランド' },
  { slug: 'uae', zh: '阿联酋', en: 'UAE', ja: 'UAE' },
  { slug: 'qatar', zh: '卡塔尔', en: 'Qatar', ja: 'カタール' },
  { slug: 'saudi-arabia', zh: '沙特阿拉伯', en: 'Saudi Arabia', ja: 'サウジアラビア' },
  { slug: 'russia', zh: '俄罗斯', en: 'Russia', ja: 'ロシア' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://simryoko.com'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const countryPages: MetadataRoute.Sitemap = countries.map(c => ({
    url: `${baseUrl}/esim/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...countryPages]
}
