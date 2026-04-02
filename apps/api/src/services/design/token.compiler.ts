import type { DesignSystem } from '@vibe-to-code/shared'

function encodeFont(font: string): string {
  return encodeURIComponent(font).replace(/%20/g, '+')
}

export function toCSSVariables(system: DesignSystem): string {
  const c = system.colors
  const t = system.typography

  return `/* Vibe-to-Code — "${system.meta.vibe_title}" */

@import url('https://fonts.googleapis.com/css2?family=${encodeFont(t.display_font)}&family=${encodeFont(t.body_font)}&family=${encodeFont(t.mono_font)}&display=swap');

:root {
  --color-primary: ${c.primary.hex};
  --color-primary-hover: ${c.primary_hover.hex};
  --color-secondary: ${c.secondary.hex};
  --color-accent: ${c.accent.hex};
  --color-background: ${c.background.hex};
  --color-surface: ${c.surface.hex};
  --color-surface-elevated: ${c.surface_elevated.hex};
  --color-text-primary: ${c.text_primary.hex};
  --color-text-secondary: ${c.text_secondary.hex};
  --color-text-muted: ${c.text_muted.hex};
  --color-border: ${c.border.hex};
  --color-error: ${c.error.hex};
  --color-success: ${c.success.hex};
  --color-warning: ${c.warning.hex};

  --font-display: '${t.display_font}', serif;
  --font-body: '${t.body_font}', sans-serif;
  --font-mono: '${t.mono_font}', monospace;

  ${Object.entries(t.scale).map(([k, v]) => `--text-${k}: ${v};`).join('\n  ')}

  ${Object.entries(system.spacing.scale).map(([k, v]) => `--space-${k}: ${v};`).join('\n  ')}

  --radius-none: ${system.border_radius.none};
  --radius-sm: ${system.border_radius.sm};
  --radius-md: ${system.border_radius.md};
  --radius-lg: ${system.border_radius.lg};
  --radius-xl: ${system.border_radius.xl};
  --radius-full: ${system.border_radius.full};

  ${system.shadows.map(s => `--shadow-${s.name}: ${s.value};`).join('\n  ')}

  --duration-fast: ${system.animations.duration.fast};
  --duration-normal: ${system.animations.duration.normal};
  --duration-slow: ${system.animations.duration.slow};
  --ease-default: ${system.animations.easing.default};
  --ease-enter: ${system.animations.easing.enter};
  --ease-exit: ${system.animations.easing.exit};
  --ease-spring: ${system.animations.easing.spring};
}

${system.animations.presets.map(p => `
@keyframes ${p.name} {
  ${p.keyframes}
}
`).join('\n')}`.trim()
}

export function toTailwindConfig(system: DesignSystem): string {
  const c = system.colors

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '${c.primary.hex}',
        'primary-hover': '${c.primary_hover.hex}',
        secondary: '${c.secondary.hex}',
        accent: '${c.accent.hex}',
        background: '${c.background.hex}',
        surface: '${c.surface.hex}',
        'surface-elevated': '${c.surface_elevated.hex}',
        'text-primary': '${c.text_primary.hex}',
        'text-secondary': '${c.text_secondary.hex}',
        'text-muted': '${c.text_muted.hex}',
        border: '${c.border.hex}',
        error: '${c.error.hex}',
        success: '${c.success.hex}',
        warning: '${c.warning.hex}',
      },
      fontFamily: {
        display: ['${system.typography.display_font}', 'serif'],
        body: ['${system.typography.body_font}', 'sans-serif'],
        mono: ['${system.typography.mono_font}', 'monospace'],
      },
      borderRadius: ${JSON.stringify(system.border_radius)},
      boxShadow: {
        ${system.shadows.map(s => `'${s.name}': '${s.value}'`).join(',\n        ')}
      },
      animation: {
        ${system.animations.presets.map(p => `'${p.name}': '${p.name} ${system.animations.duration.normal}'`).join(',\n        ')}
      },
    }
  },
}`
}

export function toDesignTokens(system: DesignSystem): string {
  const buildToken = (value: string, type: string) => ({ $value: value, $type: type })
  return JSON.stringify({
    $schema: 'https://design-tokens.github.io/community/schema/format.json',
    vibe: {
      meta: {
        title: { $value: system.meta.vibe_title, $type: 'string' },
        description: { $value: system.meta.vibe_description, $type: 'string' },
      },
      color: {
        primary: buildToken(system.colors.primary.hex, 'color'),
        'primary-hover': buildToken(system.colors.primary_hover.hex, 'color'),
        secondary: buildToken(system.colors.secondary.hex, 'color'),
        accent: buildToken(system.colors.accent.hex, 'color'),
        background: buildToken(system.colors.background.hex, 'color'),
        surface: buildToken(system.colors.surface.hex, 'color'),
        'text-primary': buildToken(system.colors.text_primary.hex, 'color'),
        'text-secondary': buildToken(system.colors.text_secondary.hex, 'color'),
        'text-muted': buildToken(system.colors.text_muted.hex, 'color'),
      },
      font: {
        family: {
          display: buildToken(system.typography.display_font, 'fontFamily'),
          body: buildToken(system.typography.body_font, 'fontFamily'),
          mono: buildToken(system.typography.mono_font, 'fontFamily'),
        },
        scale: {},
      },
    },
  }, null, 2)
}

export function toFigmaTokens(system: DesignSystem): string {
  return JSON.stringify({
    ...JSON.parse(toDesignTokens(system)),
    $name: system.meta.vibe_title,
    figmaExport: { colorFormat: 'hex', fontStyle: 'css' },
  }, null, 2)
}

export function toReactStubs(system: DesignSystem): string {
  const c = system.colors
  return `// Generated React component stubs — "${system.meta.vibe_title}"

import React from 'react'
import './globals.css'

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button
    className="bg-[${c.primary.hex}] text-[${c.background.hex}] hover:bg-[${c.primary_hover.hex}] rounded-md px-4 py-2 transition-colors ${className ?? ''}"
    {...props}
  />
)

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-[${c.surface.hex}] text-[${c.text_primary.hex}] border border-[${c.border.hex}] rounded-lg p-6">
    {children}
  </div>
)

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className="bg-[${c.surface.hex}] text-[${c.text_primary.hex}] border border-[${c.border.hex}] rounded-md px-4 py-3 placeholder:text-[${c.text_muted.hex}] focus:border-[${c.primary.hex}] focus:outline-none transition-colors ${className ?? ''}"
    {...props}
  />
)

export const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[${c.accent.hex}1a] text-[${c.accent.hex}]">
    {children}
  </span>
)
`
}
