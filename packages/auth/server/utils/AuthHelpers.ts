import { auth } from '#layers/BaseAuth/lib/auth';
import type { User } from '#layers/BaseDB/db/schema';
import { type H3Event } from 'h3';
export const getUserSessionFromEvent = async (e: H3Event) => {
  return await auth.api.getSession({
    headers: e.headers
  });
};



export const checkUserIsLogin = async (event: H3Event) => {
  // Get user from session
  const session = await auth.api.getSession({
    headers: event.headers
  });
  // Explicitly cast user to User type for type safety
  const user = session?.user as User

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  return user;
}
