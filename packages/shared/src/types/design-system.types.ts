export interface ColorToken {
  hex: string
  hsl: string
}

export type Theme = 'dark' | 'light' | 'auto'

export interface Meta {
  vibe_title: string
  vibe_description: string
  mood_tags: string[]
  theme: Theme
}

export interface Colors {
  primary: ColorToken
  primary_hover: ColorToken
  secondary: ColorToken
  accent: ColorToken
  background: ColorToken
  surface: ColorToken
  surface_elevated: ColorToken
  text_primary: ColorToken
  text_secondary: ColorToken
  text_muted: ColorToken
  border: ColorToken
  error: ColorToken
  success: ColorToken
  warning: ColorToken
}

export interface TypographyScale {
  xs: string; sm: string; base: string; lg: string; xl: string
  '2xl': string; '3xl': string; '4xl': string; '5xl': string
}

export interface FontWeights {
  light: number; regular: number; medium: number
  semibold: number; bold: number
}

export interface LineHeights {
  tight: string; normal: string; relaxed: string
}

export interface LetterSpacing {
  tight: string; normal: string; wide: string; wider: string
}

export interface Typography {
  display_font: string
  body_font: string
  mono_font: string
  scale: TypographyScale
  weight: FontWeights
  line_height: LineHeights
  letter_spacing: LetterSpacing
}

export interface Spacing {
  base: number
  scale: Record<string, string>
}

export interface BorderRadius {
  none: string; sm: string; md: string; lg: string; xl: string; full: string
}

export interface Shadow {
  name: string
  value: string
  use_case: string
}

export interface Animations {
  duration: { fast: string; normal: string; slow: string }
  easing: { default: string; enter: string; exit: string; spring: string }
  presets: Array<{ name: string; keyframes: string; usage: string }>
}

export interface ComponentToken {
  bg: string; text: string; border: string
  radius: string
}

export type ComponentTokens = Record<string, ComponentToken>

export interface DesignSystem {
  meta: Meta
  colors: Colors
  typography: Typography
  spacing: Spacing
  border_radius: BorderRadius
  shadows: Shadow[]
  animations: Animations
  component_tokens: ComponentTokens
}

export interface ExportBundle {
  css: string
  tailwind: string
  tokens: string
  figma: string
  react: string
}

export interface GenerateInput {
  vibe: string
  tags?: string[]
  theme?: Theme
  industry?: string
  image_url?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: { code: string; message: string; details?: unknown; request_id?: string }
}

export interface SavedSystem {
  id: string
  vibe_title: string
  vibe_description: string
  primary_color: string
  display_font: string
  body_font: string
  theme: Theme
  is_public: boolean
  created_at: string
}
