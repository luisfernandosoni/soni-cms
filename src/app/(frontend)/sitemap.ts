import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Dynamic Sitemap Generator (S+ Standard)
 * 
 * Skills used: seo-fundamentals, database-design
 * - Generates indexed entry points for all published transmissions
 * - Ensures fresh indexing of new content
 * - Adheres to frequency and priority best practices
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.soninewmedia.com'
  
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Fetch all published transmissions
    const { docs: transmissions } = await payload.find({
      collection: 'transmissions',
      where: {
        status: { equals: 'published' },
      },
      limit: 1000,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const transmissionEntries: MetadataRoute.Sitemap = (transmissions || []).map((t) => ({
      url: `${baseUrl}/transmission/${t.slug}`,
      lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...transmissionEntries,
    ]
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    // Return at least the base URL to prevent build failure
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
