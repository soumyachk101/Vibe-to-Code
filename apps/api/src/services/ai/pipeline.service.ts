import type { DesignSystem } from '@vibe-to-code/shared/types'
import { DesignSystemSchema } from '@vibe-to-code/shared/schemas'
import { hashInput } from '../../utils/hash'
import { callClaude } from './claude.client'
import { buildPrompt } from './prompt.builder'
import { parseJSON } from './output.parser'
import { fixContrast, validateFonts } from '../design/validator.service'
import { env } from '../../config/env'
import { redis } from '../../config/redis'

const CACHE_TTL = 86400 // 24h

export async function runPipeline(input: {
  vibe: string
  tags?: string[]
  theme?: string
  industry?: string
  dominantColors?: string[]
}): Promise<DesignSystem> {
  // Check cache
  if (redis) {
    const key = `gen:${hashInput(input)}`
    const cached = await redis.get(key)
    if (cached) return cached as DesignSystem
  }

  const prompt = buildPrompt(input)
  const raw = await callClaude(prompt)
  const parsed = await parseJSON(raw)
  const validated = DesignSystemSchema.parse(parsed)
  const contrasted = fixContrast(validated)
  const withFonts = await validateFonts(contrasted)

  if (redis) {
    const key = `gen:${hashInput(input)}`
    await redis.setex(key, CACHE_TTL, JSON.stringify(withFonts))
  }

  return withFonts as unknown as DesignSystem
}
