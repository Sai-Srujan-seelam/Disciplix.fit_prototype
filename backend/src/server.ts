import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

import { config } from '@/config/config'
import { logger } from '@/utils/logger'
import { prisma } from '@/config/database'
import { errorHandler } from '@/middleware/errorHandler'
import { notFoundHandler } from '@/middleware/notFoundHandler'

// Routes
import authRoutes from '@/routes/auth'
import userRoutes from '@/routes/users'
import healthRoutes from '@/routes/health'
import aiRoutes from '@/routes/ai'
import trainingRoutes from '@/routes/training'
import socialRoutes from '@/routes/social'

const app = express()
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}))

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression and logging
app.use(compression())
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.NODE_ENV
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/training', trainingRoutes)
app.use('/api/social', socialRoutes)

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)
  
  socket.on('join_user_room', (userId: string) => {
    socket.join(`user_${userId}`)
    logger.info(`User ${userId} joined their room`)
  })
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Make io available to routes
app.set('io', io)

// Error handling middleware (must be last)
app.use(notFoundHandler)
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  
  server.close(async () => {
    logger.info('HTTP server closed')
    
    try {
      await prisma.$disconnect()
      logger.info('Database connection closed')
      process.exit(0)
    } catch (error) {
      logger.error('Error during database disconnect:', error)
      process.exit(1)
    }
  })
})

const PORT = config.PORT || 3001

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.NODE_ENV} mode`)
  logger.info(`📊 Health check available at http://localhost:${PORT}/health`)
  
  if (config.NODE_ENV === 'development') {
    logger.info(`🔗 API endpoints available at http://localhost:${PORT}/api`)
  }
})

export { app, io }