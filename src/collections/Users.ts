import type { CollectionConfig } from 'payload'
import { isAdmin, adminFieldAccess } from '../access'
import { ensureAdminExists } from '../hooks'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    description: 'System users and administrators',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24, // 24 hours
  },
  hooks: {
    beforeLogin: [ensureAdminExists],
  },
  access: {
    // Only admins can create new users
    create: isAdmin,
    // Users can update their own profile, admins can update all
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      // Users can update their own profile
      return { id: { equals: user.id } }
    },
    // Only admins can delete users
    delete: isAdmin,
    // Users can read their own profile, admins can read all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      saveToJWT: true, // Fast access in token
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
      admin: {
        position: 'sidebar',
        description: 'User permissions',
      },
      access: {
        // Only admins can change roles
        update: adminFieldAccess,
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Avatar',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
