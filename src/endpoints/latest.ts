/**
 * Latest Transmissions Endpoint
 *
 * Returns the 3 most recent published transmissions for homepage preview.
 * Includes CORS headers for cross-origin fetch from main Soni-New-Media site.
 */

import type { PayloadHandler } from 'payload'

export const latestTransmissionsEndpoint: PayloadHandler = async (req) => {
  const { payload } = req

  try {
    const transmissions = await payload.find({
      collection: 'transmissions',
      where: { status: { equals: 'published' } },
      limit: 3,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        excerpt: true,
        heroImage: true,
        category: true,
        publishedAt: true,
      },
      depth: 1, // Include related heroImage and category data
    })

    // CORS headers for cross-origin requests from soninewmedia.com
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=60, s-maxage=300', // 1min client, 5min edge
    }

    return Response.json(
      {
        success: true,
        docs: transmissions.docs,
        totalDocs: transmissions.totalDocs,
      },
      { headers }
    )
  } catch (error) {
    // Log more details for debugging with structured context
    console.error(`[OBSERVABILITY] Failed to fetch latest transmissions. Reason: ${error instanceof Error ? error.message : 'Unknown'}`, {
      timestamp: new Date().toISOString(),
      collection: 'transmissions',
      action: 'fetch_latest',
    })
    
    return Response.json(
      { 
        success: false, 
        error: 'System encountered a transmission error. Our engineers have been notified.',
        code: 'TRANSMISSIONS_FETCH_FAILED'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

// Endpoint configuration for Payload
export const latestEndpointConfig = {
  path: '/transmissions/latest',
  method: 'get' as const,
  handler: latestTransmissionsEndpoint,
}
