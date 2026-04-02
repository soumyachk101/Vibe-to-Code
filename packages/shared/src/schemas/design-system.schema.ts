import { z } from 'zod'

export const ColorTokenSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  hsl: z.string(),
})

export const MetaSchema = z.object({
  vibe_title: z.string(),
  vibe_description: z.string(),
  mood_tags: z.array(z.string()),
  theme: z.enum(['dark', 'light', 'auto']),
})

export const TypographyScaleSchema = z.object({
  xs: z.string(), sm: z.string(), base: z.string(), lg: z.string(), xl: z.string(),
  '2xl': z.string(), '3xl': z.string(), '4xl': z.string(), '5xl': z.string(),
})

export const TypographySchema = z.object({
  display_font: z.string(),
  body_font: z.string(),
  mono_font: z.string(),
  scale: TypographyScaleSchema,
  weight: z.object({ light: z.number(), regular: z.number(), medium: z.number(), semibold: z.number(), bold: z.number() }),
  line_height: z.object({ tight: z.string(), normal: z.string(), relaxed: z.string() }),
  letter_spacing: z.object({ tight: z.string(), normal: z.string(), wide: z.string(), wider: z.string() }),
})

export const SpacingSchema = z.object({
  base: z.number(),
  scale: z.record(z.string(), z.string()),
})

export const BorderRadiusSchema = z.object({
  none: z.string(), sm: z.string(), md: z.string(), lg: z.string(), xl: z.string(), full: z.string(),
})

export const ShadowSchema = z.object({
  name: z.string(),
  value: z.string(),
  use_case: z.string(),
})

export const AnimationsSchema = z.object({
  duration: z.object({ fast: z.string(), normal: z.string(), slow: z.string() }),
  easing: z.object({ default: z.string(), enter: z.string(), exit: z.string(), spring: z.string() }),
  presets: z.array(z.object({ name: z.string(), keyframes: z.string(), usage: z.string() })),
})

export const ComponentTokenSchema = z.object({
  bg: z.string(),
  text: z.string(),
  border: z.string(),
  radius: z.string(),
})

export const DesignSystemSchema = z.object({
  meta: MetaSchema,
  colors: z.object({
    primary: ColorTokenSchema,
    primary_hover: ColorTokenSchema,
    secondary: ColorTokenSchema,
    accent: ColorTokenSchema,
    background: ColorTokenSchema,
    surface: ColorTokenSchema,
    surface_elevated: ColorTokenSchema,
    text_primary: ColorTokenSchema,
    text_secondary: ColorTokenSchema,
    text_muted: ColorTokenSchema,
    border: ColorTokenSchema,
    error: ColorTokenSchema,
    success: ColorTokenSchema,
    warning: ColorTokenSchema,
  }),
  typography: TypographySchema,
  spacing: SpacingSchema,
  border_radius: BorderRadiusSchema,
  shadows: z.array(ShadowSchema),
  animations: AnimationsSchema,
  component_tokens: z.record(z.string(), ComponentTokenSchema),
})

export const GenerateInputSchema = z.object({
  vibe: z.string().min(1).max(500),
  tags: z.array(z.string()).optional(),
  theme: z.enum(['dark', 'light', 'auto']).optional(),
  industry: z.string().optional(),
  image_url: z.string().url().optional(),
})

export type DesignSystemInput = z.input<typeof GenerateInputSchema>
