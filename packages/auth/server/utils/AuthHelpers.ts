import type { User } from '#layers/BaseDB/db/schema';
import { type H3Event } from 'h3';
export const getUserSessionFromEvent = async (e: H3Event) => {
  return await getUserSession(e);
};



export const checkUserIsLogin = async (event: H3Event) => {
  // Get user from session
  const session = await getUserSession(event)
  // Explicitly cast user to User type for type safety
  const user = session?.user as User | undefined

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  return user;
}
