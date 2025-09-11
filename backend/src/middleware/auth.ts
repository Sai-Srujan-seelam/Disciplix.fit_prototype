import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/config'
import { prisma } from '@/config/database'
import { AppError } from './errorHandler'
import { logger } from '@/utils/logger'

interface JwtPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

declare global {
  namespace Express {
    interface Request {
      user?: any
      userId?: string
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next(new AppError('Access token is required', 401))
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        createdAt: true,
        subscription: {
          select: {
            tier: true,
            status: true
          }
        }
      }
    })

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401))
    }

    if (!user.verified) {
      return next(new AppError('Please verify your email address first', 401))
    }

    req.user = user
    req.userId = user.id
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401))
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token has expired', 401))
    }
    
    logger.error('Auth middleware error:', error)
    return next(new AppError('Authentication failed', 401))
  }
}

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        verified: true,
        subscription: {
          select: {
            tier: true,
            status: true
          }
        }
      }
    })

    if (user && user.verified) {
      req.user = user
      req.userId = user.id
    }

    next()
  } catch (error) {
    // If token is invalid, just continue without user
    next()
  }
}

export const requireSubscription = (tiers: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    const userTier = req.user.subscription?.tier || 'FREE'
    
    if (!tiers.includes(userTier)) {
      return next(new AppError('Subscription upgrade required', 403))
    }

    next()
  }
}

export const requireVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401))
  }

  if (!req.user.verified) {
    return next(new AppError('Email verification required', 403))
  }

  next()
}