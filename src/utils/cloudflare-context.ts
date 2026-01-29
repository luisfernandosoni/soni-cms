import {
  CloudflareContext,
  getCloudflareContext as getOpenNextContext,
} from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import fs from 'fs'
import path from 'path'

// Helper to check for local dev conditions
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)
const isCLI = process.argv.some((value) =>
  realpath(value)?.endsWith(path.join('payload', 'bin.js')),
)
const isProduction = process.env.NODE_ENV === 'production'
const isBuild =
  process.argv.includes('build') || process.env.NEXT_PHASE === 'phase-production-build'

/**
 * Retrieves the Cloudflare Context safely across environments.
 * - In Production (Edge): Uses OpenNext's AsyncLocalStorage.
 * - In Development (Node): Spins up Wrangler Platform Proxy to emulate bindings.
 */
export async function getSafeCloudflareContext(): Promise<CloudflareContext> {
  if (isCLI || isBuild || !isProduction) {
    return getCloudflareContextFromWrangler()
  }
  // In production, we assume we are inside a request
  return getOpenNextContext({ async: true })
}

// Adapted from Cloudflare documentation and OpenNext examples for handling local dev
async function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  // Dynamic import to avoid bundling Wrangler in the Edge worker
  const wranglerModule = await import(/* webpackIgnore: true */ 'wrangler')

  return wranglerModule.getPlatformProxy({
    environment: process.env.CLOUDFLARE_ENV,
    remoteBindings: isProduction && !isBuild, // Only use remote bindings if specifically needed
    persist: true, // Persist local D1 state
  } satisfies GetPlatformProxyOptions)
}
