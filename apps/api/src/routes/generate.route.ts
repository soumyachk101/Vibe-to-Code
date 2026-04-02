import { Router } from 'express'
import { generate } from '../controllers/generate.controller'
import { validate } from '../middleware/validate.middleware'
import { GenerateInputSchema } from '@vibe-to-code/shared/schemas'
import { generateLimiter } from '../middleware/rateLimit.middleware'

const router = Router()
router.post('/', generateLimiter, validate(GenerateInputSchema), generate)
export default router
