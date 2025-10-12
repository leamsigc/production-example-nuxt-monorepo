import { authClient } from "#layers/BaseAuth/lib/auth-client"

export default defineNuxtRouteMiddleware(async (to) => {
  // Check if the user is navigating to the app route
  const isUserNavigatingToAdminOnly = to.path.startsWith('/app/admin')
  const { data: loggedIn } = await authClient.useSession(useFetch)
  const isUserAdmin = loggedIn.value?.user.role === 'admin'

  if (isUserNavigatingToAdminOnly && !isUserAdmin) {
    return navigateTo('/app')
  }
})
