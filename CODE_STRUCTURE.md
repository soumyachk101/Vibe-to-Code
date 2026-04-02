# Code Structure — Vibe-to-Code
**Version:** 1.0.0  
**Last Updated:** 2026-04-02

---

## 1. Monorepo Overview

```
vibe-to-code/
├── apps/
│   ├── web/          # React + Vite frontend
│   └── api/          # Node.js + Express backend
├── packages/
│   └── shared/       # Shared types, schemas, utils
├── docs/             # All .md documentation (this folder)
├── package.json      # Root workspace config (pnpm)
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo config
```

**Package manager:** pnpm (workspaces)  
**Monorepo tool:** Turborepo  

---

## 2. Frontend (`apps/web/`)

```
apps/web/
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── src/
│   ├── main.tsx                    # Vite entry point
│   ├── App.tsx                     # Root component + router
│   │
│   ├── pages/
│   │   ├── Home.tsx                # Landing + vibe input
│   │   ├── Result.tsx              # Generated design system view
│   │   ├── Gallery.tsx             # Community gallery
│   │   ├── System.tsx              # Single saved system view
│   │   ├── Dashboard.tsx           # User's saved systems
│   │   └── Auth.tsx                # Login/signup
│   │
│   ├── components/
│   │   ├── vibe-input/
│   │   │   ├── VibeInput.tsx       # Main input component
│   │   │   ├── MoodTagSelector.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── IndustryPicker.tsx
│   │   │   └── ImageUpload.tsx
│   │   │
│   │   ├── result/
│   │   │   ├── DesignSystemResult.tsx     # Result container
│   │   │   ├── ColorPalette.tsx           # Color swatches
│   │   │   ├── TypographyPreview.tsx      # Font preview
│   │   │   ├── SpacingScale.tsx           # Spacing visualization
│   │   │   ├── AnimationPreview.tsx       # Animation demos
│   │   │   ├── ComponentPreview.tsx       # Live component renders
│   │   │   └── ShadowPreview.tsx
│   │   │
│   │   ├── preview/
│   │   │   ├── LivePreview.tsx            # Full UI preview frame
│   │   │   ├── PreviewButton.tsx          # Styled with design tokens
│   │   │   ├── PreviewCard.tsx
│   │   │   ├── PreviewInput.tsx
│   │   │   ├── PreviewNav.tsx
│   │   │   └── PreviewHero.tsx
│   │   │
│   │   ├── export/
│   │   │   ├── ExportPanel.tsx            # Export format chooser
│   │   │   ├── CodeBlock.tsx              # Syntax highlighted code
│   │   │   └── ExportButton.tsx
│   │   │
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GalleryCard.tsx
│   │   │   └── GalleryFilters.tsx
│   │   │
│   │   └── ui/                            # Base UI components (shadcn-style)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Dialog.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Toast.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── hooks/
│   │   ├── useGenerate.ts              # Generation API call + state
│   │   ├── useExport.ts                # Export logic
│   │   ├── useDesignSystem.ts          # Apply tokens to preview
│   │   ├── useAuth.ts                  # Auth state
│   │   └── useGallery.ts               # Gallery queries
│   │
│   ├── store/
│   │   ├── designSystem.store.ts       # Current design system state
│   │   ├── auth.store.ts               # User auth state
│   │   └── ui.store.ts                 # UI state (loading, panels)
│   │
│   ├── api/
│   │   ├── client.ts                   # Axios/fetch client config
│   │   ├── generate.api.ts
│   │   ├── export.api.ts
│   │   ├── systems.api.ts
│   │   ├── gallery.api.ts
│   │   └── auth.api.ts
│   │
│   ├── utils/
│   │   ├── applyTokens.ts              # Inject CSS vars into preview iframe
│   │   ├── colorUtils.ts               # Client-side color helpers
│   │   ├── downloadFile.ts             # FileSaver wrapper
│   │   └── formatters.ts               # Display formatters
│   │
│   ├── styles/
│   │   ├── globals.css                 # Base styles + app design tokens
│   │   └── fonts.css                   # Font imports
│   │
│   └── types/
│       └── index.ts                    # Re-export from shared package
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Backend (`apps/api/`)

*See BACKEND.md for full service-level breakdown.*

```
apps/api/
├── src/
│   ├── index.ts
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   │   ├── ai/
│   │   └── design/
│   ├── middleware/
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── types/
│   └── utils/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│       └── sample-design-systems/
│
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Shared Package (`packages/shared/`)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── design-system.types.ts    # Core DesignSystem, ColorToken, etc.
│   │   ├── api.types.ts              # Request/Response interfaces
│   │   └── index.ts
│   │
│   ├── schemas/
│   │   ├── design-system.schema.ts   # Zod schema (used by both FE + BE)
│   │   ├── generate.schema.ts        # Generate request validation
│   │   └── index.ts
│   │
│   └── utils/
│       ├── colorUtils.ts             # Shared color utilities
│       └── hash.ts                   # Input hash for cache
│
├── tsconfig.json
└── package.json
```

---

## 5. Key File Responsibilities

| File | Responsibility |
|------|---------------|
| `useGenerate.ts` | Manages full generation flow: POST → loading state → parse response → store |
| `designSystem.store.ts` | Zustand store: current system, generation history, selected export format |
| `applyTokens.ts` | Injects generated CSS variables into preview iframe at runtime |
| `pipeline.service.ts` | Full AI pipeline orchestration: input → Claude → validate → compile |
| `token.compiler.ts` | Transforms DesignSystem object into all export formats |
| `validator.service.ts` | WCAG contrast checks + font validation + Zod parsing |
| `schema.ts` (Drizzle) | Single source of truth for DB schema |

---

## 6. Data Flow

### Generation Flow
```
VibeInput.tsx
  → POST /api/generate (via useGenerate hook)
  → generate.controller.ts
  → AIPipelineService.generate()
    → promptBuilder.build()
    → claudeClient.generate()     [Claude API call]
    → outputParser.parse()        [JSON parse + retry]
    → validator.validate()        [Contrast + schema]
    → tokenCompiler.enrich()      [Add derived tokens]
  ← DesignSystem object returned
  ← designSystem.store.ts updated
  → DesignSystemResult.tsx renders
  → applyTokens.ts injects CSS vars into LivePreview iframe
```

### Export Flow
```
ExportPanel.tsx (format selected)
  → POST /api/export (format + design_system)
  → export.controller.ts
  → [css/tailwind/tokens/figma/react].exporter.ts
  ← { code: string, filename: string }
  → CodeBlock.tsx renders syntax-highlighted code
  → ExportButton.tsx → downloadFile.ts → FileSaver
```

---

## 7. Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ColorPalette.tsx` |
| Hooks | camelCase, `use` prefix | `useGenerate.ts` |
| Stores | camelCase, `.store.ts` suffix | `designSystem.store.ts` |
| Services | camelCase, `.service.ts` suffix | `pipeline.service.ts` |
| Controllers | camelCase, `.controller.ts` suffix | `generate.controller.ts` |
| Routes | camelCase, `.route.ts` suffix | `generate.route.ts` |
| Types | PascalCase interfaces, `.types.ts` suffix | `DesignSystem`, `ColorToken` |
| CSS variables | kebab-case with prefix | `--color-primary`, `--font-display` |
| Env vars | UPPER_SNAKE_CASE | `ANTHROPIC_API_KEY` |

---

## 8. Scripts

```json
// Root package.json scripts
{
  "dev": "turbo run dev",
  "build": "turbo run build",
  "test": "turbo run test",
  "lint": "turbo run lint",
  "typecheck": "turbo run typecheck",
  "db:migrate": "pnpm --filter api db:migrate",
  "db:seed": "pnpm --filter api db:seed",
  "db:studio": "pnpm --filter api drizzle-kit studio"
}
```

---

## 9. Git Conventions

**Branch naming:**
- `feat/vibe-input-image-upload`
- `fix/contrast-validation-edge-case`
- `chore/update-dependencies`

**Commit format:** Conventional Commits
```
feat(generate): add reference image color extraction
fix(validator): handle edge case when all text colors fail contrast
chore(deps): update anthropic sdk to latest
docs(ai): update system prompt with injection guards
```
