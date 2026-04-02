import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthRequest extends Request {
  userId?: string
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next()

  try {
    const decoded = jwt.verify(header.slice(7), env.JWT_SECRET) as { sub: string }
    req.userId = decoded.sub
  } catch {
    // Invalid token, proceed anonymous
  }
  next()
}
