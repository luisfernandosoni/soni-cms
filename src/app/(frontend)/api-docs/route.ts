import { ApiReference } from '@scalar/nextjs-api-reference'

/**
 * Soni CMS API Documentation (Scalar)
 * Skills: clean-code, typescript-expert, backend-architect
 */
export const GET = ApiReference({
  spec: {
    url: '/api/openapi.json',
  },
  theme: 'violet',
  layout: 'modern',
  // Standard Silicon Valley Branding
  customCss: `
    :root {
      --scalar-color-1: #6d28d9;
      --scalar-color-accent: #7c3aed;
    }
  `,
})
