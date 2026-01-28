import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { resendAdapter } from '@payloadcms/email-resend'

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

// Components
// import StatsWidget from './components/Dashboard/StatsWidget'
// import QuickActions from './components/Dashboard/QuickActions'
// import RecentTransmissions from './components/Dashboard/RecentTransmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) =>
  realpath(value)?.endsWith(path.join('payload', 'bin.js')),
)
const isProduction = process.env.NODE_ENV === 'production'

const isBuild =
  process.argv.includes('build') || process.env.NEXT_PHASE === 'phase-production-build'
const cloudflare =
  isCLI || isBuild || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
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
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  email: resendAdapter({
    defaultFromName: 'Soni CMS',
    defaultFromAddress: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    apiKey: process.env.RESEND_API_KEY || process.env['soni-blog-mail'] || '',
  }),
  plugins: [
    r2Storage({
      bucket: (process.env.R2 || cloudflare?.env?.R2) as any,
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

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
