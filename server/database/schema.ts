import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('user', {
  id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: integer({ mode: 'boolean' }).default(true),
  image: text(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  role: text(),
  banned: integer({ mode: 'boolean' }),
  banReason: text(),
  banExpires: integer('banExpires', { mode: 'timestamp_ms' }),
})
