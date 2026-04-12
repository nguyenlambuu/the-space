import type { MetadataRoute } from 'next'
import { getCollections, getAllLooks } from './lib/supabase'

const SITE_URL = 'https://trinhchau.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, { looks }] = await Promise.all([
    getCollections(),
    getAllLooks('', 1, 1000),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/about`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/seasons`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/works`, priority: 0.8, changeFrequency: 'weekly' },
  ]

  const seasonRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/seasons/${c.slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }))

  const workRoutes: MetadataRoute.Sitemap = looks.map((l) => ({
    url: `${SITE_URL}/works/${l.id}`,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
  }))

  return [...staticRoutes, ...seasonRoutes, ...workRoutes]
}
