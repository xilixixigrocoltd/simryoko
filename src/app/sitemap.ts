import { MetadataRoute } from 'next'
import { allCountries } from '@/data/countries'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://simryoko.com'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog/esim-travel-guide-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const countryPages: MetadataRoute.Sitemap = allCountries.map(c => ({
    url: `${baseUrl}/esim/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: c.popular ? 0.9 : 0.7,
  }))

  return [...staticPages, ...countryPages]
}
