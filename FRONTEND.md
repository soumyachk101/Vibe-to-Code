# Frontend Implementation Guide — Vibe-to-Code
**Version:** 1.0.0  
**Framework:** React 18 + Vite + TypeScript  
**Styling:** Tailwind CSS v4 + CSS Variables  
**Last Updated:** 2026-04-02

---

## 1. Project Setup

```bash
# Create project
pnpm create vite apps/web --template react-ts

# Install dependencies
pnpm add react-router-dom zustand framer-motion chroma-js @radix-ui/react-dialog @radix-ui/react-tooltip lucide-react file-saver axios

pnpm add -D tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom @types/file-saver
```

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        brand: 'var(--color-brand)',
        accent: 'var(--color-accent)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms var(--ease-enter)',
        'slide-up': 'slideUp 250ms var(--ease-enter)',
        'shimmer': 'shimmer 1.5s infinite linear',
        'spin-slow': 'spin 3s linear infinite',
      }
    }
  }
} satisfies Config
```

---

## 2. Page Layouts

### 2.1 Home Page (`pages/Home.tsx`)

```
Layout:
- Full viewport height
- Dark background with subtle noise texture overlay
- Center-aligned hero section

Structure:
┌─────────────────────────────────────────┐
│  Nav (Logo left, Auth right)            │
│─────────────────────────────────────────│
│                                         │
│   [Hero]                                │
│   Describe how you want your app        │
│   to feel — get a design system         │
│                                         │
│   [VibeInput — large textarea]          │
│   [Mood Tag Selector]                   │
│   [Options Row: theme, industry]        │
│   [Generate Button — full width]        │
│                                         │
│   [Gallery Peek — 3 featured vibes]     │
│                                         │
└─────────────────────────────────────────┘
```

**Hero Text Animation:**
```tsx
// Staggered word reveal on mount
const words = ["Describe", "a", "feeling."]
// Each word fades + slides up with 80ms delay between

// Subtitle with Instrument Serif italic
<h2 className="font-display italic text-text-secondary">
  your app will feel exactly like that.
</h2>
```

### 2.2 Result Page (`pages/Result.tsx`)

```
Layout:
- Two-column on desktop (40% tokens | 60% preview)
- Single column on mobile (stacked)
- Sticky top: vibe title + export button

Structure:
┌──────────────────┬──────────────────────┐
│ DESIGN SYSTEM    │ LIVE PREVIEW         │
│ ─────────────    │ ─────────────        │
│ ColorPalette     │ [Viewport toggle     │
│ TypographyPrev   │  Mobile | Desktop]   │
│ SpacingScale     │                      │
│ AnimationPrev    │ [Dark | Light toggle]│
│ ShadowPrev       │                      │
│ ComponentTokens  │ [Preview iframe      │
│                  │  rendering themed    │
│ [Export Panel]   │  components]         │
└──────────────────┴──────────────────────┘
```

### 2.3 Gallery Page (`pages/Gallery.tsx`)

```
Layout:
- Masonry grid (3 col desktop, 2 tablet, 1 mobile)
- Filter bar (sticky): Dark | Light | All + tag filters
- Featured row at top (3 cards, horizontal)
- Infinite scroll / load more

GalleryCard shows:
- Color swatches strip (5–6 dominant colors, horizontal)  
- Font pair name
- Vibe title (display font styled appropriately!)
- Mood tags
- Likes count
```

---

## 3. Key Components

### 3.1 VibeInput (`components/vibe-input/VibeInput.tsx`)

```tsx
export const VibeInput = () => {
  const [vibe, setVibe] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('auto')
  const { generate, isLoading } = useGenerate()

  const charLimit = 500
  const charsLeft = charLimit - vibe.length
  const isNearLimit = charsLeft < 50

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Textarea */}
      <div className="relative">
        <textarea
          value={vibe}
          onChange={e => setVibe(e.target.value.slice(0, charLimit))}
          placeholder="late night Tokyo convenience store, neon glow, tired but alive..."
          rows={4}
          className="w-full bg-surface border border-border rounded-lg p-4 
                     text-text-primary placeholder:text-text-muted
                     focus:border-brand focus:shadow-brand focus:outline-none
                     resize-none text-base font-body transition-all duration-150"
        />
        <span className={`absolute bottom-3 right-3 text-xs font-mono
          ${isNearLimit ? 'text-warning' : 'text-text-muted'}`}>
          {charsLeft}
        </span>
      </div>

      {/* Mood Tag Selector */}
      <MoodTagSelector selected={tags} onChange={setTags} />

      {/* Options Row */}
      <div className="flex gap-3 flex-wrap">
        <ThemeToggle value={theme} onChange={setTheme} />
        <IndustryPicker />
        <ImageUpload />
      </div>

      {/* Generate Button */}
      <button
        onClick={() => generate({ vibe, tags, theme })}
        disabled={!vibe.trim() || isLoading}
        className="w-full bg-brand hover:bg-brand-hover text-white 
                   font-ui font-medium text-base rounded-md py-3 px-6
                   transition-all duration-150 active:translate-y-px
                   disabled:opacity-40 disabled:cursor-not-allowed
                   focus:outline-none focus:shadow-brand"
      >
        {isLoading ? 'Generating...' : 'Generate Design System →'}
      </button>
    </div>
  )
}
```

### 3.2 ColorPalette (`components/result/ColorPalette.tsx`)

```tsx
// Color token display with copy-on-click
export const ColorPalette = ({ colors }: { colors: DesignSystem['colors'] }) => {
  const [copied, setCopied] = useState<string | null>(null)

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-ui font-500 text-text-secondary uppercase tracking-wider">
        Colors
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(colors).map(([name, token]) => (
          <div
            key={name}
            className="flex items-center gap-3 p-2 rounded-md 
                       hover:bg-surface-raised cursor-pointer transition-colors"
            onClick={() => copyHex(token.hex)}
          >
            <div
              className="w-8 h-8 rounded-sm border border-white/10 flex-shrink-0"
              style={{ background: token.hex }}
            />
            <div className="min-w-0">
              <p className="text-xs font-mono text-text-secondary truncate">
                {name.replace(/_/g, '-')}
              </p>
              <p className="text-xs font-mono text-text-muted">
                {copied === token.hex ? '✓ Copied' : token.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### 3.3 Live Preview (`components/preview/LivePreview.tsx`)

```tsx
// Injects CSS variables into iframe for isolated live preview
export const LivePreview = ({ system }: { system: DesignSystem }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    if (!iframeRef.current?.contentDocument) return
    const doc = iframeRef.current.contentDocument
    
    // Inject generated CSS variables + Google Fonts
    const style = doc.createElement('style')
    style.textContent = toCSSVariables(system)
    doc.head.appendChild(style)
    
    // Inject Google Fonts link
    const link = doc.createElement('link')
    link.rel = 'stylesheet'
    link.href = buildGoogleFontsUrl(system.typography)
    doc.head.appendChild(link)
  }, [system])

  return (
    <div className="flex flex-col gap-3">
      {/* Viewport Toggle */}
      <div className="flex gap-1 p-1 bg-surface rounded-md w-fit">
        {(['desktop', 'mobile'] as const).map(v => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`px-3 py-1 text-xs font-ui rounded transition-colors
              ${viewport === v 
                ? 'bg-surface-raised text-text-primary' 
                : 'text-text-muted hover:text-text-secondary'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Preview Frame */}
      <div className={`overflow-hidden rounded-lg border border-border transition-all
        ${viewport === 'mobile' ? 'w-[375px] mx-auto' : 'w-full'}`}>
        <iframe
          ref={iframeRef}
          srcDoc={PREVIEW_HTML_TEMPLATE}
          className="w-full h-[500px] border-0"
          title="Design system preview"
        />
      </div>
    </div>
  )
}
```

### 3.4 Export Panel (`components/export/ExportPanel.tsx`)

```tsx
const EXPORT_FORMATS = [
  { id: 'css',      label: 'CSS Variables',    icon: '{ }',  ext: '.css' },
  { id: 'tailwind', label: 'Tailwind Config',  icon: '⚡',   ext: '.js' },
  { id: 'tokens',   label: 'Design Tokens',    icon: '⬡',    ext: '.json' },
  { id: 'figma',    label: 'Figma Tokens',     icon: '◆',    ext: '.json' },
  { id: 'react',    label: 'React Stubs',      icon: '⚛',    ext: '.tsx' },
]

export const ExportPanel = ({ system }: { system: DesignSystem }) => {
  const [format, setFormat] = useState('css')
  const { exportCode, code, isLoading } = useExport()

  useEffect(() => {
    exportCode(system, format)
  }, [format, system])

  return (
    <div className="space-y-4">
      {/* Format Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {EXPORT_FORMATS.map(f => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            className={`px-3 py-1.5 text-xs font-ui whitespace-nowrap rounded transition-colors
              ${format === f.id
                ? 'bg-brand text-white'
                : 'bg-surface text-text-secondary hover:text-text-primary'}`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Code Block */}
      <CodeBlock code={code} language={format === 'css' ? 'css' : 'javascript'} />

      {/* Download Button */}
      <button
        onClick={() => downloadFile(code, `vibe-${system.meta.vibe_title.toLowerCase().replace(/\s/g,'-')}${EXPORT_FORMATS.find(f => f.id === format)?.ext}`)}
        className="w-full bg-surface border border-border hover:border-brand
                   text-text-primary text-sm font-ui rounded-md py-2.5 px-4
                   transition-all duration-150"
      >
        ↓ Download {EXPORT_FORMATS.find(f => f.id === format)?.label}
      </button>
    </div>
  )
}
```

---

## 4. State Management (Zustand)

### `store/designSystem.store.ts`
```typescript
interface DesignSystemState {
  current: DesignSystem | null
  history: DesignSystem[]
  isGenerating: boolean
  error: string | null
  
  setSystem: (system: DesignSystem) => void
  setGenerating: (loading: boolean) => void
  setError: (error: string | null) => void
  clearCurrent: () => void
}

export const useDesignSystemStore = create<DesignSystemState>((set) => ({
  current: null,
  history: [],
  isGenerating: false,
  error: null,

  setSystem: (system) => set(state => ({
    current: system,
    history: [system, ...state.history].slice(0, 10), // Keep last 10
    isGenerating: false,
    error: null,
  })),
  setGenerating: (loading) => set({ isGenerating: loading }),
  setError: (error) => set({ error, isGenerating: false }),
  clearCurrent: () => set({ current: null }),
}))
```

---

## 5. Custom Hooks

### `hooks/useGenerate.ts`
```typescript
export const useGenerate = () => {
  const { setSystem, setGenerating, setError } = useDesignSystemStore()
  const navigate = useNavigate()

  const generate = async (input: GenerateInput) => {
    setGenerating(true)
    try {
      const data = await generateAPI(input)
      setSystem(data.design_system)
      navigate('/result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    }
  }

  return {
    generate,
    isLoading: useDesignSystemStore(s => s.isGenerating),
    error: useDesignSystemStore(s => s.error),
  }
}
```

---

## 6. Generation Loading Screen

Full-screen cinematic loader while AI generates:

```tsx
const LOADING_MESSAGES = [
  "Reading the vibe...",
  "Mixing the palette...",
  "Pairing the fonts...",
  "Tuning the shadows...",
  "Calibrating the components...",
  "Almost there...",
]

export const GenerationLoader = () => {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm
                 flex flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated gradient orb */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full 
                        bg-gradient-to-br from-brand to-accent 
                        animate-spin-slow opacity-80 blur-xl" />
        <div className="absolute inset-2 rounded-full bg-background" />
      </div>

      {/* Cycling message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          className="font-display italic text-2xl text-text-secondary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
```

---

## 7. Router Setup

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/result"    element={<Result />} />
        <Route path="/gallery"   element={<Gallery />} />
        <Route path="/s/:id"     element={<System />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/auth"      element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 8. Performance Optimizations

- `React.lazy` + `Suspense` for Result, Gallery, Dashboard pages
- `useMemo` for expensive CSS variable compilation in preview
- `useCallback` for generate/export handlers
- Gallery: virtual list (react-virtual) for large collections
- Images: lazy loading + WebP with fallback
- Fonts: `font-display: swap` for non-blocking load
- Code blocks: dynamic import of syntax highlighter (`react-syntax-highlighter`)
