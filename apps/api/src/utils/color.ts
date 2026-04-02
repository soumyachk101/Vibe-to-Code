import chroma from 'chroma-js'

export function contrastRatio(hex1: string, hex2: string): number {
  return chroma.contrast(hex1, hex2)
}

export function adjustUntilContrast(hex: string, bgHex: string, minRatio: number): string {
  let color = chroma(hex)
  let bg = chroma(bgHex)
  const isLight = bg.luminance() > 0.5
  for (let i = 0; i < 20; i++) {
    if (chroma.contrast(color, bg) >= minRatio) return color.hex()
    color = isLight ? color.darken(0.2) : color.brighten(0.2)
  }
  return isLight ? '#000000' : '#ffffff'
}

export function hexToHsl(hex: string): string {
  const [h, s, l] = chroma(hex).hsl()
  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}
