import type { CollectionConfig } from 'payload'
import { AllBlocks } from '../blocks'
import { formatSlug, ensureUniqueSlug, purgeCacheAfterChange, generateEmbedding } from '../hooks'
import {
  authenticatedOrPublished,
  canEditOwnContent,
  canDeleteOwnContent,
  isAuthor,
} from '../access'

export const Transmissions: CollectionConfig = {
  slug: 'transmissions',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'author', 'category', 'status', 'publishedAt'],
    description: 'Your transmissions to the world',
    // RED TEAM HARDENING: Prevent Deep Query DoS
    listSearchableFields: ['title', 'excerpt'],
    pagination: {
      defaultLimit: 12,
      limits: [12, 24, 48, 100], // Restrict options to prevent abuse
    },
  },
  access: {
    read: authenticatedOrPublished,
    create: isAuthor, // Authors, Editors, and Admins can create
    update: canEditOwnContent,
    delete: canDeleteOwnContent, // Admins can delete all, Editors only their own
  },
  hooks: {
    beforeOperation: [
      (args: any) => {
        console.log(`[DEBUG_SONI] Transmissions beforeOperation: ${args.operation}`)
        return args.args
      },
    ],
    afterChange: [purgeCacheAfterChange, generateEmbedding],
  },
  fields: [
    // === Main Content ===
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Signal Header',
      admin: {
        description: 'The headline of this transmission',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Signal ID',
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [formatSlug({ sourceField: 'title' })],
        beforeChange: [ensureUniqueSlug('transmissions')],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Brief summary for listings and SEO',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Image',
    },

    // === Canvas Layout (Blocks System) ===
    {
      name: 'layout',
      type: 'blocks',
      blocks: AllBlocks,
      required: true,
      label: 'Transmission Data',
      admin: {
        description: 'Compose the transmission using modular blocks',
      },
    },

    // === Ownership & Display Author ===
    {
      // OWNERSHIP: Links to system User for access control
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Owner',
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data, siblingData, { user }) => !!user?.roles?.includes('admin'),
      },
      access: {
        update: () => false, // Cannot change owner after creation
      },
    },
    {
      // PUBLIC DISPLAY: The author profile shown on frontend
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      label: 'Display Author',
      admin: {
        position: 'sidebar',
        description: 'Public author profile shown on the frontend',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Frequency Channel',
      admin: {
        position: 'sidebar',
        description: 'Select the frequency channel for this transmission',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedTransmissions',
      type: 'relationship',
      relationTo: 'transmissions',
      hasMany: true,
      label: 'Related Transmissions',
      admin: {
        description: 'Manually select related content (or leave empty for auto)',
      },
    },

    // === Publication Status ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      index: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Schedule for future publication',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Auto-set publishedAt when status changes to published
            if (siblingData.status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
}
