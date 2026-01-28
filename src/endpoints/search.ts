import type { Endpoint } from 'payload'

/**
 * Search Transmissions
 * 
 * Basic full-text search across transmissions.
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

    if (!query || query.length < 2) {
      return Response.json({
        docs: [],
        totalDocs: 0,
        message: 'Query must be at least 2 characters',
      })
    }

    try {
      // Search across title, excerpt, and content
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
        depth: 1, // Include related author/category
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
