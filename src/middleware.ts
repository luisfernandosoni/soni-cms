import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Intelligent Cache Headers Middleware (Cloudflare-Native)
 * 
 * Skills: backend-architect, clean-code, security-auditor
 * 
 * NOTE: Rate Limiting is now enforced via Cloudflare WAF Rules at the edge.
 * This middleware focuses solely on caching strategies.
 * 
 * @see https://developers.cloudflare.com/waf/rate-limiting-rules/
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bypass all processing for Media uploads to prevent Stream Locking
  if (pathname === '/api/media' && request.method === 'POST') {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // Admin routes - never cache
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    return response
  }

  // API routes - apply caching strategies
  if (pathname.startsWith('/api/')) {
    // Don't cache mutation endpoints
    if (request.method !== 'GET') {
      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    // Search endpoint - short cache
    if (pathname.startsWith('/api/search')) {
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
      return response
    }

    // Transmissions API - medium cache
    if (pathname.startsWith('/api/transmissions')) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600')
      return response
    }

    // Static taxonomy data - long cache
    if (
      pathname.startsWith('/api/categories') ||
      pathname.startsWith('/api/tags') ||
      pathname.startsWith('/api/authors')
    ) {
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600')
      return response
    }

    // Default API cache
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    return response
  }

  // Media/Assets - immutable cache
  if (
    pathname.startsWith('/media/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm)$/i)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return response
  }

  return response
}


export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
    // Match admin routes
    '/admin/:path*',
    // Match media
    '/media/:path*',
  ],
}
