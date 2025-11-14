import type { RouteLocationRaw } from 'vue-router'
import { authClient } from '#layers/BaseAuth/lib/auth-client'
import type { User } from '#layers/BaseDB/db/schema'
import type { Session } from 'better-auth'



const client = authClient

export function UseUser() {

  // Todo: Move to store and pinia
  const user = useState<User | null>('auth:user')
  const session = useState<Session>('auth:session')
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const listAccounts = useState('auth:listAccounts')



  const getUserAccountList = async () => {
    const data = await client.listAccounts()
    listAccounts.value = data.data
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
    client,
    getUserAccountList,
    listAccounts
  }
}
