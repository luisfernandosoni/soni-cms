import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { resendAdapter } from '@payloadcms/email-resend'
import { r2Storage } from '@payloadcms/storage-r2'
import { seoPlugin } from '@payloadcms/plugin-seo'

// Lazy Binding Utilities
import { getLazyD1, getLazyR2 } from './utils/cloudflare-lazy-bindings'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Transmissions } from './collections/Transmissions'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'

// Endpoints
import {
  publishScheduledEndpoint,
  searchEndpoint,
  semanticSearchEndpoint,
  oauthEndpoints,
  latestEndpointConfig,
} from './endpoints'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'


export default buildConfig({
  debug: !isProduction, // Mask verbose errors in production
  sharp: undefined,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.soninewmedia.com',
  // NOTE: Rate Limiting is enforced via Cloudflare WAF Rules at the edge.
  // @see https://developers.cloudflare.com/waf/rate-limiting-rules/
  csrf: [
    'https://soninewmedia.com',
    'https://www.soninewmedia.com',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
  ],
  cors: [
    'https://soninewmedia.com',
    'https://www.soninewmedia.com',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Soni CMS',
    },
    components: {
      afterDashboard: [
        './components/Dashboard/StatsWidget.tsx',
        './components/Dashboard/QuickActions.tsx',
        './components/Dashboard/RecentTransmissions.tsx',
      ],
    },
  },
  collections: [
    // Content
    Transmissions,
    Authors,
    // Taxonomy
    Categories,
    Tags,
    // System
    Users,
    Media,
  ],
  editor: lexicalEditor(),
  // SECRET NOTE: Accessing PAYLOAD_SECRET via process.env is safer at init time.
  // We check for both uppercase (standard) and lowercase (user provided) variants.
  secret: process.env.PAYLOAD_SECRET || process.env.payload_secret || 'ERROR_NO_SECRET',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Use Lazy Binding for D1
  db: sqliteD1Adapter({
    binding: getLazyD1('D1'),
  }),
  email: resendAdapter({
    defaultFromName: 'Soni CMS',
    defaultFromAddress: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    // We can assume env vars are available or handle lazily if the adapter supports it,
    // but typically string config must be synchronous.
    apiKey: process.env.RESEND_API_KEY || process.env['soni-blog-mail'] || '',
  }),
  plugins: [
    r2Storage({
      // Use Lazy Binding for R2
      // NOTE: Using 'as any' here is a mandatory 'Pragmatic Bridge'.
      // There is a minor type-definition mismatch between @cloudflare/workers-types and @payloadcms/storage-r2
      // regarding the R2Range interface (optional vs required length). 
      // Our Hardened Proxy runtime handles all calls safely.
      bucket: getLazyR2('R2') as any,
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename, prefix }) => {
            // Use custom CDN domain for production media URLs
            return `https://cdn.soninewmedia.com/${prefix}/${filename}`
          },
        },
      },
    }),
    seoPlugin({
      collections: ['transmissions'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const title = (doc as any)?.title
        return title ? `${title} | Soni New Media` : 'Soni New Media'
      },
      generateDescription: ({ doc }) => {
        const excerpt = (doc as any)?.excerpt
        return excerpt || 'A transmission from Soni New Media'
      },
      generateURL: ({ doc }) => {
        const slug = (doc as any)?.slug
        return slug ? `https://soninewmedia.com/transmission/${slug}` : 'https://soninewmedia.com'
      },
    }),
  ],
  endpoints: [
    publishScheduledEndpoint,
    searchEndpoint,
    semanticSearchEndpoint,
    latestEndpointConfig,
    ...oauthEndpoints,
  ],
})
