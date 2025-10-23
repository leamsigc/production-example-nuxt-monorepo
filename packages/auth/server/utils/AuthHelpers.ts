import { type H3Event } from 'h3';
export const getUserSessionFromEvent = async (e: H3Event) => {
  return await getUserSession(e);
};

