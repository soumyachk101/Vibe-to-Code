import type { Request, Response } from 'express'
import { runPipeline } from '../services/ai/pipeline.service'
import { toCSSVariables, toTailwindConfig, toDesignTokens, toFigmaTokens, toReactStubs } from '../services/design/token.compiler'
import { DesignSystemSchema } from '@vibe-to-code/shared/schemas'
import type { AuthRequest } from '../middleware/auth.middleware'
import { db } from '../config/db'
import { design_systems } from '../db/schema'
import { hashInput } from '../utils/hash'

export async function generate(req: AuthRequest, res: Response) {
  const { vibe, tags, theme, industry } = req.body as { vibe: string; tags?: string[]; theme?: string; industry?: string }
  const start = Date.now()

  try {
    const system = await runPipeline({ vibe, tags, theme, industry })

    const exports = {
      css: toCSSVariables(system),
      tailwind: toTailwindConfig(system),
      tokens: toDesignTokens(system),
      figma: toFigmaTokens(system),
      react: toReactStubs(system),
    }

    const parsed = DesignSystemSchema.parse(system)

    if (req.userId) {
      await db.insert(design_systems).values({
        user_id: req.userId,
        vibe_text: vibe,
        mood_tags: tags,
        preferred_theme: theme,
        industry,
        design_system: parsed as unknown as Record<string, unknown>,
        vibe_title: parsed.meta.vibe_title,
        vibe_description: parsed.meta.vibe_description,
        theme: parsed.meta.theme,
        primary_color: parsed.colors.primary.hex,
        display_font: parsed.typography.display_font,
        body_font: parsed.typography.body_font,
        input_hash: hashInput({ vibe, tags, theme, industry }),
      })
    }

    res.json({ data: { design_system: parsed, exports } })
  } catch (err) {
    const time = Date.now() - start
    console.error(`[generate] failed after ${time}ms:`, err)
    res.status(503).json({ error: { code: 'GENERATION_FAILED', message: 'AI generation failed. Please try again.' } })
  }
}
