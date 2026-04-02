# UI Design System — Vibe-to-Code (App's Own Design)
**Version:** 1.0.0  
**Last Updated:** 2026-04-02

> This document defines the design system for the Vibe-to-Code *application itself* — not the generated systems. This is what you implement in `globals.css` and `tailwind.config.ts`.

---

## 1. Design Direction

**Aesthetic:** Dark-first, editorial, typographically bold  
**Tone:** Professional creative tool — confident, precise, slightly cinematic  
**Reference:** Linear.app meets Are.na meets a design museum's digital presence  
**Tagline feel:** "This is a serious tool made by people who care about design"

**What it is NOT:**
- Not a purple-gradient AI product
- Not playful/bubbly
- Not corporate/sterile
- Not another shadcn clone with gray backgrounds

---

## 2. Color Tokens

```css
:root {
  /* Base */
  --color-background:       #0C0C0E;   /* Near-black, slightly warm */
  --color-surface:          #141416;   /* Card / panel backgrounds */
  --color-surface-raised:   #1C1C1F;   /* Elevated surfaces (dropdowns, modals) */
  --color-surface-hover:    #222226;   /* Hover state on surfaces */

  /* Borders */
  --color-border:           #2A2A2E;   /* Default borders */
  --color-border-subtle:    #1F1F22;   /* Very subtle separators */
  --color-border-focus:     #6B5CE7;   /* Focus rings */

  /* Text */
  --color-text-primary:     #F2F2F3;   /* Main text */
  --color-text-secondary:   #9898A6;   /* Secondary text, labels */
  --color-text-muted:       #5C5C6E;   /* Placeholders, disabled */
  --color-text-inverse:     #0C0C0E;   /* Text on bright backgrounds */

  /* Brand */
  --color-brand:            #6B5CE7;   /* Primary brand — deep violet */
  --color-brand-hover:      #5A4ED4;   /* Brand hover state */
  --color-brand-muted:      #6B5CE71A; /* Brand at 10% opacity — for highlights */
  
  /* Accent */
  --color-accent:           #E8FF6B;   /* Electric lime — for highlights, badges */
  --color-accent-hover:     #D4EB56;

  /* Semantic */
  --color-success:          #4ADE80;
  --color-warning:          #FBBF24;
  --color-error:            #F87171;
  --color-info:             #60A5FA;

  /* Special */
  --color-gradient-start:   #6B5CE7;
  --color-gradient-end:     #E8FF6B;
}
```

### Color Usage Rules

| Token | Use |
|-------|-----|
| `--color-background` | Page background only |
| `--color-surface` | Cards, input fields, panels |
| `--color-surface-raised` | Dropdowns, modals, tooltips |
| `--color-brand` | Primary CTA buttons, active states, links |
| `--color-accent` | Badges, highlights, "new" labels, accent text |
| `--color-text-secondary` | Labels, meta text, captions |
| `--color-text-muted` | Placeholders, disabled states |

---

## 3. Typography

### Font Stack

```css
:root {
  /* Display — Headlines, hero text */
  --font-display: 'Instrument Serif', Georgia, serif;

  /* Body — UI text, paragraphs */
  --font-body: 'Geist', 'Helvetica Neue', sans-serif;

  /* Mono — Code blocks, export preview */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* UI — Small labels, tabs, nav items */
  --font-ui: 'Geist', system-ui, sans-serif;
}
```

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Type Scale

```css
:root {
  --text-xs:    0.6875rem;  /* 11px — micro labels */
  --text-sm:    0.8125rem;  /* 13px — captions, meta */
  --text-base:  0.9375rem;  /* 15px — body text */
  --text-md:    1rem;       /* 16px — default */
  --text-lg:    1.125rem;   /* 18px — large body */
  --text-xl:    1.25rem;    /* 20px — section headers */
  --text-2xl:   1.5rem;     /* 24px — card titles */
  --text-3xl:   1.875rem;   /* 30px — page titles */
  --text-4xl:   2.5rem;     /* 40px — hero text */
  --text-5xl:   3.5rem;     /* 56px — display */
  --text-6xl:   5rem;       /* 80px — massive display */
}
```

### Typography Hierarchy

```
Hero heading      → Instrument Serif, 5xl–6xl, weight 400, italic option
Page title        → Geist, 3xl–4xl, weight 600
Section heading   → Geist, 2xl, weight 600
Card title        → Geist, xl, weight 500
Body text         → Geist, base–md, weight 400, line-height 1.6
Label             → Geist, sm, weight 500, letter-spacing 0.02em
Caption           → Geist, xs, weight 400, color text-muted
Code              → JetBrains Mono, sm, weight 400
```

---

## 4. Spacing

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

---

## 5. Border Radius

```css
:root {
  --radius-xs:   4px;
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;
}
```

**Usage:**
- Buttons: `--radius-md` (8px)
- Cards: `--radius-lg` (12px)
- Modals: `--radius-xl` (16px)
- Badges/Pills: `--radius-full`
- Inputs: `--radius-md`

---

## 6. Shadows

```css
:root {
  --shadow-xs:  0 1px 2px rgba(0,0,0,0.4);
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.5);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.6);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.7);
  --shadow-xl:  0 16px 64px rgba(0,0,0,0.8);
  
  /* Brand glow — for CTAs, focused inputs */
  --shadow-brand:  0 0 0 3px rgba(107, 92, 231, 0.35);
  
  /* Accent glow — for highlighted elements */
  --shadow-accent: 0 0 20px rgba(232, 255, 107, 0.15);
  
  /* Inset — for pressed states */
  --shadow-inset: inset 0 1px 3px rgba(0,0,0,0.4);
}
```

---

## 7. Animation

```css
:root {
  /* Durations */
  --duration-instant:  80ms;
  --duration-fast:     150ms;
  --duration-normal:   200ms;
  --duration-slow:     350ms;
  --duration-slower:   500ms;

  /* Easings */
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);   /* Material standard */
  --ease-enter:    cubic-bezier(0, 0, 0.2, 1);       /* Decelerate */
  --ease-exit:     cubic-bezier(0.4, 0, 1, 1);       /* Accelerate */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy */
  --ease-linear:   linear;
}

/* Core keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: var(--shadow-brand); }
  50%       { box-shadow: 0 0 0 6px rgba(107, 92, 231, 0.2); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 8. Component Specs

### 8.1 Button

```
Primary:
  bg: var(--color-brand)
  text: white
  hover: var(--color-brand-hover)
  padding: 10px 20px
  radius: var(--radius-md)
  font: var(--font-ui) 14px weight-500
  transition: background 150ms, transform 100ms
  active: translateY(1px)
  focus: box-shadow var(--shadow-brand)

Secondary:
  bg: var(--color-surface)
  text: var(--color-text-primary)
  border: 1px solid var(--color-border)
  hover bg: var(--color-surface-hover)

Ghost:
  bg: transparent
  text: var(--color-text-secondary)
  hover: bg var(--color-surface-hover)

Accent:
  bg: var(--color-accent)
  text: var(--color-text-inverse)

Sizes:
  sm: padding 6px 12px, text-sm
  md: padding 10px 20px, text-base (default)
  lg: padding 14px 28px, text-lg
```

### 8.2 Input

```
bg: var(--color-surface)
border: 1px solid var(--color-border)
text: var(--color-text-primary)
placeholder: var(--color-text-muted)
radius: var(--radius-md)
padding: 12px 16px
font: var(--font-body) text-base

Focus:
  border-color: var(--color-brand)
  box-shadow: var(--shadow-brand)
  outline: none
  
Error:
  border-color: var(--color-error)
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2)

Transition: border-color 150ms, box-shadow 150ms
```

### 8.3 Card

```
bg: var(--color-surface)
border: 1px solid var(--color-border)
radius: var(--radius-lg)
padding: var(--space-6)
shadow: var(--shadow-sm)

Hover (interactive cards):
  border-color: var(--color-brand)
  shadow: var(--shadow-md), var(--shadow-brand) at 10% opacity
  transition: 200ms ease
```

### 8.4 Badge

```
Variants: default, brand, accent, success, warning, error

Default:
  bg: var(--color-surface-raised)
  text: var(--color-text-secondary)
  border: 1px solid var(--color-border)

Brand:
  bg: var(--color-brand-muted)
  text: var(--color-brand)
  border: 1px solid rgba(107,92,231,0.3)

Accent:
  bg: rgba(232,255,107,0.1)
  text: var(--color-accent)
  border: 1px solid rgba(232,255,107,0.2)

All badges:
  padding: 2px 8px
  radius: var(--radius-full)
  font: text-xs weight-500
```

### 8.5 Color Swatch (Result display)

```
Display: 60px × 60px circle or 40px × 40px rounded square
Hover: Scale 1.1 + shadow
Click: Copy hex to clipboard + toast confirmation
Label: hex value below, token name above in text-xs text-muted
```

---

## 9. Loading States

### Generation Loader
```
Full-screen overlay:
- Background: var(--color-background) at 95% opacity, blur backdrop
- Centered content:
  - Animated gradient orb (brand → accent, slow rotation)
  - Progress text cycling: 
      "Reading the vibe..."
      "Mixing the palette..."
      "Pairing the fonts..."
      "Tuning the components..."
  - Font: Instrument Serif italic, text-2xl

Transition in: fadeIn 300ms
```

### Skeleton Loaders
```
bg: linear-gradient(90deg, 
  var(--color-surface) 0%, 
  var(--color-surface-raised) 50%, 
  var(--color-surface) 100%
)
background-size: 200% 100%
animation: shimmer 1.5s infinite
radius: match the component being loaded
```

---

## 10. Responsive Breakpoints

```css
/* Mobile first */
--bp-sm:  640px;   /* Tablet portrait */
--bp-md:  768px;   /* Tablet landscape */
--bp-lg:  1024px;  /* Desktop */
--bp-xl:  1280px;  /* Wide desktop */
--bp-2xl: 1536px;  /* Ultra-wide */
```

### Layout Grid
- Mobile: 4-column, 16px gutter
- Tablet: 8-column, 24px gutter
- Desktop: 12-column, 32px gutter
- Max container width: 1280px

---

## 11. Iconography

**Library:** Lucide React  
**Default size:** 16px (sm), 20px (default), 24px (lg)  
**Stroke width:** 1.5px (default)  
**Color:** inherits from parent text color

---

## 12. Accessibility

- All interactive elements have visible focus rings (--shadow-brand)
- Minimum touch target: 44×44px
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Motion: respect `prefers-reduced-motion` — disable animations when set
- Screen reader: all icons have `aria-label` or are `aria-hidden` when decorative

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
