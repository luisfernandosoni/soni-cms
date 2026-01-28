import type { CollectionAfterChangeHook } from 'payload'

/**
 * Purge Cloudflare CDN Cache
 * 
 * Called after a Transmission is created/updated/published
 * to invalidate the CDN cache for that content.
 */
export const purgeCacheAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  const { payload } = req

  // Only purge on update or create when published
  if (doc.status !== 'published') {
    return doc
  }

  const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
  const SITE_URL = process.env.SITE_URL || 'https://soninewmedia.com'

  // Skip if credentials not configured
  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
    payload.logger.warn('Cache purge skipped: Cloudflare credentials not configured')
    return doc
  }

  // URLs to purge
  const urlsToPurge = [
    `${SITE_URL}/transmission/${doc.slug}`,
    `${SITE_URL}/`, // Homepage (likely shows recent posts)
    `${SITE_URL}/transmissions`, // List page
  ]

  // If category exists, purge category page
  if (doc.category) {
    const categorySlug = typeof doc.category === 'object' ? doc.category.slug : null
    if (categorySlug) {
      urlsToPurge.push(`${SITE_URL}/category/${categorySlug}`)
    }
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: urlsToPurge,
        }),
      }
    )

    const result = await response.json() as { success: boolean; errors?: unknown[] }

    if (result.success) {
      payload.logger.info(`Cache purged for: ${doc.slug}`)
    } else {
      payload.logger.error(`Cache purge failed: ${JSON.stringify(result.errors)}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Cache purge error: ${errorMessage}`)
  }

  return doc
}
