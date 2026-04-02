import { Router } from 'express'
import generateRoute from './generate.route'
import exportRoute from './export.route'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()
router.use('/generate', authMiddleware, generateRoute)
router.use('/export', authMiddleware, exportRoute)
export default router
