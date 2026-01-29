// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config'

export default defineCloudflareConfig({
  build: {
    external: ['typescript', 'drizzle-kit', 'sharp'],
  },
} as any)
