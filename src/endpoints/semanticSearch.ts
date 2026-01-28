import type { Endpoint } from 'payload'

/**
 * Semantic Search Endpoint
 * 
 * Uses Cloudflare Workers AI to generate query embeddings and Vectorize
 * to find semantically similar transmissions.
 * 
 * GET /api/semantic-search?q=your+query&limit=10
 * 
 * Returns transmissions ranked by semantic similarity to the query.
 */
export const semanticSearchEndpoint: Endpoint = {
  path: '/semantic-search',
  method: 'get',
  handler: async (req) => {
    const { payload, query } = req

    // Get search query
    const searchQuery = query?.q as string
    const limit = Math.min(Number(query?.limit) || 10, 50)

    if (!searchQuery || searchQuery.trim().length < 2) {
      return Response.json(
        { error: 'Query parameter "q" is required (min 2 characters)' },
        { status: 400 }
      )
    }

    try {
      // Get Cloudflare bindings
      // @ts-expect-error - Cloudflare bindings are injected at runtime
      const AI = req.context?.cloudflare?.env?.AI
      // @ts-expect-error - Cloudflare bindings are injected at runtime
      const VECTORIZE = req.context?.cloudflare?.env?.VECTORIZE

      if (!AI || !VECTORIZE) {
        // Fallback to basic text search if AI/Vectorize not available
        payload.logger.warn('AI/Vectorize not available, falling back to text search')
        
        const results = await payload.find({
          collection: 'transmissions',
          where: {
            and: [
              { status: { equals: 'published' } },
              {
                or: [
                  { title: { contains: searchQuery } },
                  { excerpt: { contains: searchQuery } },
                ],
              },
            ],
          },
          limit,
          depth: 1,
        })

        return Response.json({
          mode: 'text',
          query: searchQuery,
          docs: results.docs,
          totalDocs: results.totalDocs,
        })
      }

      // Generate embedding for the search query
      const embeddingResponse = await AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [searchQuery],
      })

      if (!embeddingResponse?.data?.[0]) {
        return Response.json(
          { error: 'Failed to generate query embedding' },
          { status: 500 }
        )
      }

      const queryEmbedding = embeddingResponse.data[0]

      // Search Vectorize for similar vectors
      const vectorResults = await VECTORIZE.query(queryEmbedding, {
        topK: limit,
        returnMetadata: true,
        filter: {
          status: { $eq: 'published' },
        },
      })

      if (!vectorResults?.matches?.length) {
        return Response.json({
          mode: 'semantic',
          query: searchQuery,
          docs: [],
          totalDocs: 0,
        })
      }

      // Get full transmission docs by IDs
      const ids = vectorResults.matches.map((m: any) => m.id)
      
      const transmissions = await payload.find({
        collection: 'transmissions',
        where: {
          id: { in: ids },
        },
        depth: 2,
      })

      // Sort by vector similarity score and add score to response
      const scoredDocs = vectorResults.matches.map((match: any) => {
        const doc = transmissions.docs.find((d) => String(d.id) === match.id)
        return {
          ...doc,
          _score: match.score,
        }
      }).filter(Boolean)

      return Response.json({
        mode: 'semantic',
        query: searchQuery,
        docs: scoredDocs,
        totalDocs: scoredDocs.length,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`Semantic search failed: ${errorMessage}`)
      
      return Response.json(
        { error: 'Semantic search failed', message: errorMessage },
        { status: 500 }
      )
    }
  },
}
