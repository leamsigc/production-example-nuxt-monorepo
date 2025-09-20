import type { InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '../auth/auth'
import { businessProfiles } from '../business/business'
import { socialMediaAccounts } from '../socialMedia/socialMedia'

// Posts
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  businessId: text('business_id').notNull().references(() => businessProfiles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  mediaAssets: text('media_assets'), // JSON array of asset IDs
  scheduledAt: integer('scheduled_at', { mode: 'timestamp' }),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  status: text('status', {
    enum: ['draft', 'scheduled', 'published', 'failed']
  }).notNull().default('draft'),
  targetPlatforms: text('target_platforms').notNull(), // JSON array of social account IDs
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
})

// Platform-specific post tracking
export const platformPosts = sqliteTable('platform_posts', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  socialAccountId: text('social_account_id').notNull().references(() => socialMediaAccounts.id, { onDelete: 'cascade' }),
  platformPostId: text('platform_post_id'),
  status: text('status', {
    enum: ['pending', 'published', 'failed']
  }).notNull().default('pending'),
  errorMessage: text('error_message'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull()
})

export type Post = InferSelectModel<typeof posts>
export type PlatformPost = InferSelectModel<typeof platformPosts>
