/**
 * Transmissions Types
 * Types for CMS integration with Payload CMS
 */

export interface TransmissionPreview {
  id: number
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  heroImage: {
    url: string
    alt_text?: string
  } | null
  category: {
    id: number
    title: string
    slug: string
  } | null
}

export interface TransmissionsResponse {
  success: boolean
  docs: TransmissionPreview[]
  totalDocs: number
}
