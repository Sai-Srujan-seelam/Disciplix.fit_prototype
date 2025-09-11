import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'

// Create Prisma client with logging in development
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
})

// Handle connection events
prisma.$on('beforeExit', async () => {
  logger.info('Prisma client disconnecting...')
})

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect()
    logger.info('✅ Database connected successfully')
  } catch (error) {
    logger.error('❌ Database connection failed:', error)
    throw error
  }
}

// Graceful shutdown
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect()
    logger.info('✅ Database disconnected successfully')
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error)
    throw error
  }
}

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    logger.error('Database health check failed:', error)
    return false
  }
}

export default prisma