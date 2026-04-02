# TRD — Vibe-to-Code
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Senior Tech Lead  
**Last Updated:** 2026-04-02

---

## 1. Technical Overview

Vibe-to-Code is a full-stack web application with an AI core. The system takes a natural language vibe description, passes it through a structured AI pipeline, validates/post-processes the output, and serves it as a live preview + exportable code.

### Architecture Summary

```
Client (React + Vite)
    ↕ REST / SSE
API Server (Node.js + Express)
    ↕
AI Pipeline (Claude API)
    ↕ (parallel)
Font Service (Google Fonts API)  |  Image Analysis (Sharp)
    ↕
Post-Processor (Chroma.js validation + token builder)
    ↕
Database (PostgreSQL + Redis)
```

---

## 2. Tech Stack

### 2.1 Frontend
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 + Vite | Fast HMR, modern React |
| Styling | Tailwind CSS v4 | Utility-first, token-friendly |
| State | Zustand | Lightweight, no boilerplate |
| Animation | Framer Motion | Preview animations |
| Color Utils | Chroma.js (client) | Live preview adjustments |
| Font Loading | @fontsource or Google Fonts CSS API | Dynamic font loading |
| Export | FileSaver.js | Client-side file download |
| Icons | Lucide React | Clean, consistent |

### 2.2 Backend
| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | Node.js 20 LTS | Async-heavy AI calls |
| Framework | Express.js | Minimal overhead |
| AI Client | Anthropic Node SDK | Official, typed |
| Color Processing | Chroma.js (server) | Contrast validation |
| Image Processing | Sharp | Reference image color extraction |
| Auth | Better Auth / JWT | Session management |
| Validation | Zod | Schema validation for AI output |
| Rate Limiting | express-rate-limit + Redis | Per-user limits |

### 2.3 Data Layer
| Layer | Choice | Reason |
|-------|--------|--------|
| Primary DB | PostgreSQL (Supabase) | Relational, hosted |
| Cache | Redis (Upstash) | Rate limiting + result cache |
| ORM | Drizzle ORM | Type-safe, lightweight |
| File Storage | Cloudflare R2 | Reference image uploads |

### 2.4 Infrastructure
| Service | Choice |
|---------|--------|
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |
| DB | Supabase (PostgreSQL) |
| Cache | Upstash Redis |
| Storage | Cloudflare R2 |
| CDN | Cloudflare |

---

## 3. AI Pipeline Architecture

### 3.1 Pipeline Stages

```
Stage 1: Input Preprocessing
  - Sanitize vibe text
  - Extract optional image → dominant colors (Sharp)
  - Build enriched context object

Stage 2: AI Generation (Claude API)
  - System prompt: Design system expert persona
  - User prompt: Structured vibe context
  - Output: Strict JSON schema (design_system object)
  - Temperature: 0.8 (creative but consistent)
  - Max tokens: 2000

Stage 3: Post-Processing & Validation
  - Parse JSON (with retry on malformed output)
  - Validate WCAG contrast ratios (Chroma.js)
  - Auto-fix: if contrast < 4.5:1, darken/lighten programmatically
  - Validate Google Fonts availability
  - Build derived tokens (semantic mappings, component tokens)

Stage 4: Token Compilation
  - Compile to CSS Variables string
  - Compile to Tailwind config object
  - Compile to Design Tokens JSON (W3C format)
  - Compile to Figma Tokens JSON
```

### 3.2 AI Output Schema (Zod)

```typescript
const DesignSystemSchema = z.object({
  meta: z.object({
    vibe_title: z.string(),          // e.g. "Midnight Tokyo"
    vibe_description: z.string(),    // 1-line aesthetic summary
    mood_tags: z.array(z.string()),  // ["dark", "energetic", "urban"]
    theme: z.enum(["dark", "light", "auto"])
  }),
  colors: z.object({
    primary: ColorTokenSchema,
    primary_hover: ColorTokenSchema,
    secondary: ColorTokenSchema,
    accent: ColorTokenSchema,
    background: ColorTokenSchema,
    surface: ColorTokenSchema,
    surface_elevated: ColorTokenSchema,
    text_primary: ColorTokenSchema,
    text_secondary: ColorTokenSchema,
    text_muted: ColorTokenSchema,
    border: ColorTokenSchema,
    error: ColorTokenSchema,
    success: ColorTokenSchema,
    warning: ColorTokenSchema,
  }),
  typography: z.object({
    display_font: z.string(),    // Google Font name
    body_font: z.string(),       // Google Font name
    mono_font: z.string(),       // Google Font name
    scale: z.object({
      xs: z.string(),   // e.g. "0.75rem"
      sm: z.string(),
      base: z.string(),
      lg: z.string(),
      xl: z.string(),
      "2xl": z.string(),
      "3xl": z.string(),
      "4xl": z.string(),
      "5xl": z.string(),
    }),
    weight: z.object({
      light: z.number(),
      regular: z.number(),
      medium: z.number(),
      semibold: z.number(),
      bold: z.number(),
    }),
    line_height: z.object({
      tight: z.string(),
      normal: z.string(),
      relaxed: z.string(),
    }),
    letter_spacing: z.object({
      tight: z.string(),
      normal: z.string(),
      wide: z.string(),
      wider: z.string(),
    })
  }),
  spacing: z.object({
    base: z.number(),      // base unit in px (usually 4)
    scale: z.record(z.string(), z.string())  // xs → 3xl
  }),
  border_radius: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    full: z.string(),
  }),
  shadows: z.array(z.object({
    name: z.string(),
    value: z.string(),
    use_case: z.string(),
  })),
  animations: z.object({
    duration: z.object({
      fast: z.string(),
      normal: z.string(),
      slow: z.string(),
    }),
    easing: z.object({
      default: z.string(),
      enter: z.string(),
      exit: z.string(),
      spring: z.string(),
    }),
    presets: z.array(z.object({
      name: z.string(),
      keyframes: z.string(),  // CSS keyframe string
      usage: z.string(),
    }))
  }),
  component_tokens: z.object({
    button: z.object({
      bg: z.string(),
      text: z.string(),
      border: z.string(),
      hover_bg: z.string(),
      radius: z.string(),
      padding: z.string(),
    }),
    card: z.object({
      bg: z.string(),
      border: z.string(),
      radius: z.string(),
      shadow: z.string(),
      padding: z.string(),
    }),
    input: z.object({
      bg: z.string(),
      border: z.string(),
      text: z.string(),
      placeholder: z.string(),
      focus_ring: z.string(),
      radius: z.string(),
    }),
    nav: z.object({
      bg: z.string(),
      text: z.string(),
      border: z.string(),
      active_text: z.string(),
    })
  })
})
```

### 3.3 Retry Strategy
- If JSON parse fails: retry up to 2 times with `"Return ONLY valid JSON, no markdown"` appended
- If contrast validation fails on > 3 colors: regenerate once, then auto-fix remainder
- If Google Font not found: fallback to curated font map by category (serif/sans/mono)

---

## 4. API Endpoints

### 4.1 Generation
```
POST   /api/generate
       Body: { vibe: string, tags?: string[], theme?: string, industry?: string, image_url?: string }
       Returns: { design_system: DesignSystem, exports: ExportBundle }
       Auth: Optional (anonymous allowed, rate limited)
       Rate limit: 5/hour anonymous, 30/hour authenticated
```

### 4.2 Export
```
POST   /api/export
       Body: { design_system: DesignSystem, format: "css" | "tailwind" | "tokens" | "figma" | "react" }
       Returns: { code: string, filename: string }
       Auth: Optional
```

### 4.3 Save / Gallery
```
POST   /api/systems          Save design system
GET    /api/systems          Get user's saved systems
GET    /api/systems/:id      Get single system
DELETE /api/systems/:id      Delete system

GET    /api/gallery          Public gallery (paginated)
POST   /api/systems/:id/publish   Make public
```

### 4.4 Image Upload
```
POST   /api/upload/reference
       Body: multipart/form-data (image)
       Returns: { url: string, dominant_colors: string[] }
       Max size: 5MB
       Formats: jpg, png, webp
```

### 4.5 Auth
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

---

## 5. Performance Requirements

| Metric | Target |
|--------|--------|
| AI Generation (p50) | < 4s |
| AI Generation (p95) | < 8s |
| Page Load (FCP) | < 1.2s |
| Export Compile | < 200ms |
| Image Processing | < 500ms |
| API Response (non-AI) | < 100ms |

### 5.1 Caching Strategy
- Cache generation results by vibe hash (MD5 of normalized input) → Redis, TTL 24h
- Cache Google Fonts manifest → Redis, TTL 7 days
- Cache gallery queries → Redis, TTL 5 minutes
- Component preview renders → client-side memoization

---

## 6. Security

- Input sanitization: strip HTML/JS from vibe text
- Prompt injection guard: wrap user input in explicit delimiters in system prompt
- Rate limiting: per-IP + per-user
- Image uploads: type validation + EXIF strip (Sharp)
- Auth: HTTP-only cookies, CSRF protection
- Secrets: Railway env vars, never in code
- API keys: server-side only, never exposed to client

---

## 7. Error Handling

| Error Type | Handling |
|-----------|---------|
| AI timeout | Retry once, then 503 with user message |
| Malformed AI JSON | Retry with stricter prompt |
| Font not found | Fallback to curated pair |
| Contrast failure | Auto-fix, flag to user |
| Upload too large | 413 with size limit message |
| Rate limit hit | 429 with retry-after header |

---

## 8. Testing Strategy

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Vitest | Core utils, post-processor |
| Integration | Supertest | All API endpoints |
| AI Output | Zod validation | 100% schema coverage |
| E2E | Playwright | Happy path + export flows |
| Accessibility | axe-core | WCAG AA |
