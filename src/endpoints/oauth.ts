/**
 * Google OAuth Endpoints
 * 
 * Implements OAuth 2.0 Authorization Code flow for Google.
 * Works on both localhost:3000 (dev) and soninewmedia.com (production).
 */
import type { Endpoint, PayloadRequest } from 'payload'
import { createHash } from 'crypto'
import { SignJWT } from 'jose'

// Google OAuth URLs
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

/**
 * Generate a Payload-compatible JWT token
 * Payload hashes PAYLOAD_SECRET with SHA-256 and uses first 32 chars
 */
async function generatePayloadToken(userId: string | number, email: string): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET not set')
  
  // Payload's secret processing: SHA-256 hash, first 32 chars
  const hashedSecret = createHash('sha256').update(secret).digest('hex').slice(0, 32)
  const secretKey = new TextEncoder().encode(hashedSecret)
  
  const token = await new SignJWT({
    id: userId,
    email,
    collection: 'users',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey)
  
  return token
}

/**
 * Get the base URL dynamically based on environment
 */
function getBaseUrl(req: PayloadRequest): string {
  // Try headers first (for production behind proxy)
  const host = req.headers?.get?.('host') || req.headers?.get?.('x-forwarded-host')
  const protocol = req.headers?.get?.('x-forwarded-proto') || 'https'
  
  if (host) {
    return `${protocol}://${host}`
  }
  
  // Fallback to env variable
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

/**
 * Get OAuth credentials from environment
 */
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables')
  }
  
  return { clientId, clientSecret }
}

/**
 * GET /api/oauth/google
 * Initiates the OAuth flow by redirecting to Google
 */
export const googleLoginEndpoint: Endpoint = {
  path: '/oauth/google',
  method: 'get',
  handler: async (req) => {
    const { clientId } = getGoogleCredentials()
    const baseUrl = getBaseUrl(req)
    const redirectUri = `${baseUrl}/api/oauth/google/callback`
    
    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    })
    
    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`
    
    return Response.redirect(authUrl, 302)
  },
}

/**
 * GET /api/oauth/google/callback
 * Handles the OAuth callback from Google
 */
export const googleCallbackEndpoint: Endpoint = {
  path: '/oauth/google/callback',
  method: 'get',
  handler: async (req) => {
    const payload = req.payload
    const url = new URL(req.url || '', 'http://localhost')
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    
    const baseUrl = getBaseUrl(req)
    const redirectUri = `${baseUrl}/api/oauth/google/callback`
    
    // Handle errors from Google
    if (error) {
      payload.logger.error(`Google OAuth error: ${error}`)
      return Response.redirect(`${baseUrl}/admin/login?error=oauth_denied`, 302)
    }
    
    if (!code) {
      return Response.redirect(`${baseUrl}/admin/login?error=no_code`, 302)
    }
    
    try {
      const { clientId, clientSecret } = getGoogleCredentials()
      
      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      })
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        payload.logger.error(`Token exchange failed: ${errorData}`)
        return Response.redirect(`${baseUrl}/admin/login?error=token_exchange_failed`, 302)
      }
      
      const tokens = await tokenResponse.json() as { access_token: string }
      
      // Fetch user info from Google
      const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      
      if (!userInfoResponse.ok) {
        payload.logger.error('Failed to fetch user info from Google')
        return Response.redirect(`${baseUrl}/admin/login?error=userinfo_failed`, 302)
      }
      
      const googleUser = await userInfoResponse.json() as {
        id: string
        email: string
        name: string
        picture: string
      }
      
      // Find or create user in Payload
      const existingUsers = await payload.find({
        collection: 'users',
        where: { email: { equals: googleUser.email } },
        limit: 1,
      })
      
      let user = existingUsers.docs[0]
      
      if (!user) {
        // Create new user with Google data
        user = await payload.create({
          collection: 'users',
          data: {
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split('@')[0],
            password: crypto.randomUUID(), // Random password (won't be used)
            roles: ['editor'], // Default role for OAuth users
          },
        })
        payload.logger.info(`Created new user via Google OAuth: ${googleUser.email}`)
      }
      
      // Generate a session token for the user using our custom JWT generator
      const token = await generatePayloadToken(user.id, user.email)
      
      // Create redirect response with auth cookie
      const isSecure = baseUrl.startsWith('https')
      const cookieValue = `payload-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200${isSecure ? '; Secure' : ''}`
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${baseUrl}/admin`,
          'Set-Cookie': cookieValue,
        },
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`Google OAuth callback error: ${errorMessage}`)
      return Response.redirect(`${baseUrl}/admin/login?error=oauth_error`, 302)
    }
  },
}

/**
 * Export all OAuth endpoints
 */
export const oauthEndpoints = [googleLoginEndpoint, googleCallbackEndpoint]
