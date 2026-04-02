# PRD — Vibe-to-Code
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Senior Product Lead  
**Last Updated:** 2026-04-02

---

## 1. Overview

### 1.1 Problem Statement
Designers and developers spend hours translating vague aesthetic briefs ("make it feel luxurious", "I want it to feel like a rainy Sunday") into concrete design systems. This translation from emotion → design token is entirely manual, inconsistent, and expertise-dependent.

Non-designers building products (indie hackers, founders, no-code builders) have no structured way to go from "feeling" to working UI components.

### 1.2 Product Vision
**Vibe-to-Code** is an AI-powered design system generator. A user describes a vibe in plain language — a mood, a memory, a reference — and the system outputs a complete, production-ready design system: color palettes, typography pairs, spacing scale, animation presets, component variants, and exportable code (CSS Variables, Tailwind config, design tokens JSON).

### 1.3 One-Line Pitch
> "Describe how you want your app to *feel* — get back a complete design system in seconds."

---

## 2. Target Users

| Persona | Description | Pain Point |
|--------|-------------|------------|
| **Indie Hacker** | Solo founder building SaaS | No design skills, needs fast UI setup |
| **No-Code Builder** | Framer/Webflow user | Struggles with consistent visual language |
| **Frontend Dev** | Can code but can't design | Takes hours to pick colors + fonts that work |
| **Agency Designer** | Builds for clients | Needs rapid mood-board to design token pipeline |
| **Hackathon Participant** | 24–48hr builder | Needs a working design system in < 5 mins |

**Primary ICP:** Indie hackers + hackathon devs  
**Secondary ICP:** Agency designers doing rapid prototyping

---

## 3. Core Features (MVP)

### 3.1 Vibe Input
- Free-text vibe description (e.g., *"midnight luxury, black marble, gold accents, slow and heavy"*)
- Optional: mood keyword tags (Dark / Light / Energetic / Calm / Playful / Corporate)
- Optional: reference image upload (for color extraction as vibe hint)
- Optional: industry context (SaaS / E-commerce / Portfolio / App / Landing Page)

### 3.2 AI Design System Generation
The AI returns a complete design system:

| Output | Details |
|--------|---------|
| **Color Palette** | Primary, Secondary, Accent, Background, Surface, Text, Error, Success (with hex + HSL) |
| **Typography** | Display font + Body font pair (Google Fonts), size scale (xs → 5xl), line-height, letter-spacing |
| **Spacing Scale** | 4px base grid, t-shirt sizing (xs → 3xl) |
| **Border Radius** | System-wide radius values |
| **Shadow System** | 3–5 elevation levels |
| **Animation Presets** | Duration, easing curves, named transition presets (enter, exit, hover, pulse) |
| **Semantic Color Mapping** | Maps palette to UI roles (button primary, card bg, nav bg, etc.) |

### 3.3 Component Preview
- Live rendered UI preview: Button variants, Card, Input, Badge, Nav bar, Hero section
- Dark mode toggle preview
- Mobile / Desktop viewport switch

### 3.4 Export Options
- **CSS Variables** (`:root {}` stylesheet)
- **Tailwind config** (`tailwind.config.js`)
- **Design Tokens JSON** (W3C format)
- **Figma Variables** (JSON importable via Figma Tokens plugin)
- **React component stubs** (Shadcn/Radix style with applied tokens)

### 3.5 Save & History
- Save named design systems to user account
- Fork/remix a past vibe
- Public gallery of community vibes (opt-in)

---

## 4. Out of Scope (MVP)

- Full component library generation (post-MVP)
- Figma plugin (post-MVP)
- VS Code extension (post-MVP)
- Team collaboration / commenting
- Custom font upload
- A/B testing design variants

---

## 5. User Journey (Happy Path)

```
Land on homepage
    ↓
Enter vibe: "late night Tokyo convenience store, neon glow, tired but alive"
    ↓
(Optional) Select tags: Dark, Energetic, Product App
    ↓
Click "Generate Design System"
    ↓
AI processes (~3–6 seconds) with loading animation
    ↓
See live preview: color swatches + typography + component previews
    ↓
Toggle dark/light mode preview
    ↓
Click "Export" → choose CSS Variables / Tailwind / Tokens
    ↓
Copy/download code
    ↓
(Optional) Save to account / share to gallery
```

---

## 6. Success Metrics

| Metric | MVP Target (Month 1) |
|--------|----------------------|
| Vibes Generated | 1,000+ |
| Export Rate (generated → exported) | > 40% |
| Return Users (Day 7) | > 20% |
| Gallery Public Shares | > 100 |
| Avg Generation Time | < 6 seconds |
| NPS | > 40 |

---

## 7. Competitive Landscape

| Tool | Gap |
|------|-----|
| Coolors.co | Only colors, no system, no code |
| Huemint | Colors only, no typography/components |
| Figma AI | Requires Figma, no vibe input |
| v0.dev | Component generation, not design system |
| Style Dictionary | Manual, no AI, dev-only |

**Our moat:** End-to-end vibe → usable code in one shot. No tool does emotion-to-design-token today.

---

## 8. Constraints & Assumptions

- MVP is web-only (React + Node)
- Auth is optional for generation, required for saving
- Google Fonts only for MVP (no custom font upload)
- AI provider: Anthropic Claude API (claude-sonnet-4-20250514)
- Export formats: CSS Vars + Tailwind config as must-haves, others as stretch
- No mobile app for MVP

---

## 9. Risks

| Risk | Mitigation |
|------|-----------|
| AI generates inconsistent/ugly palettes | Strict JSON schema + post-processing validation (contrast ratios, HSL harmony checks) |
| Low retention after one use | Gallery/community feature + saved history drives return |
| Too many export formats adds complexity | Ship CSS Vars + Tailwind first, others behind flag |
| Font API rate limits | Cache popular pairs, fallback list |
