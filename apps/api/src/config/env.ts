import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(import.meta.dirname, '../../.env') })

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ANTHROPIC_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  UPSTASH_REDIS_URL: z.string().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  JWT_SECRET: z.string().default('dev-secret-change-me'),
  JWT_EXPIRY: z.string().default('7d'),
  GOOGLE_FONTS_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
