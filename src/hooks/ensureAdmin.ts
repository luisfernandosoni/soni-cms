import type { CollectionBeforeLoginHook } from 'payload'

/**
 * Ensure Admin Exists
 * 
 * This hook runs during login and checks if any admin users exist.
 * If no admins exist (bootstrap paradox), the logging-in user is 
 * automatically promoted to admin.
 * 
 * This prevents permanent lockout scenarios where the first user
 * was created before the roles field existed.
 */
export const ensureAdminExists: CollectionBeforeLoginHook = async ({
  user,
  req,
}) => {
  if (!user) return user

  const { payload } = req

  try {
    // Check if any users have admin role
    const adminsCount = await payload.count({
      collection: 'users',
      where: {
        roles: {
          contains: 'admin',
        },
      },
    })

    // If no admins exist, promote this user to admin
    if (adminsCount.totalDocs === 0) {
      payload.logger.info(`No admins found. Promoting user ${user.email} to admin.`)

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          roles: ['admin'],
        },
        overrideAccess: true, // Bypass access control
      })

      // Update the user object for this session's JWT
      user.roles = ['admin']

      payload.logger.info(`User ${user.email} promoted to admin successfully.`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`ensureAdmin hook failed: ${errorMessage}`)
    // Don't block login on error - just log it
  }

  return user
}
