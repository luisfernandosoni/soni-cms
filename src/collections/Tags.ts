import type { CollectionConfig } from 'payload'
import { formatSlug, ensureUniqueSlug } from '../hooks'
import { isEditor } from '../access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
    group: 'Taxonomy',
    defaultColumns: ['title', 'slug'],
    description: 'Flexible content labels',
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tag Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (auto-generated)',
      },
      hooks: {
        beforeValidate: [formatSlug({ sourceField: 'title' })],
        beforeChange: [ensureUniqueSlug('tags')],
      },
    },
  ],
}
