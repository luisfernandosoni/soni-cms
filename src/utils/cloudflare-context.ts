import {
  CloudflareContext,
  getCloudflareContext as getOpenNextContext,
} from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'

// Helper to check for local dev conditions
const isProduction = process.env.NODE_ENV === 'production'
const isBuild =
  process.env.NEXT_PHASE === 'phase-production-build' || 
  process.argv.includes('build')

// CLI detection without static fs import
const isCLI = !isProduction && !isBuild && typeof process !== 'undefined' && 
  process.argv && process.argv.some(val => val.includes('payload'))

/**
 * Retrieves the Cloudflare Context safely across environments.
 * - In Production (Edge Runtime): Uses OpenNext's AsyncLocalStorage via getOpenNextContext.
 * - In Node.js (CLI, Migrations, Local Dev): Spins up Wrangler Platform Proxy.
 */
export async function getSafeCloudflareContext(): Promise<CloudflareContext> {
  // Detection for Node.js vs Edge Runtime
  // In Node.js, we MUST use Wrangler Platform Proxy to access bindings.
  const isNode = typeof process !== 'undefined' && process.release?.name === 'node'
  
  if (isNode || isCLI || isBuild) {
    return getCloudflareContextFromWrangler()
  }

  // In production (Edge), we assume we are inside a request
  return getOpenNextContext({ async: true })
}

// Adapted from Cloudflare documentation and OpenNext examples for handling local dev
async function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  // Dynamic import to avoid bundling Wrangler in the Edge worker
  const wranglerModule = await import(/* webpackIgnore: true */ 'wrangler')

  return (await wranglerModule.getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV,
    remoteBindings: isProduction && !isBuild, 
    persist: true, 
  } satisfies GetPlatformProxyOptions)) as unknown as CloudflareContext
}
