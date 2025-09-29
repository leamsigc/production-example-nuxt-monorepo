import { auth } from '#layers/BaseAuth/lib/auth'

export default defineEventHandler(async (event) => {
  return auth.handler(toWebRequest(event))
})
