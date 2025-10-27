import { checkUserIsLogin } from '#layers/BaseAuth/server/utils/AuthHelpers';

export default defineEventHandler(async (event) => {
  const path = event.path

  if (path?.startsWith('/api/v1')) {
    // Get user from session (assuming auth middleware sets this)
    const user = await checkUserIsLogin(event)

    if (user.role !== 'admin' && path?.startsWith('/api/v1/admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Admin access required.'
      })
    }
  }
})
