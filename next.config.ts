import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: [
    'typescript',
    'drizzle-kit',
    'drizzle-kit/api',
    'sharp',
    'graphql',
    '@resvg/resvg-wasm',
    '@resvg/resvg-js',
    '@vercel/og',  // Exclude OG image generation to avoid WASM bundling issues
    'next/og',     // Exclude Next.js OG wrapper as well
  ],

  // Your Next.js config here
  images: {
    unoptimized: true,
  },
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
