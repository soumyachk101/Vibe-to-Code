import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Download, Sparkles, Palette, Type, Layout,
  Monitor, Smartphone, Copy, Check, ChevronDown, ExternalLink,
  Moon, Sun
} from 'lucide-react'
import type { DesignSystem } from '@vibe-to-code/shared'
import { useDesignSystemStore } from '../store/designSystem.store'
import { useExport } from '../hooks/useExport'

const EXPORT_FORMATS = [
  { format: 'css', label: 'CSS Variables', ext: '.css', icon: '◆' },
  { format: 'tailwind', label: 'Tailwind Config', ext: '.js', icon: '⬡' },
  { format: 'tokens', label: 'Design Tokens', ext: '.json', icon: '{ }' },
  { format: 'figma', label: 'Figma Tokens', ext: '.json', icon: '◇' },
  { format: 'react', label: 'React Stubs', ext: '.tsx', icon: '⚛' },
]

function ColorSwatch({ name, hex, hsl }: { name: string; hex: string; hsl: string }) {
  const [copied, setCopied] = useState(false)

  const copyHex = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Determine text color for contrast on the swatch
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const textColor = luminance > 0.5 ? '#000' : '#fff'

  return (
    <div className="group">
      <div
        className="h-20 sm:h-24 rounded-xl border border-[var(--color-border)] mb-2 cursor-pointer hover:scale-[1.03] hover:shadow-lg transition-all relative flex items-end overflow-hidden"
        style={{ backgroundColor: hex }}
        onClick={copyHex}
      >
        <button
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: `${textColor}22`, color: textColor }}
        >
          {copied ? '✓' : 'Copy'}
        </button>
      </div>
      <div className="text-[var(--color-text-primary)] text-[0.7rem] font-medium capitalize tracking-wide mb-0.5">
        {name.replace(/_/g, ' ')}
      </div>
      <div className="text-[var(--color-text-muted)] text-[0.65rem] font-mono flex items-center gap-1">
        <button
          className="hover:text-[var(--color-text-secondary)] transition-colors"
          onClick={copyHex}
        >
          {hex}
        </button>
        <span className="opacity-30">·</span>
        <span className="opacity-40">{hsl}</span>
      </div>
    </div>
  )
}

function ComponentPreview({ system, themeMode }: { system: DesignSystem; themeMode: 'dark' | 'light' }) {
  const colors = system.colors
  const fonts = system.typography

  const bg = themeMode === 'light' ? (colors.background?.hex || '#fff') : '#0C0C0E'
  const surface = themeMode === 'light' ? (colors.surface?.hex || '#f5f5f5') : '#141416'
  const primary = colors.primary?.hex || '#6B5CE7'
  const primaryHover = colors.primary_hover?.hex || '#5A4ED4'
  const accent = colors.accent?.hex || '#E8FF6B'
  const textPrimary = themeMode === 'light' ? (colors.text_primary?.hex || '#111') : '#F2F2F3'
  const textMuted = themeMode === 'light' ? (colors.text_muted?.hex || '#888') : '#5C5C6E'
  const border = themeMode === 'light' ? (colors.border?.hex || '#e0e0e0') : '#2A2A2E'

  return (
    <div
      className="rounded-xl border border-[var(--color-border)] overflow-hidden transition-colors"
      style={{ backgroundColor: bg }}
    >
      {/* Fake nav bar */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: primary }}>
            <Palette size={12} style={{ color: bg }} />
          </div>
          <span style={{ fontFamily: fonts.display_font, fontSize: '0.8rem', color: textPrimary, fontWeight: 600 }}>Brand</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {['Features', 'Pricing', 'About'].map(item => (
            <span key={item} style={{ fontSize: '0.7rem', color: textMuted }}>{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.65rem', color: textMuted }}>Sign in</span>
          <span
            className="px-3 py-1 rounded-md text-white"
            style={{ fontSize: '0.65rem', backgroundColor: primary }}
          >
            Get Started
          </span>
        </div>
      </div>

      {/* Hero preview */}
      <div className="px-5 py-8 text-center">
        <div className="inline-block px-2 py-0.5 rounded-full text-[0.55rem] font-medium mb-3" style={{ backgroundColor: `${accent}15`, color: accent }}>
          ✨ New Release
        </div>
        <h2 style={{ fontFamily: fonts.display_font, fontSize: '1.3rem', color: textPrimary, lineHeight: 1.15, marginBottom: '6px' }}>
          Build something beautiful
        </h2>
        <p style={{ fontSize: '0.7rem', color: textMuted, maxWidth: 280, margin: '0 auto 16px' }}>
          Your AI-powered design system is ready. Start building with your new tokens.
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: primary, fontSize: '0.7rem' }}>
            Get Started Free
          </span>
          <span className="px-4 py-2 rounded-lg" style={{ backgroundColor: `${primary}12`, color: primary, fontSize: '0.7rem', fontWeight: 500 }}>
            Learn More →
          </span>
        </div>
      </div>

      {/* Cards preview */}
      <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          { title: 'Lightning Fast', value: 'Design in seconds' },
          { title: 'Export Anywhere', value: '5+ formats' },
          { title: 'Fully Custom', value: 'Your vibe, your rules' },
        ].map(card => (
          <div
            key={card.title}
            className="p-3 rounded-lg"
            style={{ backgroundColor: surface, border: `1px solid ${border}` }}
          >
            <div style={{ fontSize: '0.7rem', color: textPrimary, fontWeight: 500, marginBottom: '2px' }}>{card.title}</div>
            <div style={{ fontSize: '0.6rem', color: textMuted }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Interactive elements */}
      <div className="px-5 pb-5 space-y-3">
        {/* Input preview */}
        <div
          className="px-3 py-2 rounded-lg flex items-center justify-between"
          style={{ border: `1px solid ${border}`, backgroundColor: surface }}
        >
          <span style={{ fontSize: '0.65rem', color: textMuted }}>Enter your email...</span>
          <span className="px-2.5 py-1 rounded text-white" style={{ backgroundColor: primary, fontSize: '0.6rem' }}>
            Subscribe
          </span>
        </div>

        {/* Tags/badges */}
        <div className="flex flex-wrap gap-1.5">
          {system.meta.mood_tags?.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${primary}12`, color: primary, fontSize: '0.6rem' }}
            >
              {tag}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.success?.hex || '#4ADE80'}15`, color: colors.success?.hex || '#4ADE80', fontSize: '0.6rem' }}>
            ✓ Success
          </span>
          <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.warning?.hex || '#FBBF24'}15`, color: colors.warning?.hex || '#FBBF24', fontSize: '0.6rem' }}>
            ⚡ Warning
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Result() {
  const { current, isGenerating, error } = useDesignSystemStore()
  const { isExporting, download } = useExport()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'palette' | 'typography' | 'preview'>('palette')
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark')
  const [justDownloaded, setJustDownloaded] = useState<string | null>(null)

  // Loading / error / empty states
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-brand)]/20" />
            <div
              className="absolute inset-0 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            />
            <Sparkles size={24} className="absolute inset-0 m-auto text-[var(--color-brand)]" />
          </div>
          <p className="text-[var(--color-text-primary)] font-medium mb-1">Generating your design system</p>
          <p className="text-[var(--color-text-muted)] text-sm">This usually takes 5–10 seconds</p>
        </div>
      </div>
    )
  }

  if (error && !current) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 flex items-center justify-center">
            <span className="text-2xl">⚠</span>
          </div>
          <p className="text-[var(--color-text-primary)] font-medium text-lg mb-2">Generation Failed</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-5">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-[var(--color-brand)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
            <Sparkles size={24} className="text-[var(--color-text-muted)]" />
          </div>
          <p className="text-[var(--color-text-primary)] font-medium text-lg mb-1">No design system yet</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-5">Generate your first design to see results here.</p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[var(--color-brand)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Generating
          </Link>
        </div>
      </div>
    )
  }

  const system = current

  const TABS: { key: typeof viewMode; label: string; icon: React.ElementType }[] = [
    { key: 'palette', label: 'Colors', icon: Palette },
    { key: 'typography', label: 'Type', icon: Type },
    { key: 'preview', label: 'Preview', icon: Monitor },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <ArrowLeft size={16} />
              <span className="text-sm">New Vibe</span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-border)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[200px]">
              {system.meta.vibe_title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Viewport toggle for preview */}
            {viewMode === 'preview' && (
              <div className="flex items-center bg-[var(--color-surface)] rounded-lg p-0.5 border border-[var(--color-border)]">
                <button
                  onClick={() => setPreviewTheme(p => p === 'dark' ? 'light' : 'dark')}
                  className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {previewTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            )}
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-brand)] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Sparkles size={12} />
              New
            </Link>
          </div>
        </div>
      </header>

      {/* Meta info bar */}
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[var(--color-text-secondary)] text-sm">{system.meta.vibe_description}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider" style={{ backgroundColor: `${system.colors.primary?.hex}15`, color: system.colors.primary?.hex }}>
                {system.meta.theme}
              </span>
              {system.meta.mood_tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-0.5 bg-[var(--color-surface)] rounded-xl p-1 border border-[var(--color-border)] w-fit">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === tab.key
                  ? 'bg-[var(--color-background)] text-[var(--color-text-primary)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6 pb-10">
        {/* ===== PALETTE ===== */}
        {viewMode === 'palette' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-4">Color Palette</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-5">
                  {Object.entries(system.colors).map(([name, token]: [string, unknown]) => (
                    <ColorSwatch
                      key={name}
                      name={name.replace(/_/g, ' ')}
                      hex={(token as { hex: string }).hex}
                      hsl={(token as { hex: string; hsl: string }).hsl}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Radius + Shadows sidebar */}
            <div className="space-y-5">
              {/* Border Radius */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-3">Border Radius</h2>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(system.border_radius).map(([name, value]) => (
                    <div key={name} className="text-center">
                      <div
                        className="w-8 h-8 mx-auto mb-1.5 bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30"
                        style={{ borderRadius: value as string }}
                      />
                      <div className="text-[var(--color-text-primary)] text-[0.6rem] font-medium capitalize">{name}</div>
                      <div className="text-[var(--color-text-muted)] text-[0.55rem] font-mono">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shadows */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-3">Shadows</h2>
                <div className="space-y-2.5">
                  {system.shadows.map(s => (
                    <div key={s.name}>
                      <div
                        className="h-10 rounded-lg bg-[var(--color-surface-raised)]"
                        style={{ boxShadow: s.value }}
                      />
                      <div className="text-[var(--color-text-primary)] text-[0.65rem] font-medium capitalize mt-1">{s.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== TYPOGRAPHY ===== */}
        {viewMode === 'typography' && (
          <div className="space-y-5">
            {/* Font families */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Display', font: system.typography.display_font, family: 'serif', sample: system.meta.vibe_title },
                { label: 'Body', font: system.typography.body_font, family: 'sans-serif', sample: 'The quick brown fox jumps over the lazy dog.' },
                { label: 'Mono', font: system.typography.mono_font, family: 'monospace', sample: 'const x = fn("hello")' },
              ].map(f => (
                <div
                  key={f.label}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5"
                >
                  <div className="text-[var(--color-text-muted)] text-[0.6rem] font-mono uppercase tracking-wider mb-3">{f.label}</div>
                  <div
                    className="text-[var(--color-text-primary)] mb-2 leading-snug"
                    style={{ fontSize: f.label === 'Mono' ? '0.85rem' : '1.4rem', fontFamily: `${f.font}, ${f.family}` }}
                  >
                    {f.font}
                  </div>
                  <div
                    className="text-[var(--color-text-secondary)] mt-3 px-4 py-3 rounded-lg bg-[var(--color-background)]"
                    style={{ fontFamily: `${f.font}, ${f.family}` }}
                  >
                    {f.sample}
                  </div>
                </div>
              ))}
            </div>

            {/* Type scale */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
              <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-4">Type Scale</h2>
              {Object.entries(system.typography.scale).map(([size, value]) => (
                <div key={size} className="flex items-baseline gap-4 py-2.5 border-b border-[var(--color-border)] last:border-0">
                  <div className="w-10 text-[var(--color-text-muted)] text-[0.6rem] font-mono uppercase">{size}</div>
                  <div
                    className="text-[var(--color-text-primary)] leading-tight"
                    style={{ fontSize: '1.1rem', fontFamily: `${system.typography.display_font}, serif` }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Line height & letter spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-3">Line Heights</h2>
                <div className="space-y-3">
                  {Object.entries(system.typography.line_height).map(([name, value]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-[var(--color-text-muted)] text-xs capitalize">{name}</span>
                      <span className="text-[var(--color-text-primary)] text-xs font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium mb-3">Font Weights</h2>
                <div className="space-y-3">
                  {Object.entries(system.typography.weight).map(([name, value]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-[var(--color-text-muted)] text-xs capitalize">{name}</span>
                      <span className="text-[var(--color-text-primary)] text-sm" style={{ fontWeight: value as number }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PREVIEW ===== */}
        {viewMode === 'preview' && (
          <div className="max-w-2xl mx-auto">
            <ComponentPreview system={system} themeMode={previewTheme} />
          </div>
        )}

        {/* Export bar (always visible) */}
        {current && (
          <div className="mt-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-[var(--color-brand)]" />
                <h2 className="text-[var(--color-text-primary)] text-sm font-medium">Export</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EXPORT_FORMATS.map(fmt => {
                const wasJustDownloaded = justDownloaded === fmt.format
                return (
                  <button
                    key={fmt.format}
                    onClick={() => {
                      download(system, fmt.format, system.meta.vibe_title)
                      setJustDownloaded(fmt.format)
                      setTimeout(() => setJustDownloaded(null), 2000)
                    }}
                    disabled={isExporting}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all disabled:opacity-50 ${
                      wasJustDownloaded
                        ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/5 text-[var(--color-success)]'
                        : 'border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span className="text-lg font-mono leading-none w-5 text-center opacity-50">{fmt.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[0.7rem] font-medium truncate">{fmt.label}</div>
                      <div className="text-[var(--color-text-muted)] text-[0.55rem] font-mono">{fmt.ext}</div>
                    </div>
                    {wasJustDownloaded && (
                      <Check size={14} className="ml-auto text-[var(--color-success)] flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
