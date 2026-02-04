import type { MetadataRoute } from 'next'

/**
 * Robots.txt Generator (S+ Standard)
 * 
 * Skills used: seo-fundamentals, seo-audit
 * - Ensures crawlability of public content
 * - Restricts access to sensitive admin areas
 * - Provides explicit sitemap linkage
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.soninewmedia.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/_next',
        '/static',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
