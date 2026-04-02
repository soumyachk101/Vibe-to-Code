import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Sparkles, Palette, TrendingUp, Zap } from 'lucide-react'

const SHOWCASE = [
  {
    title: 'Midnight Luxury',
    vibe: 'Black marble, gold accents, heavy serif, slow transitions',
    colors: ['#0C0C0C', '#1A1A1A', '#D4AF37', '#FFFFFF', '#3D3D3D'],
    font: 'Playfair Display',
    theme: 'dark',
  },
  {
    title: 'Scandi Café',
    vibe: 'A rainy Sunday in Copenhagen — muted, warm, unhurried',
    colors: ['#F5F0EB', '#E8DDD3', '#8B7355', '#2D2926', '#C4A882'],
    font: 'Inter',
    theme: 'light',
  },
  {
    title: 'Neon Tokyo',
    vibe: '3am convenience store in Shinjuku — electric, alive, slightly tired',
    colors: ['#0A0A1A', '#1A0A2E', '#FF006E', '#00F5FF', '#FFF600'],
    font: 'Space Grotesk',
    theme: 'dark',
  },
  {
    title: 'Forest Walk',
    vibe: 'Morning light through pine trees — earthy, calm, organic textures',
    colors: ['#1B2A1B', '#2D3E2D', '#87A878', '#FFF8F0', '#5C4033'],
    font: 'DM Serif',
    theme: 'dark',
  },
  {
    title: 'Bauhaus Reborn',
    vibe: '1920s meets 2020s — grid, primary colors, geometric shapes',
    colors: ['#FFFFFF', '#000000', '#E60000', '#0058D4', '#FFCC00'],
    font: 'Montserrat',
    theme: 'light',
  },
  {
    title: 'Ocean Glass',
    vibe: 'Sea glass on a Mediterranean beach — pastel, translucent, soft',
    colors: ['#F0F8FF', '#C8E6FF', '#7FB3BC', '#2D5F5F', '#A7C5BD'],
    font: 'Cormorant',
    theme: 'light',
  },
]

function ShowcaseCard({ item }: { item: typeof SHOWCASE[0] }) {
  return (
    <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-[var(--color-brand)]/30 transition-all">
      {/* Color strip */}
      <div className="flex h-16">
        {item.colors.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[var(--color-text-primary)] font-medium">{item.title}</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
            item.theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]'
          }`}>
            {item.theme}
          </span>
        </div>
        <p className="text-[var(--color-text-muted)] text-xs leading-relaxed mb-3 line-clamp-2">
          {item.vibe}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-muted)] text-[0.65rem] font-mono">{item.font}</span>
          <span className="text-[var(--color-brand)] text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            View →
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Gallery() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <ArrowLeft size={16} />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-[var(--color-border)]" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Community Gallery</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-brand)] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles size={12} />
            Create New
          </Link>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-[var(--font-display)] text-[var(--color-text-primary)] mb-2">
            Community Gallery
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Discover design systems created by the community. Remix any vibe to make it your own.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-10">
          {[
            { icon: Palette, value: '1,247', label: 'Designs' },
            { icon: TrendingUp, value: '342', label: 'This Week' },
            { icon: Zap, value: '< 6s', label: 'Avg. Gen Time' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-[var(--color-brand)] mb-1">
                <stat.icon size={14} />
                <span className="text-lg font-medium">{stat.value}</span>
              </div>
              <div className="text-[var(--color-text-muted)] text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOWCASE.map(item => (
            <ShowcaseCard key={item.title} item={item} />
          ))}
        </div>

        {/* Coming soon note */}
        <div className="text-center mt-10 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-dashed">
          <Plus size={20} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-primary)] text-sm font-medium mb-1">Your designs will appear here</p>
          <p className="text-[var(--color-text-muted)] text-xs">
            Sign in to save and manage your design systems
          </p>
          <Link to="/auth" className="inline-block mt-3 text-[var(--color-brand)] text-sm hover:underline">
            Create an account →
          </Link>
        </div>
      </div>
    </div>
  )
}
