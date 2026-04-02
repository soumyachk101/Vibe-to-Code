import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Sparkles, Github, Mail } from 'lucide-react'

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 flex items-center justify-center">
            <Sparkles size={28} className="text-[var(--color-success)]" />
          </div>
          <h2 className="text-2xl font-[var(--font-display)] text-[var(--color-text-primary)] mb-2">
            {mode === 'signin' ? 'Welcome back!' : 'Account created!'}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm mb-6">
            Auth is a placeholder in development mode. The real thing is coming soon.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[var(--color-brand)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            Continue to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Back link */}
      <div className="px-6 pt-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-accent)] flex items-center justify-center">
              <Sparkles size={22} className="text-[var(--color-background)]" />
            </div>
            <h1 className="text-2xl font-[var(--font-display)] text-[var(--color-text-primary)] mb-1.5">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              {mode === 'signin'
                ? 'Access your saved design systems'
                : 'Start building your design system library'
              }
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-2 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <Github size={16} />
              Continue with GitHub
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-surface-raised)] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[var(--color-text-muted)] text-xs">or</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-[var(--color-text-primary)] text-sm font-medium mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required={mode === 'signup'}
                  className="w-full px-3.5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[var(--color-text-primary)] text-sm font-medium mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[var(--color-text-primary)] text-sm font-medium">
                  Password
                </label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs text-[var(--color-brand)] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 pr-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[var(--color-brand)] to-[var(--brand-hover)] text-white font-medium rounded-xl hover:opacity-95 disabled:opacity-50 transition-all text-sm mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-[var(--color-brand)] font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Legal */}
          <p className="text-center text-[0.6rem] text-[var(--color-text-muted)] mt-6 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />Your data is stored securely and never shared.
          </p>
        </div>
      </div>
    </div>
  )
}
