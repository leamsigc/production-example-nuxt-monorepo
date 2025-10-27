import type { InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '../auth/auth'
import z from 'zod'
// Business profiles
export const businessProfiles = sqliteTable('business_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  googleBusinessId: text('google_business_id'),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  category: text('category'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
})

export type BusinessProfile = InferSelectModel<typeof businessProfiles>

export const UpdateBusinessProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  googleBusinessId: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  website: z.string(),
  category: z.string(),
  isActive: z.boolean()
})

export const CreateBusinessProfileSchema = z.object({
  userId: z.string(),
  googleBusinessId: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  phone: z.string(),
  website: z.string(),
  category: z.string()
})
