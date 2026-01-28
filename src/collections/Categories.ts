import type { CollectionConfig } from 'payload'
import { formatSlug, ensureUniqueSlug } from '../hooks'
import { isEditor } from '../access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Taxonomy',
    defaultColumns: ['title', 'slug', 'accentColor'],
    description: 'Content frequency channels',
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
      label: 'Category Name',
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
        beforeChange: [ensureUniqueSlug('categories')],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Brief description of this category',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      label: 'Accent Color',
      admin: {
        position: 'sidebar',
        description: 'Hex color code (e.g., #FF5500)',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return true
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if (!hexRegex.test(value)) {
          return 'Must be a valid hex color (e.g., #FF5500)'
        }
        return true
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Image',
      admin: {
        description: 'Featured image for this category',
      },
    },
  ],
}
