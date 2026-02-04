import type { CollectionConfig } from 'payload'
import { isEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
  },
  access: {
    // Public can read if they have the specific ID (e.g. from a Transmission)
    // but listing is discouraged/managed.
    read: () => true, 
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if (operation === 'create') {
           console.log(`[VC_ELITE_DEBUG] Media beforeOperation: create`)
        }
      }
    ],
    beforeValidate: [
      ({ data, req }) => {
        console.log(`[VC_ELITE_DEBUG] Media beforeValidate: hasData=${!!data}, hasFile=${!!(req as any).file}`)
        return data
      }
    ],
    beforeChange: [
      ({ data, req }) => {
        console.log(`[VC_ELITE_DEBUG] Media beforeChange: filename=${data?.filename}, hasFile=${!!req.file}`)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Describe this image for accessibility (optional)',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
      admin: {
        description: 'Optional caption or description',
      },
    },
    {
      name: 'photographer',
      type: 'text',
      label: 'Photographer',
      admin: {
        description: 'Credit for the image creator',
      },
    },
    {
      name: 'license',
      type: 'select',
      label: 'License',
      defaultValue: 'rights-reserved',
      options: [
        { label: 'All Rights Reserved', value: 'rights-reserved' },
        { label: 'CC0 (Public Domain)', value: 'cc0' },
        { label: 'CC BY', value: 'cc-by' },
        { label: 'CC BY-SA', value: 'cc-by-sa' },
        { label: 'CC BY-NC', value: 'cc-by-nc' },
        { label: 'Unsplash License', value: 'unsplash' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  upload: {
    // Cloudflare Workers: Disable local processing (no sharp)
    crop: false,
    focalPoint: false,
    imageSizes: [],
    // CRITICAL: Disable local storage to prevent EROFS errors on the Edge
    disableLocalStorage: true,
    // MIME type restrictions
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
    ],
  },
}
