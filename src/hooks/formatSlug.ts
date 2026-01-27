import type { FieldHook } from 'payload'

/**
 * Format Slug Hook
 * Auto-generates a URL-friendly slug from a source field (typically title)
 * Handles:
 * - Auto-generation from source field if slug is empty
 * - Lowercase conversion
 * - Space to hyphen replacement
 * - Special character removal
 * - Uniqueness checking with suffix
 */

interface FormatSlugArgs {
  sourceField?: string
  fallback?: string
}

/**
 * Creates a beforeValidate hook that auto-generates and formats slugs
 */
export const formatSlug = ({
  sourceField = 'title',
  fallback = 'untitled',
}: FormatSlugArgs = {}): FieldHook => {
  return ({ value, data, originalDoc, operation }) => {
    // If slug already exists and we're updating, keep it
    if (value && operation === 'update') {
      return formatSlugString(value)
    }

    // If no value, try to generate from source field
    if (!value) {
      const source = data?.[sourceField] || originalDoc?.[sourceField] || fallback
      return formatSlugString(String(source))
    }

    return formatSlugString(value)
  }
}

/**
 * Formats a string into a URL-friendly slug
 */
export const formatSlugString = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, '') // Remove trailing hyphens
}

/**
 * Creates a beforeValidate hook that checks slug uniqueness
 * and appends a suffix if needed
 */
export const ensureUniqueSlug = (collectionSlug: string): FieldHook => {
  return async ({ value, data, req, originalDoc, operation }) => {
    if (!value || !req?.payload) return value

    // Skip uniqueness check if slug hasn't changed
    if (operation === 'update' && originalDoc?.slug === value) {
      return value
    }

    const existingDocs = await req.payload.find({
      collection: collectionSlug as any,
      where: {
        slug: { equals: value },
        ...(originalDoc?.id && { id: { not_equals: originalDoc.id } }),
      },
      limit: 1,
      depth: 0,
    })

    if (existingDocs.totalDocs === 0) {
      return value
    }

    // Slug exists, append a suffix
    let suffix = 2
    let newSlug = `${value}-${suffix}`

    while (true) {
      const check = await req.payload.find({
        collection: collectionSlug as any,
        where: {
          slug: { equals: newSlug },
          ...(originalDoc?.id && { id: { not_equals: originalDoc.id } }),
        },
        limit: 1,
        depth: 0,
      })

      if (check.totalDocs === 0) {
        return newSlug
      }

      suffix++
      newSlug = `${value}-${suffix}`

      // Safety limit
      if (suffix > 100) {
        return `${value}-${Date.now()}`
      }
    }
  }
}
