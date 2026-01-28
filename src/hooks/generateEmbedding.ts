import type { CollectionAfterChangeHook } from 'payload'

/**
 * Generate Embedding Hook
 * 
 * After a Transmission is created or updated, this hook generates a vector
 * embedding using Cloudflare Workers AI and stores it in Vectorize for
 * semantic search capabilities.
 * 
 * Uses the @cf/baai/bge-base-en-v1.5 model (768 dimensions)
 */
export const generateEmbedding: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only generate embeddings for published transmissions
  if (doc.status !== 'published' || req.context?.disableEmbedding) {
    return doc
  }

  const { payload } = req

  try {
    // Get Cloudflare bindings from the request context
    // @ts-expect-error - Cloudflare bindings are injected at runtime
    const AI = req.context?.cloudflare?.env?.AI
    // @ts-expect-error - Cloudflare bindings are injected at runtime
    const VECTORIZE = req.context?.cloudflare?.env?.VECTORIZE

    if (!AI || !VECTORIZE) {
      payload.logger.warn('AI or VECTORIZE bindings not available. Skipping embedding generation.')
      return doc
    }

    // Prepare text for embedding (title + excerpt + first 500 chars of content)
    const contentText = doc.excerpt || ''
    const textToEmbed = `${doc.title}. ${contentText}`.slice(0, 1000)

    // Generate embedding using Workers AI
    const embeddingResponse = await AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [textToEmbed],
    })

    if (!embeddingResponse?.data?.[0]) {
      payload.logger.error('Failed to generate embedding: No data returned')
      return doc
    }

    const embedding = embeddingResponse.data[0]

    // Upsert vector to Vectorize index
    await VECTORIZE.upsert([
      {
        id: String(doc.id),
        values: embedding,
        metadata: {
          title: doc.title,
          slug: doc.slug,
          status: doc.status,
          category: typeof doc.category === 'object' ? doc.category?.slug : null,
          publishedAt: doc.publishedAt,
        },
      },
    ])

    payload.logger.info(`Generated embedding for transmission: ${doc.title} (${operation})`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Embedding generation failed: ${errorMessage}`)
    // Don't block the save operation on embedding failure
  }

  return doc
}

/**
 * Delete Embedding Hook
 * 
 * When a Transmission is deleted, remove its embedding from Vectorize.
 */
export const deleteEmbedding: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const { payload } = req

  try {
    // @ts-expect-error - Cloudflare bindings are injected at runtime
    const VECTORIZE = req.context?.cloudflare?.env?.VECTORIZE

    if (!VECTORIZE) {
      return doc
    }

    await VECTORIZE.deleteByIds([String(doc.id)])
    payload.logger.info(`Deleted embedding for transmission: ${doc.id}`)
  } catch (error) {
    payload.logger.error(`Failed to delete embedding: ${error}`)
  }

  return doc
}
