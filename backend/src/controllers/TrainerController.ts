import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { AppError } from '@/middleware/errorHandler'
import { logger } from '@/utils/logger'

export class TrainerController {
  // Get all trainers with filtering and pagination
  async getTrainers(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 12,
        specialty,
        minRate,
        maxRate,
        minRating,
        search,
        sortBy = 'rating',
        sortOrder = 'desc'
      } = req.query

      const pageNum = parseInt(page as string)
      const limitNum = parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // Build where clause
      const where: any = {
        isVerified: true,
        isAvailable: true
      }

      if (specialty) {
        where.specialties = {
          has: specialty as string
        }
      }

      if (minRate || maxRate) {
        where.hourlyRate = {}
        if (minRate) where.hourlyRate.gte = parseFloat(minRate as string)
        if (maxRate) where.hourlyRate.lte = parseFloat(maxRate as string)
      }

      if (minRating) {
        where.rating = {
          gte: parseFloat(minRating as string)
        }
      }

      if (search) {
        where.OR = [
          { user: { name: { contains: search as string, mode: 'insensitive' } } },
          { bio: { contains: search as string, mode: 'insensitive' } },
          { specialties: { has: search as string } }
        ]
      }

      // Build orderBy
      let orderBy: any = {}
      if (sortBy === 'rating') {
        orderBy = { rating: sortOrder }
      } else if (sortBy === 'price') {
        orderBy = { hourlyRate: sortOrder }
      } else if (sortBy === 'experience') {
        orderBy = { experience: sortOrder }
      } else if (sortBy === 'sessions') {
        orderBy = { totalSessions: sortOrder }
      }

      const [trainers, total] = await Promise.all([
        prisma.trainerProfile.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            reviews: {
              take: 3,
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            }
          },
          skip,
          take: limitNum,
          orderBy
        }),
        prisma.trainerProfile.count({ where })
      ])

      res.status(200).json({
        status: 'success',
        data: {
          trainers,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
          }
        }
      })
    } catch (error) {
      logger.error('Get trainers error:', error)
      next(error)
    }
  }

  // Get single trainer by ID
  async getTrainerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const trainer = await prisma.trainerProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              createdAt: true
            }
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  name: true,
                  avatar: true
                }
              }
            }
          },
          sessions: {
            where: {
              status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
            },
            orderBy: { scheduledAt: 'asc' },
            take: 10
          }
        }
      })

      if (!trainer) {
        return next(new AppError('Trainer not found', 404))
      }

      res.status(200).json({
        status: 'success',
        data: { trainer }
      })
    } catch (error) {
      logger.error('Get trainer error:', error)
      next(error)
    }
  }

  // Get available specialties
  async getSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const trainers = await prisma.trainerProfile.findMany({
        where: { isVerified: true, isAvailable: true },
        select: { specialties: true }
      })

      const specialtiesSet = new Set<string>()
      trainers.forEach(trainer => {
        trainer.specialties.forEach(specialty => specialtiesSet.add(specialty))
      })

      const specialties = Array.from(specialtiesSet).sort()

      res.status(200).json({
        status: 'success',
        data: { specialties }
      })
    } catch (error) {
      logger.error('Get specialties error:', error)
      next(error)
    }
  }

  // Book a session with trainer
  async bookSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { trainerId } = req.params
      const { scheduledAt, duration, type, notes } = req.body

      // Check if trainer exists and is available
      const trainer = await prisma.trainerProfile.findUnique({
        where: { id: trainerId }
      })

      if (!trainer) {
        return next(new AppError('Trainer not found', 404))
      }

      if (!trainer.isAvailable) {
        return next(new AppError('Trainer is not currently available', 400))
      }

      // Check for scheduling conflicts
      const scheduledDate = new Date(scheduledAt)
      const endTime = new Date(scheduledDate.getTime() + duration * 60 * 1000)

      const conflicts = await prisma.trainingSession.findMany({
        where: {
          trainerId,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
          OR: [
            {
              AND: [
                { scheduledAt: { lte: scheduledDate } },
                { scheduledAt: { gte: new Date(scheduledDate.getTime() - 120 * 60 * 1000) } } // Check 2 hours before
              ]
            },
            {
              AND: [
                { scheduledAt: { gte: scheduledDate } },
                { scheduledAt: { lte: endTime } }
              ]
            }
          ]
        }
      })

      if (conflicts.length > 0) {
        return next(new AppError('This time slot is not available', 400))
      }

      // Create the session
      const session = await prisma.trainingSession.create({
        data: {
          userId,
          trainerId,
          scheduledAt: scheduledDate,
          duration,
          type: type || 'VIRTUAL',
          price: trainer.hourlyRate * (duration / 60),
          currency: trainer.currency,
          notes,
          status: 'SCHEDULED'
        },
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          }
        }
      })

      res.status(201).json({
        status: 'success',
        message: 'Session booked successfully',
        data: { session }
      })
    } catch (error) {
      logger.error('Book session error:', error)
      next(error)
    }
  }

  // Get user's booked sessions
  async getUserSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { status, upcoming } = req.query

      const where: any = { userId }

      if (status) {
        where.status = status
      }

      if (upcoming === 'true') {
        where.scheduledAt = { gte: new Date() }
        where.status = { in: ['SCHEDULED'] }
      }

      const sessions = await prisma.trainingSession.findMany({
        where,
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: { scheduledAt: 'desc' }
      })

      res.status(200).json({
        status: 'success',
        data: { sessions }
      })
    } catch (error) {
      logger.error('Get user sessions error:', error)
      next(error)
    }
  }

  // Cancel a session
  async cancelSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!
      const { sessionId } = req.params

      const session = await prisma.trainingSession.findUnique({
        where: { id: sessionId }
      })

      if (!session) {
        return next(new AppError('Session not found', 404))
      }

      if (session.userId !== userId) {
        return next(new AppError('Unauthorized to cancel this session', 403))
      }

      if (session.status !== 'SCHEDULED') {
        return next(new AppError('Can only cancel scheduled sessions', 400))
      }

      // Check if cancellation is within allowed time (e.g., 24 hours before)
      const hoursUntilSession = (session.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60)
      if (hoursUntilSession < 24) {
        return next(new AppError('Cannot cancel within 24 hours of scheduled time', 400))
      }

      await prisma.trainingSession.update({
        where: { id: sessionId },
        data: { status: 'CANCELLED' }
      })

      res.status(200).json({
        status: 'success',
        message: 'Session cancelled successfully'
      })
    } catch (error) {
      logger.error('Cancel session error:', error)
      next(error)
    }
  }
}
