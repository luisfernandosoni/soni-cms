import type { Endpoint } from 'payload'

/**
 * Search Transmissions (FTS5 Optimized)
 * 
 * Uses D1's FTS5 full-text search for blazing fast queries.
 * Falls back to basic LIKE query if FTS5 table doesn't exist.
 * 
 * GET /api/search?q=query&limit=10
 */
export const searchEndpoint: Endpoint = {
  path: '/search',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload
    const url = new URL(req.url || '', 'http://localhost')
    const query = url.searchParams.get('q')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50)
    const page = parseInt(url.searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    if (!query || query.length < 2) {
      return Response.json({
        docs: [],
        totalDocs: 0,
        message: 'Query must be at least 2 characters',
      })
    }

    try {
      // Get D1 binding from Cloudflare context
      // @ts-expect-error - Cloudflare bindings injected at runtime
      const D1 = req.context?.cloudflare?.env?.D1

      if (D1) {
        // Try FTS5 search first (fastest)
        try {
          const ftsQuery = query.replace(/[^\w\s]/g, ' ').trim() + '*' // Sanitize and add prefix matching
          
          const ftsResults = await D1.prepare(`
            SELECT t.id, t.title, t.slug, t.excerpt, t.hero_image, t.author, t.category, t.published_at
            FROM transmissions_fts fts
            JOIN transmissions t ON t.id = fts.rowid
            WHERE transmissions_fts MATCH ?
              AND t.status = 'published'
            ORDER BY rank
            LIMIT ? OFFSET ?
          `).bind(ftsQuery, limit, offset).all()

          const countResult = await D1.prepare(`
            SELECT COUNT(*) as total
            FROM transmissions_fts fts
            JOIN transmissions t ON t.id = fts.rowid
            WHERE transmissions_fts MATCH ?
              AND t.status = 'published'
          `).bind(ftsQuery).first()

          const totalDocs = countResult?.total || 0
          const totalPages = Math.ceil(totalDocs / limit)

          return Response.json({
            mode: 'fts5',
            docs: ftsResults.results || [],
            totalDocs,
            totalPages,
            page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          })
        } catch (ftsError) {
          // FTS5 table may not exist, fall through to basic search
          payload.logger.warn('FTS5 search failed, falling back to basic search')
        }
      }

      // Fallback: Basic LIKE search via Payload
      const results = await payload.find({
        collection: 'transmissions',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { title: { contains: query } },
                { excerpt: { contains: query } },
                { slug: { contains: query } },
              ],
            },
          ],
        },
        limit,
        page,
        depth: 1,
        select: {
          title: true,
          slug: true,
          excerpt: true,
          heroImage: true,
          author: true,
          category: true,
          publishedAt: true,
        },
      })

      return Response.json({
        mode: 'basic',
        docs: results.docs,
        totalDocs: results.totalDocs,
        totalPages: results.totalPages,
        page: results.page,
        hasNextPage: results.hasNextPage,
        hasPrevPage: results.hasPrevPage,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`Search failed: ${errorMessage}`)

      return Response.json(
        { error: 'Search failed', details: errorMessage },
        { status: 500 }
      )
    }
  },
}

