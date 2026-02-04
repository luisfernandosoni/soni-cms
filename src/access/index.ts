import type { Access, FieldAccess } from 'payload'

/**
 * User role type
 */
export type UserRole = 'admin' | 'editor' | 'author'

/**
 * Check if user has a specific role
 */
const hasRole = (user: any, role: UserRole): boolean => {
  return !!user?.roles && user.roles.includes(role)
}

/**
 * Check if user has any of the specified roles
 */
const hasAnyRole = (user: any, roles: UserRole[]): boolean => {
  if (!user?.roles) return false
  return roles.some((role) => user.roles.includes(role))
}

// ============================================
// Collection-Level Access Functions
// ============================================

/**
 * Only admins can access
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}

/**
 * Admins and editors can access
 */
export const isEditor: Access = ({ req: { user } }) => {
  return hasAnyRole(user, ['admin', 'editor'])
}

/**
 * Admins, editors, and authors can access
 */
export const isAuthor: Access = ({ req: { user } }) => {
  return hasAnyRole(user, ['admin', 'editor', 'author'])
}

/**
 * User can only access their own document (by createdBy field)
 * Admins can access all
 */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, 'admin')) return true

  // Return a query constraint
  return {
    createdBy: {
      equals: user.id,
    },
  }
}

/**
 * Public can read only published content
 * Authenticated users can read all
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  // Authenticated users see everything
  if (user) return true

  // Public only sees published content
  return {
    status: {
      equals: 'published',
    },
  }
}

/**
 * Authors can only edit their own content (via createdBy field)
 * Editors and Admins can edit all
 */
export const canEditOwnContent: Access = ({ req: { user } }) => {
  if (!user) return false

  // Admins and Editors can edit all
  if (hasAnyRole(user, ['admin', 'editor'])) return true

  // Authors can only edit their own (via createdBy relationship to Users)
  if (hasRole(user, 'author')) {
    return {
      createdBy: {
        equals: user.id,
      },
    }
  }

  return false
}

/**
 * Editors can only delete their own content (via createdBy field)
 * Admins can delete all content
 * Authors cannot delete (only draft/unpublish)
 */
export const canDeleteOwnContent: Access = ({ req: { user } }) => {
  if (!user) return false

  // Only Admins can delete any content
  if (hasRole(user, 'admin')) return true

  // Editors can only delete content they created
  if (hasRole(user, 'editor')) {
    return {
      createdBy: {
        equals: user.id,
      },
    }
  }

  // Authors cannot delete
  return false
}

// ============================================
// Field-Level Access Functions
// ============================================

/**
 * Only admins can see/edit this field
 */
export const adminFieldAccess: FieldAccess = ({ req: { user } }) => {
  return hasRole(user, 'admin')
}

/**
 * Editors and admins can see/edit this field
 */
export const editorFieldAccess: FieldAccess = ({ req: { user } }) => {
  return hasAnyRole(user, ['admin', 'editor'])
}

// ============================================
// Utility Exports
// ============================================

export { hasRole, hasAnyRole }
