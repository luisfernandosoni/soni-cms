import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Rate Limiting Configuration
 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // 100 requests per window

// In-memory store for rate limiting (resets on worker cold start)
// For production, consider using Cloudflare KV or Durable Objects
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const cfIP = request.headers.get('cf-connecting-ip')
  const xForwardedFor = request.headers.get('x-forwarded-for')
  const xRealIP = request.headers.get('x-real-ip')
  
  return cfIP || xForwardedFor?.split(',')[0]?.trim() || xRealIP || 'unknown'
}

/**
 * Check if request is rate limited
 */
function isRateLimited(ip: string): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(ip)
  
  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }
  
  if (!record || record.resetTime < now) {
    // New window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW_MS }
  }
  
  record.count++
  
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true, remaining: 0, resetTime: record.resetTime }
  }
  
  return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetTime: record.resetTime }
}

/**
 * Intelligent Cache Headers & Rate Limiting Middleware
 * 
 * Applies optimal caching strategies based on route type:
 * - Public API routes: Edge-cached with stale-while-revalidate + rate limiting
 * - Admin routes: Private, no-cache
 * - Media/Assets: Long-lived edge cache
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Admin routes - never cache, skip rate limiting
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    return response
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const clientIP = getClientIP(request)
    const { limited, remaining, resetTime } = isRateLimited(clientIP)
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS))
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)))
    
    if (limited) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          },
        }
      )
    }

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

    // Other public API - moderate cache
    if (pathname.startsWith('/api/categories') || pathname.startsWith('/api/tags') || pathname.startsWith('/api/authors')) {
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600')
      return response
    }

    // Default API cache
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    return response
  }

  // Media/Assets - long-lived cache
  if (pathname.startsWith('/media/') || pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm)$/i)) {
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
