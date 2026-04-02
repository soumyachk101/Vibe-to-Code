import { createHash } from 'crypto'
import type { GenerateInput } from '@vibe-to-code/shared/schemas'

export function hashInput(input: GenerateInput): string {
  const normalized = [
    input.vibe.toLowerCase().trim(),
    ...(input.tags || []).sort().join(','),
    input.theme || '',
    input.industry || '',
  ].join('|')
  return createHash('md5').update(normalized).digest('hex')
}
