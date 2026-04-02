import { pgTable, uuid, varchar, text, boolean, integer, timestamp, jsonb, index, primaryKey } from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: text('password_hash'),
  name: varchar('name', { length: 100 }),
  avatar_url: text('avatar_url'),
  plan: varchar('plan', { length: 20 }).default('free').notNull(),
  email_verified: boolean('email_verified').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  last_seen_at: timestamp('last_seen_at'),
})

export const design_systems = pgTable('design_systems', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  vibe_text: text('vibe_text').notNull(),
  mood_tags: text('mood_tags').array(),
  preferred_theme: varchar('preferred_theme', { length: 10 }),
  industry: varchar('industry', { length: 50 }),
  reference_image_url: text('reference_image_url'),
  design_system: jsonb('design_system').notNull(),
  vibe_title: varchar('vibe_title', { length: 100 }),
  vibe_description: text('vibe_description'),
  theme: varchar('theme', { length: 10 }),
  primary_color: varchar('primary_color', { length: 7 }),
  display_font: varchar('display_font', { length: 100 }),
  body_font: varchar('body_font', { length: 100 }),
  input_hash: varchar('input_hash', { length: 32 }).notNull(),
  is_public: boolean('is_public').default(false).notNull(),
  published_at: timestamp('published_at'),
  view_count: integer('view_count').default(0).notNull(),
  fork_count: integer('fork_count').default(0).notNull(),
  forked_from_id: uuid('forked_from_id').references((): AnyPgColumn => design_systems.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('idx_ds_user_id').on(table.user_id),
  index('idx_ds_input_hash').on(table.input_hash),
  index('idx_ds_is_public').on(table.is_public),
  index('idx_ds_created_at').on(table.created_at),
])

export const gallery_items = pgTable('gallery_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  design_system_id: uuid('design_system_id').references(() => design_systems.id, { onDelete: 'cascade' }).unique().notNull(),
  featured: boolean('featured').default(false),
  featured_order: integer('featured_order'),
  gallery_tags: text('gallery_tags').array(),
  likes: integer('likes').default(0).notNull(),
  published_at: timestamp('published_at').defaultNow().notNull(),
}, (table) => [
  index('idx_gallery_featured').on(table.featured),
  index('idx_gallery_likes').on(table.likes),
  index('idx_gallery_published_at').on(table.published_at),
])

export const likes = pgTable('likes', {
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gallery_item_id: uuid('gallery_item_id').references(() => gallery_items.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.user_id, table.gallery_item_id] })])
