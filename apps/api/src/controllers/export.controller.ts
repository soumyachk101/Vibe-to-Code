import type { Response } from 'express'
import type { DesignSystem } from '@vibe-to-code/shared'
import {
  toCSSVariables, toTailwindConfig, toDesignTokens, toFigmaTokens, toReactStubs,
} from '../services/design/token.compiler'

const exporters = { css: toCSSVariables, tailwind: toTailwindConfig, tokens: toDesignTokens, figma: toFigmaTokens, react: toReactStubs }

export async function exportCode(req: { body: { design_system: DesignSystem; format: string } }, res: Response) {
  const { design_system, format } = req.body
  const fn = exporters[format as keyof typeof exporters]
  if (!fn) return res.status(400).json({ error: { code: 'INVALID_FORMAT', message: `Unknown format: ${format}` } })

  const exts = { css: '.css', tailwind: '.js', tokens: '.json', figma: '.json', react: '.tsx' }
  res.json({ data: { code: fn(design_system), filename: `design-system${exts[format as keyof typeof exts]}` } })
}
