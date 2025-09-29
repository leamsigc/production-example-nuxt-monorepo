import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { tursoConfig } from '../../config/turso.config'
import * as schema from '../../db/schema'

const tursoClient = createClient({
  url: tursoConfig.url,
  authToken: tursoConfig.authToken
})

export const useDrizzle = () => {
  return drizzle(tursoClient)
}

export const tables = schema

export const UserInsert = schema.user.$inferInsert
export type UserRegisterType = Omit<typeof UserInsert, 'createdAt' | 'updatedAt' | 'id' | 'emailVerified'>
