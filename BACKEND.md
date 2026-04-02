# Backend Architecture — Vibe-to-Code
**Version:** 1.0.0  
**Last Updated:** 2026-04-02

---

## 1. Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Entry point, Express app init
│   ├── config/
│   │   ├── env.ts                  # Zod env validation
│   │   ├── db.ts                   # Drizzle + Postgres client
│   │   └── redis.ts                # Upstash Redis client
│   │
│   ├── routes/
│   │   ├── index.ts                # Route aggregator
│   │   ├── generate.route.ts       # POST /api/generate
│   │   ├── export.route.ts         # POST /api/export
│   │   ├── systems.route.ts        # CRUD /api/systems
│   │   ├── gallery.route.ts        # GET /api/gallery
│   │   ├── upload.route.ts         # POST /api/upload/reference
│   │   └── auth.route.ts           # Auth endpoints
│   │
│   ├── controllers/
│   │   ├── generate.controller.ts
│   │   ├── export.controller.ts
│   │   ├── systems.controller.ts
│   │   ├── gallery.controller.ts
│   │   ├── upload.controller.ts
│   │   └── auth.controller.ts
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   ├── pipeline.service.ts       # Orchestrates full AI pipeline
│   │   │   ├── prompt.builder.ts         # Builds system + user prompts
│   │   │   ├── claude.client.ts          # Anthropic SDK wrapper
│   │   │   └── output.parser.ts          # JSON parse + retry logic
│   │   │
│   │   ├── design/
│   │   │   ├── validator.service.ts      # Contrast ratio + schema validation
│   │   │   ├── token.compiler.ts         # DesignSystem → exports
│   │   │   ├── css.exporter.ts           # → CSS Variables string
│   │   │   ├── tailwind.exporter.ts      # → tailwind.config.js string
│   │   │   ├── tokens.exporter.ts        # → W3C Design Tokens JSON
│   │   │   ├── figma.exporter.ts         # → Figma Tokens JSON
│   │   │   └── react.exporter.ts         # → React component stubs
│   │   │
│   │   ├── font.service.ts               # Google Fonts validation + fallback
│   │   ├── image.service.ts              # Sharp: color extraction from upload
│   │   ├── cache.service.ts              # Redis cache helpers
│   │   └── auth.service.ts               # JWT / session logic
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts            # Verify JWT
│   │   ├── rateLimit.middleware.ts       # Per-IP + per-user limits
│   │   ├── validate.middleware.ts        # Zod request validation
│   │   ├── errorHandler.middleware.ts    # Global error handler
│   │   └── requestLogger.middleware.ts   # Morgan / custom logger
│   │
│   ├── db/
│   │   ├── schema.ts                     # Drizzle schema definitions
│   │   ├── migrations/                   # Drizzle migration files
│   │   └── seed.ts                       # Dev seed data
│   │
│   ├── types/
│   │   ├── design-system.types.ts        # Core DesignSystem type
│   │   ├── api.types.ts                  # Request/Response types
│   │   └── env.types.ts                  # Env variable types
│   │
│   └── utils/
│       ├── hash.ts                       # MD5 for cache keys
│       ├── color.ts                      # Color manipulation helpers
│       └── font-fallbacks.ts             # Curated font fallback map
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── drizzle.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 2. Core Service Deep Dives

### 2.1 AI Pipeline Service (`pipeline.service.ts`)

```typescript
export class AIPipelineService {

  async generate(input: GenerateInput): Promise<DesignSystem> {
    // 1. Check cache
    const cacheKey = `gen:${hash(normalizeInput(input))}`
    const cached = await cache.get(cacheKey)
    if (cached) return cached

    // 2. Extract colors from reference image (if provided)
    let dominantColors: string[] = []
    if (input.image_url) {
      dominantColors = await imageService.extractColors(input.image_url)
    }

    // 3. Build prompt
    const prompt = promptBuilder.build({ ...input, dominantColors })

    // 4. Call Claude API (with retry)
    const rawOutput = await claudeClient.generate(prompt)

    // 5. Parse JSON (with retry)
    const parsed = await outputParser.parse(rawOutput)

    // 6. Validate + auto-fix
    const validated = await validator.validate(parsed)

    // 7. Build derived tokens
    const enriched = tokenCompiler.enrich(validated)

    // 8. Cache result
    await cache.set(cacheKey, enriched, 86400) // 24h TTL

    return enriched
  }
}
```

### 2.2 Prompt Builder (`prompt.builder.ts`)

```typescript
const SYSTEM_PROMPT = `
You are a world-class UI design system architect. Your expertise spans color theory, 
typography, visual hierarchy, and design tokens.

Given a vibe description, you generate a complete, harmonious design system.

RULES:
- Colors must have sufficient contrast (WCAG AA minimum: 4.5:1 for text)
- Font pairs must be available on Google Fonts
- Output ONLY valid JSON, no markdown, no explanation
- All hex colors must be 6-digit (#RRGGBB format)
- Dark themes: background darker than #1A1A1A; Light themes: background lighter than #F5F5F5
- Ensure visual harmony: colors should feel cohesive, not random
- Animation durations: fast (100-150ms), normal (200-300ms), slow (400-600ms)

OUTPUT FORMAT: Follow this exact JSON schema: [schema injected here]
`

export function buildUserPrompt(input: EnrichedInput): string {
  return `
VIBE: "${input.vibe}"
${input.tags?.length ? `MOOD TAGS: ${input.tags.join(', ')}` : ''}
${input.theme ? `PREFERRED THEME: ${input.theme}` : ''}
${input.industry ? `INDUSTRY CONTEXT: ${input.industry}` : ''}
${input.dominantColors?.length ? `REFERENCE IMAGE COLORS (use as inspiration): ${input.dominantColors.join(', ')}` : ''}

Generate a complete design system that captures this vibe precisely.
The design system should feel deliberate, cohesive, and distinctive — not generic.
`
}
```

### 2.3 Validator Service (`validator.service.ts`)

```typescript
export class ValidatorService {

  async validate(system: DesignSystem): Promise<DesignSystem> {
    // Zod schema parse
    const parsed = DesignSystemSchema.parse(system)

    // Contrast ratio checks
    const fixed = this.fixContrastIssues(parsed)

    // Font availability check
    const fontFixed = await this.validateFonts(fixed)

    return fontFixed
  }

  private fixContrastIssues(system: DesignSystem): DesignSystem {
    const textColor = system.colors.text_primary.hex
    const bgColor = system.colors.background.hex

    const ratio = chroma.contrast(textColor, bgColor)
    if (ratio < 4.5) {
      // Auto-darken text or lighten bg until ratio passes
      system.colors.text_primary.hex = this.adjustUntilContrast(textColor, bgColor, 4.5)
    }

    return system
  }

  private async validateFonts(system: DesignSystem): Promise<DesignSystem> {
    const available = await fontService.isAvailable(system.typography.display_font)
    if (!available) {
      system.typography.display_font = fontFallbacks.getByCategory('display')
    }
    // Repeat for body_font, mono_font
    return system
  }
}
```

### 2.4 CSS Exporter (`css.exporter.ts`)

```typescript
export function toCSSVariables(system: DesignSystem): string {
  return `
/* Generated by Vibe-to-Code — "${system.meta.vibe_title}" */
/* ${system.meta.vibe_description} */

@import url('https://fonts.googleapis.com/css2?family=${encodeFont(system.typography.display_font)}&family=${encodeFont(system.typography.body_font)}&display=swap');

:root {
  /* Colors */
  --color-primary: ${system.colors.primary.hex};
  --color-primary-hover: ${system.colors.primary_hover.hex};
  --color-secondary: ${system.colors.secondary.hex};
  --color-accent: ${system.colors.accent.hex};
  --color-background: ${system.colors.background.hex};
  --color-surface: ${system.colors.surface.hex};
  --color-surface-elevated: ${system.colors.surface_elevated.hex};
  --color-text-primary: ${system.colors.text_primary.hex};
  --color-text-secondary: ${system.colors.text_secondary.hex};
  --color-text-muted: ${system.colors.text_muted.hex};
  --color-border: ${system.colors.border.hex};
  --color-error: ${system.colors.error.hex};
  --color-success: ${system.colors.success.hex};
  --color-warning: ${system.colors.warning.hex};

  /* Typography */
  --font-display: '${system.typography.display_font}', serif;
  --font-body: '${system.typography.body_font}', sans-serif;
  --font-mono: '${system.typography.mono_font}', monospace;

  /* Font Scale */
  ${Object.entries(system.typography.scale).map(([k, v]) => `--text-${k}: ${v};`).join('\n  ')}

  /* Spacing */
  ${Object.entries(system.spacing.scale).map(([k, v]) => `--space-${k}: ${v};`).join('\n  ')}

  /* Border Radius */
  --radius-sm: ${system.border_radius.sm};
  --radius-md: ${system.border_radius.md};
  --radius-lg: ${system.border_radius.lg};
  --radius-xl: ${system.border_radius.xl};
  --radius-full: ${system.border_radius.full};

  /* Shadows */
  ${system.shadows.map(s => `--shadow-${s.name}: ${s.value};`).join('\n  ')}

  /* Animations */
  --duration-fast: ${system.animations.duration.fast};
  --duration-normal: ${system.animations.duration.normal};
  --duration-slow: ${system.animations.duration.slow};
  --ease-default: ${system.animations.easing.default};
  --ease-enter: ${system.animations.easing.enter};
  --ease-exit: ${system.animations.easing.exit};
  --ease-spring: ${system.animations.easing.spring};
}

${system.animations.presets.map(p => `
/* Animation: ${p.name} — ${p.usage} */
@keyframes ${p.name} {
  ${p.keyframes}
}
`).join('\n')}
`.trim()
}
```

---

## 3. Middleware Stack

```typescript
// index.ts — middleware order matters
app.use(helmet())                          // Security headers
app.use(cors(corsConfig))                  // CORS
app.use(express.json({ limit: '1mb' }))    // Body parser
app.use(requestLogger)                     // Request logging
app.use('/api', rateLimitMiddleware)        // Rate limiting
app.use('/api', authMiddleware)             // JWT verify (optional routes)
app.use('/api', routes)                    // Route handlers
app.use(errorHandler)                      // Global error handler
```

---

## 4. Environment Variables

```bash
# .env.example

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL=postgresql://user:pass@host:5432/vibetocode

# Redis (Upstash)
UPSTASH_REDIS_URL=https://...
UPSTASH_REDIS_TOKEN=...

# Auth
JWT_SECRET=your-secret-here
JWT_EXPIRY=7d

# Cloudflare R2 (Image Storage)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vibe-to-code-uploads
R2_PUBLIC_URL=https://...

# Google Fonts
GOOGLE_FONTS_API_KEY=...
```

---

## 5. Error Response Format

All API errors follow this structure:

```json
{
  "error": {
    "code": "GENERATION_FAILED",
    "message": "Human-readable message",
    "details": {},
    "request_id": "uuid"
  }
}
```

### Error Codes
| Code | HTTP | Description |
|------|------|-------------|
| `GENERATION_FAILED` | 500 | Claude API error after retries |
| `INVALID_INPUT` | 400 | Zod validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `UNAUTHORIZED` | 401 | Auth required for this route |
| `FORBIDDEN` | 403 | Cannot access this resource |
| `NOT_FOUND` | 404 | Resource not found |
| `UPLOAD_TOO_LARGE` | 413 | Image > 5MB |
| `INVALID_FILE_TYPE` | 415 | Non-image upload |
