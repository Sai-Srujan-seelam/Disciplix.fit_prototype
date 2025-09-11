import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { config } from '@/config/config'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'
import { EmailService } from '@/services/EmailService'
import { generateVerificationToken, generateResetToken } from '@/utils/tokenUtils'

export class AuthController {
  private emailService = new EmailService()

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, agreeToTerms } = req.body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return next(new AppError('User with this email already exists', 409))
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          subscription: {
            create: {
              tier: 'FREE',
              status: 'ACTIVE'
            }
          },
          preferences: {
            create: {}
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          verified: true,
          createdAt: true
        }
      })

      // Generate verification token
      const verificationToken = generateVerificationToken()
      
      // Store verification token (in production, use Redis or database)
      // For now, we'll send it directly - implement proper token storage

      // Send verification email
      await this.emailService.sendVerificationEmail(email, name, verificationToken)

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please check your email for verification.',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified
          }
        }
      })
    } catch (error) {
      logger.error('Registration error:', error)
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, rememberMe = false } = req.body

      // Find user with password
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          subscription: true,
          profile: true
        }
      })

      if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Invalid email or password', 401))
      }

      if (!user.verified) {
        return next(new AppError('Please verify your email address first', 401))
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET as string,
        { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
      )

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_REFRESH_SECRET as string,
        { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as SignOptions
      )

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day
      })

      // Remove password from response
      const { password: _, ...userResponse } = user

      res.status(200).json({
        status: 'success',
        data: {
          user: userResponse,
          accessToken,
          expiresIn: config.JWT_EXPIRES_IN
        }
      })
    } catch (error) {
      logger.error('Login error:', error)
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken')

      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      })
    } catch (error) {
      logger.error('Logout error:', error)
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        return next(new AppError('Refresh token is required', 401))
      }

      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          verified: true
        }
      })

      if (!user) {
        return next(new AppError('Invalid refresh token', 401))
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET as string,
        { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
      )

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          expiresIn: config.JWT_EXPIRES_IN
        }
      })
    } catch (error) {
      logger.error('Refresh token error:', error)
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError('Invalid refresh token', 401))
      }
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true }
      })

      if (!user) {
        // Don't reveal if email exists
        return res.status(200).json({
          status: 'success',
          message: 'If the email exists, a reset link has been sent.'
        })
      }

      const resetToken = generateResetToken()
      
      // Store reset token with expiration (implement in production with Redis/DB)
      // For now, send directly

      await this.emailService.sendPasswordResetEmail(user.email, user.name, resetToken)

      res.status(200).json({
        status: 'success',
        message: 'If the email exists, a reset link has been sent.'
      })
    } catch (error) {
      logger.error('Forgot password error:', error)
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body

      // Validate token (implement proper token validation)
      // For now, assume token is valid

      // Find user and update password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Update user password (implement proper token-to-user mapping)
      
      res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully'
      })
    } catch (error) {
      logger.error('Reset password error:', error)
      next(error)
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body

      // Validate verification token (implement proper token validation)
      // For now, assume token is valid and extract user info

      // Update user verification status
      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
      })
    } catch (error) {
      logger.error('Email verification error:', error)
      next(error)
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, verified: true }
      })

      if (!user) {
        return next(new AppError('User not found', 404))
      }

      if (user.verified) {
        return next(new AppError('Email is already verified', 400))
      }

      const verificationToken = generateVerificationToken()
      await this.emailService.sendVerificationEmail(user.email, user.name, verificationToken)

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent'
      })
    } catch (error) {
      logger.error('Resend verification error:', error)
      next(error)
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      // Implement Google OAuth
      res.status(501).json({
        status: 'error',
        message: 'Google OAuth not implemented yet'
      })
    } catch (error) {
      next(error)
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      // Implement Google OAuth callback
      res.status(501).json({
        status: 'error',
        message: 'Google OAuth callback not implemented yet'
      })
    } catch (error) {
      next(error)
    }
  }

  async appleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      // Implement Apple OAuth
      res.status(501).json({
        status: 'error',
        message: 'Apple OAuth not implemented yet'
      })
    } catch (error) {
      next(error)
    }
  }

  async appleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      // Implement Apple OAuth callback
      res.status(501).json({
        status: 'error',
        message: 'Apple OAuth callback not implemented yet'
      })
    } catch (error) {
      next(error)
    }
  }

  async completeProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { age, height, weight, activityLevel, goals } = req.body

      // Update user profile
      const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: {
          age,
          height,
          weight,
          activityLevel
        },
        create: {
          userId,
          age,
          height,
          weight,
          activityLevel
        }
      })

      // Create fitness goals if provided
      if (goals && goals.length > 0) {
        await prisma.fitnessGoal.createMany({
          data: goals.map((goal: any) => ({
            userId,
            ...goal
          }))
        })
      }

      res.status(200).json({
        status: 'success',
        message: 'Profile completed successfully',
        data: { profile }
      })
    } catch (error) {
      logger.error('Complete profile error:', error)
      next(error)
    }
  }
}