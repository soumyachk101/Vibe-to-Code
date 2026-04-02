# Database Design — Vibe-to-Code
**Version:** 1.0.0  
**Engine:** PostgreSQL (via Supabase)  
**ORM:** Drizzle ORM  
**Last Updated:** 2026-04-02

---

## 1. Entity Relationship Overview

```
users ──────────────┐
                    │ 1:N
               design_systems ──── gallery_items
                    │ 1:N
                  exports
                    
users ─── sessions (auth)
users ─── api_usage (rate tracking)
```

---

## 2. Schema Definitions (Drizzle)

### 2.1 Users

```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password_hash: text('password_hash'),              // null if OAuth
  name: varchar('name', { length: 100 }),
  avatar_url: text('avatar_url'),
  plan: varchar('plan', { length: 20 }).default('free').notNull(),
  // free | pro (future)
  email_verified: boolean('email_verified').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  last_seen_at: timestamp('last_seen_at'),
})
```

### 2.2 Sessions

```typescript
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token_hash: text('token_hash').unique().notNull(),   // hashed JWT
  ip_address: varchar('ip_address', { length: 45 }),
  user_agent: text('user_agent'),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})
```

### 2.3 Design Systems

Core table — stores every generated design system.

```typescript
export const design_systems = pgTable('design_systems', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  // null = anonymous generation

  // Input
  vibe_text: text('vibe_text').notNull(),
  mood_tags: text('mood_tags').array(),               // ['dark', 'energetic']
  preferred_theme: varchar('preferred_theme', { length: 10 }),  // dark | light | auto
  industry: varchar('industry', { length: 50 }),
  reference_image_url: text('reference_image_url'),

  // Output — full design system stored as JSONB
  design_system: jsonb('design_system').notNull(),
  
  // Derived metadata (for querying without parsing JSONB)
  vibe_title: varchar('vibe_title', { length: 100 }),
  vibe_description: text('vibe_description'),
  theme: varchar('theme', { length: 10 }),            // dark | light
  primary_color: varchar('primary_color', { length: 7 }),   // #RRGGBB
  display_font: varchar('display_font', { length: 100 }),
  body_font: varchar('body_font', { length: 100 }),

  // Cache / dedup
  input_hash: varchar('input_hash', { length: 32 }).notNull(),
  // MD5 of normalized input — for cache lookup

  // Publishing
  is_public: boolean('is_public').default(false).notNull(),
  published_at: timestamp('published_at'),
  
  // Stats
  view_count: integer('view_count').default(0).notNull(),
  fork_count: integer('fork_count').default(0).notNull(),
  
  // Forking
  forked_from_id: uuid('forked_from_id').references((): AnyPgColumn => design_systems.id),

  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

// Indexes
export const designSystemsIndexes = [
  index('idx_ds_user_id').on(design_systems.user_id),
  index('idx_ds_input_hash').on(design_systems.input_hash),
  index('idx_ds_is_public').on(design_systems.is_public),
  index('idx_ds_primary_color').on(design_systems.primary_color),
  index('idx_ds_created_at').on(design_systems.created_at),
]
```

### 2.4 Exports

Tracks each export action per design system.

```typescript
export const exports = pgTable('exports', {
  id: uuid('id').defaultRandom().primaryKey(),
  design_system_id: uuid('design_system_id')
    .references(() => design_systems.id, { onDelete: 'cascade' })
    .notNull(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  
  format: varchar('format', { length: 20 }).notNull(),
  // css | tailwind | tokens | figma | react
  
  created_at: timestamp('created_at').defaultNow().notNull(),
})

// Index for analytics
export const exportsIndexes = [
  index('idx_exports_ds_id').on(exports.design_system_id),
  index('idx_exports_format').on(exports.format),
]
```

### 2.5 Gallery Items

Curated/featured public systems for the gallery.

```typescript
export const gallery_items = pgTable('gallery_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  design_system_id: uuid('design_system_id')
    .references(() => design_systems.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  
  // Gallery-specific metadata
  featured: boolean('featured').default(false),
  featured_order: integer('featured_order'),          // for manual curation sort
  
  // Tags for filtering
  gallery_tags: text('gallery_tags').array(),         // ['dark', 'minimal', 'brutalist']
  
  // Engagement
  likes: integer('likes').default(0).notNull(),
  
  published_at: timestamp('published_at').defaultNow().notNull(),
})

export const galleryIndexes = [
  index('idx_gallery_featured').on(gallery_items.featured),
  index('idx_gallery_likes').on(gallery_items.likes),
  index('idx_gallery_published_at').on(gallery_items.published_at),
]
```

### 2.6 Likes

User likes on gallery items.

```typescript
export const likes = pgTable('likes', {
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gallery_item_id: uuid('gallery_item_id')
    .references(() => gallery_items.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id, table.gallery_item_id] })
}))
```

### 2.7 API Usage (Rate Limiting + Analytics)

```typescript
export const api_usage = pgTable('api_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  // null = anonymous (tracked by IP)
  
  ip_address: varchar('ip_address', { length: 45 }),
  endpoint: varchar('endpoint', { length: 100 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  
  // For generation tracking
  tokens_used: integer('tokens_used'),
  generation_time_ms: integer('generation_time_ms'),
  cache_hit: boolean('cache_hit').default(false),
  
  status_code: integer('status_code').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const apiUsageIndexes = [
  index('idx_usage_user_id').on(api_usage.user_id),
  index('idx_usage_ip').on(api_usage.ip_address),
  index('idx_usage_endpoint').on(api_usage.endpoint),
  index('idx_usage_created_at').on(api_usage.created_at),
]
```

---

## 3. JSONB Schema — `design_system` column

The `design_system` JSONB column stores the full AI-generated object. Structure mirrors the Zod schema defined in TRD.

```json
{
  "meta": {
    "vibe_title": "Midnight Tokyo",
    "vibe_description": "Neon warmth cutting through cold city silence",
    "mood_tags": ["dark", "urban", "energetic"],
    "theme": "dark"
  },
  "colors": {
    "primary": { "hex": "#FF6B35", "hsl": "18, 100%, 60%" },
    "background": { "hex": "#0A0A0F", "hsl": "240, 23%, 6%" }
    // ... all color tokens
  },
  "typography": {
    "display_font": "Space Grotesk",
    "body_font": "DM Sans",
    "mono_font": "JetBrains Mono"
    // ... full typography scale
  }
  // ... full design system
}
```

### JSONB Indexing Strategy

```sql
-- GIN index for JSONB querying
CREATE INDEX idx_ds_jsonb ON design_systems USING GIN (design_system);

-- For searching by theme inside JSONB
CREATE INDEX idx_ds_theme_jsonb ON design_systems 
  ((design_system->>'theme'));

-- For searching mood_tags
CREATE INDEX idx_ds_tags_jsonb ON design_systems 
  USING GIN ((design_system->'meta'->'mood_tags'));
```

---

## 4. Migrations

```bash
# Generate migration
npx drizzle-kit generate:pg

# Run migration
npx drizzle-kit push:pg

# Migration naming convention
migrations/
├── 0001_initial_schema.sql
├── 0002_add_gallery.sql
├── 0003_add_likes.sql
└── 0004_add_api_usage.sql
```

---

## 5. Seed Data (Development)

```typescript
// db/seed.ts
const seedVibes = [
  {
    vibe_text: "late night Tokyo convenience store, neon glow, tired but alive",
    mood_tags: ["dark", "urban", "energetic"],
    preferred_theme: "dark",
    is_public: true,
  },
  {
    vibe_text: "cold Scandinavian winter morning, muted blues, silent focus",
    mood_tags: ["light", "minimal", "calm"],
    preferred_theme: "light",
    is_public: true,
  },
  {
    vibe_text: "brutalist architecture magazine, raw concrete, bold typography",
    mood_tags: ["dark", "bold", "editorial"],
    preferred_theme: "dark",
    is_public: true,
  }
]
```

---

## 6. Backup & Retention

| Data | Retention | Backup |
|------|-----------|--------|
| Users | Indefinite | Daily Supabase backup |
| Design Systems | Indefinite | Daily Supabase backup |
| Anonymous Generations | 30 days | Cleaned by cron |
| API Usage logs | 90 days | Cleaned by cron |
| Exports table | 1 year | Aggregated monthly |
| Sessions | Until expired | Auto-cleaned |
