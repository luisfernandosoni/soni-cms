import type { Endpoint } from 'payload'

/**
 * Publish Scheduled Transmissions
 * 
 * This endpoint is called by Cloudflare Cron Triggers to publish
 * transmissions that are scheduled for the current time or earlier.
 * 
 * Security: Protected by API_SECRET header
 * Trigger: Cloudflare Cron (every 10 minutes)
 */
export const publishScheduledEndpoint: Endpoint = {
  path: '/publish-scheduled',
  method: 'post',
  handler: async (req) => {
    const payload = req.payload

    // Verify API secret
    const secret = req.headers.get('x-api-secret')
    const expectedSecret = process.env.API_SECRET

    if (!expectedSecret) {
      payload.logger.error('API_SECRET not configured')
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      // Find all draft transmissions where publishedAt is in the past
      const now = new Date()

      const scheduledPosts = await payload.find({
        collection: 'transmissions',
        where: {
          and: [
            { status: { equals: 'draft' } },
            { publishedAt: { less_than_equal: now.toISOString() } },
            { publishedAt: { exists: true } },
          ],
        },
        limit: 100, // Safety limit
        depth: 0,
      })

      if (scheduledPosts.totalDocs === 0) {
        return Response.json({
          success: true,
          message: 'No scheduled posts to publish',
          published: 0,
        })
      }

      // Publish each scheduled post
      const publishedIds: string[] = []
      const errors: Array<{ id: string; error: string }> = []

      for (const post of scheduledPosts.docs) {
        try {
          await payload.update({
            collection: 'transmissions',
            id: String(post.id),
            data: {
              status: 'published',
            },
          })
          publishedIds.push(String(post.id))
          payload.logger.info(`Published scheduled transmission: ${post.id}`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          errors.push({ id: String(post.id), error: errorMessage })
          payload.logger.error(`Failed to publish ${post.id}: ${errorMessage}`)
        }
      }

      return Response.json({
        success: true,
        message: `Published ${publishedIds.length} transmissions`,
        published: publishedIds.length,
        publishedIds,
        errors: errors.length > 0 ? errors : undefined,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`Scheduled publish failed: ${errorMessage}`)

      return Response.json(
        { error: 'Internal server error', details: errorMessage },
        { status: 500 }
      )
    }
  },
}
