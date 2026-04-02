import { Router } from 'express'
import { exportCode } from '../controllers/export.controller'
import { z } from 'zod'
import { validate } from '../middleware/validate.middleware'

const router = Router()
router.post('/', validate(z.object({ design_system: z.any(), format: z.enum(['css', 'tailwind', 'tokens', 'figma', 'react']) })), exportCode)
export default router
