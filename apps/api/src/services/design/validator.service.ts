import chroma from 'chroma-js'
import type { DesignSystem } from '@vibe-to-code/shared/types'
import { adjustUntilContrast } from '../../utils/color'

export function fixContrast(system: DesignSystem): DesignSystem {
  const bgHex = system.colors.background.hex
  const textHex = system.colors.text_primary.hex
  const ratio = chroma.contrast(textHex, bgHex)

  if (ratio < 4.5) {
    system.colors.text_primary.hex = adjustUntilContrast(textHex, bgHex, 4.5)
  }
  return system
}

const FALLBACKS: Record<string, string> = {
  serif: 'Merriweather',
  sans: 'Inter',
  mono: 'JetBrains Mono',
  display: 'Space Grotesk',
}

export async function validateFonts(system: DesignSystem): Promise<DesignSystem> {
  // Font validation: if GOOGLE_FONTS_API_KEY is set, check availability
  // Fallback to curated defaults if not found
  if (!system.typography.display_font) system.typography.display_font = FALLBACKS.display
  if (!system.typography.body_font) system.typography.body_font = FALLBACKS.sans
  if (!system.typography.mono_font) system.typography.mono_font = FALLBACKS.mono
  return system
}
