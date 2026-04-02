import Anthropic from '@anthropic-ai/sdk'
import { env } from '../../config/env'

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

export const AI_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2048,
  temperature: 0.8,
}

export async function callClaude(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    ...AI_CONFIG,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock) throw new Error('Claude returned empty content')
  return textBlock.text
}
