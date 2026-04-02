import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Palette, Code2, Zap, Github, GalleryHorizontal, UserCircle2 } from 'lucide-react'
import { useGenerate } from '../hooks/useGenerate'

const EXAMPLES = [
  'Midnight luxury, black marble, gold accents, slow and heavy',
  'A rainy Sunday in a Scandinavian caf\xe9 \u2014 muted, warm, unhurried',
  'Neon Tokyo convenience store at 2am \u2014 electric, alive, slightly tired',
  'Minimalist Swiss architecture firm \u2014 clean grid, bold type, white space',
  '1980s Miami Vice meeting space startup \u2014 loud gradients, big fonts',
]

const FEATURES = [
  {
    icon: Palette,
    title: 'Complete Color Systems',
    description: 'Full palettes with semantic mapping \u2014 primaries, accents, surfaces, text, and status colors in hex + HSL.'
  },
  {
    icon: Code2,
    title: 'Production-Ready Code',
    description: 'Export as CSS variables, Tailwind config, design tokens JSON, Figma variables, or React component stubs.'
  },
  {
    icon: Zap,
    title: 'Typography & Beyond',
    description: 'Font pairings from Google Fonts, spacing scales, border radius presets, shadows, and animation curves.'
  },
]

export default function Home() {
  const [vibe, setVibe] = useState('')
  const [tags, setTags] = useState('')
  const [industry, setIndustry] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { generate, isLoading, error } = useGenerate()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [vibe])

  // Cycle placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % EXAMPLES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vibe.trim()) return
    await generate({
      vibe: vibe.trim(),
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      industry: industry.trim() || undefined,
      theme,
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] flex items-center justify-center">
              <Palette size={16} className="text-[var(--color-background)]" />
            </div>
            <span className="font-[var(--font-display)] text-[var(--color-text-primary)] text-lg tracking-tight">vibe-to-code</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link to="/gallery" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] transition-colors">
              <GalleryHorizontal size={14} />
              Gallery
            </Link>
            <Link to="/auth" className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] transition-colors">
              <UserCircle2 size={14} />
              Sign In
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener" className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] transition-colors ml-1">
              <Github size={16} />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <div className="relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--color-brand)]/[0.03] blur-[80px] rounded-full" />
            <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-[var(--color-accent)]/[0.02] blur-[60px] rounded-full" />
          </div>

          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs mb-6">
              <Sparkles size={12} className="text-[var(--color-accent)]" />
              AI-powered design system generation
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-[10px] font-mono">MVP</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-[3.5rem] font-[var(--font-display)] text-[var(--color-text-primary)] mb-5 leading-[1.1] tracking-tight">
              Describe a vibe.
              <br />
              <span className="bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-brand-hover)] to-[var(--color-accent)] bg-clip-text text-transparent">
                Get a design system.
              </span>
            </h1>

            <p className="text-[var(--color-text-secondary)] text-[1.05rem] max-w-lg mx-auto leading-relaxed">
              Describe the feeling you want your interface to evoke \u2014 get back a complete,
              production-ready design system with colors, typography, spacing, and code.
            </p>
          </div>
        </div>

        {/* Input Card */}
        <div className="max-w-2xl mx-auto px-6 pb-10">
          <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-background)]/50">
            {/* Vibe textarea */}
            <div className="p-5 pb-4">
              <textarea
                ref={textareaRef}
                value={vibe}
                onChange={e => setVibe(e.target.value)}
                placeholder={EXAMPLES[placeholderIndex]}
                className="w-full bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-[0.95rem] leading-relaxed resize-none focus:outline-none"
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {/* Theme picker */}
                  <div className="flex items-center bg-[var(--color-background)] rounded-lg p-0.5 border border-[var(--color-border)]">
                    {([
                      { v: 'dark' as const, label: 'Dark' },
                      { v: 'light' as const, label: 'Light' },
                      { v: 'auto' as const, label: 'Auto' },
                    ]).map(t => (
                      <button
                        key={t.v}
                        type="button"
                        onClick={() => setTheme(t.v)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                          theme === t.v
                            ? 'bg-[var(--color-brand)] text-white shadow-sm'
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[var(--color-text-muted)] text-[10px] font-mono">{vibe.length}/500</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border)] mx-5" />

            {/* Optional fields row */}
            <div className="p-5 pt-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="Mood tags (e.g., minimal, warm, playful)"
                  className="flex-1 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[0.8rem] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  placeholder="Industry"
                  className="w-44 px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[0.8rem] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-error)]/5 border border-[var(--color-error)]/10 text-[var(--color-error)] text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !vibe.trim()}
                className="group w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[var(--color-brand)] to-[var(--brand-hover)] text-white font-medium rounded-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Sparkles size={16} className="animate-pulse" />
                    Generating your design system\u2026
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Design System
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--color-border)] rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[var(--color-surface)] p-6 group">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <f.icon size={18} className="text-[var(--color-brand)]" />
                </div>
                <h3 className="text-[var(--color-text-primary)] text-sm font-medium mb-1.5">{f.title}</h3>
                <p className="text-[var(--color-text-muted)] text-[0.8rem] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>vibe-to-code \u2014 turn feelings into design systems</span>
          <span>Built with Claude \u2022 Google Fonts \u2022 Anthropic API</span>
        </div>
      </footer>
    </div>
  )
}
