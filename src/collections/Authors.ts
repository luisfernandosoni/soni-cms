import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'role', 'status'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role',
      admin: {
        description: 'e.g., Architect, Writer, Developer',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Biography',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
      admin: {
        description: 'Profile photo',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Website', value: 'website' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Guest', value: 'guest' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
