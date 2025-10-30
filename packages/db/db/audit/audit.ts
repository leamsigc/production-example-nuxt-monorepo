import type { InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '../auth/auth'

export const auditLog = sqliteTable('audit_log', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
  category: text('category').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type'),
  targetId: text('target_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  status: text('status').notNull().default('success'),
  details: text('details'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$default(() => new Date())
})


export type AuditLog = InferSelectModel<typeof auditLog>
