import type { InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { businessProfiles } from '../business/business'

// Reviews
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businessProfiles.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  platformReviewId: text('platform_review_id').notNull(),
  authorName: text('author_name').notNull(),
  authorImage: text('author_image'),
  rating: integer('rating').notNull(),
  content: text('content').notNull(),
  reviewDate: integer('review_date', { mode: 'timestamp' }).notNull(),
  responseContent: text('response_content'),
  responseDate: integer('response_date', { mode: 'timestamp' }),
  isShared: integer('is_shared', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
})

export type Review = InferSelectModel<typeof reviews>
