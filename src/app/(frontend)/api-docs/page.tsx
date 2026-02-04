import { ApiReference } from '@scalar/nextjs-api-reference'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Reference | Soni CMS',
  description: 'Technical documentation for Soni CMS API endpoints',
}

export default function ApiDocs() {
  return (
    <ApiReference
      configuration={{
        spec: {
          url: '/api/openapi.json', // We will generate/expose this
        },
        theme: 'violet',
        layout: 'modern',
      }}
    />
  )
}
