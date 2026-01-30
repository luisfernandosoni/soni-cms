import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

export default defineCloudflareConfig({
  build: {
    external: ['typescript', 'drizzle-kit', 'drizzle-kit/api', 'sharp', 'graphql'],
  },
} as any)
