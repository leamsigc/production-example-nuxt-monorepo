import type { RouteLocationRaw } from 'vue-router'
import { authClient } from '#layers/BaseAuth/lib/auth-client'
import type { User } from '#layers/BaseDB/db/schema'



export function UseUser() {
  const client = authClient

  // Todo: Move to store and pinia
  const user = useState<User | null>('auth:user', () => null)
  const session = useState('auth:session', () => null as any)
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return
    }
    sessionFetching.value = true
    const { data } = await client.getSession()
    session.value = data?.session || null

    const userDefaults = {
      image: null,
      role: 'user' as const,
      banReason: null,
      banned: false,
      banExpires: null,
      firstName: null,
      lastName: null
    }
    user.value = data?.user
      ? Object.assign({}, userDefaults, data.user)
      : null
    sessionFetching.value = false
    return data
  }

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal)
        return
      await fetchSession()
    })
  }

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    signIn: client.signIn,
    signUp: client.signUp,
    forgetPassword: client.forgetPassword,
    resetPassword: client.resetPassword,
    sendVerificationEmail: client.sendVerificationEmail,
    errorCodes: client.$ERROR_CODES,
    async signOut({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      await client.signOut({
        fetchOptions: {
          onSuccess: async () => {
            session.value = null
            user.value = null
            if (redirectTo) {
              await reloadNuxtApp({
                path: redirectTo.toString()
              })
            }
          }
        }
      })
    },
    fetchSession,
    client
  }
}
