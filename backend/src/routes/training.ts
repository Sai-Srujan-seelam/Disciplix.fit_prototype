import express from 'express'
import { authenticateToken, optionalAuth, requireSubscription } from '@/middleware/auth'
import { body } from 'express-validator'
import { validateRequest } from '@/middleware/validateRequest'
import { TrainerController } from '@/controllers/TrainerController'

const router = express.Router()
const trainerController = new TrainerController()

// Trainer marketplace - public endpoints with optional auth
router.get('/trainers', optionalAuth, trainerController.getTrainers)
router.get('/trainers/specialties', trainerController.getSpecialties)
router.get('/trainers/:id', optionalAuth, trainerController.getTrainerById)

// Session booking - requires authentication
router.post(
  '/trainers/:trainerId/book',
  authenticateToken,
  requireSubscription(['PREMIUM', 'ELITE']),
  [
    body('scheduledAt').isISO8601().withMessage('Invalid date format'),
    body('duration').isInt({ min: 30, max: 180 }).withMessage('Duration must be between 30 and 180 minutes'),
    body('type').optional().isIn(['IN_PERSON', 'VIRTUAL', 'HYBRID']),
    body('notes').optional().isString()
  ],
  validateRequest,
  trainerController.bookSession
)

router.get('/sessions', authenticateToken, trainerController.getUserSessions)

router.post('/sessions/:sessionId/cancel', authenticateToken, trainerController.cancelSession)

// Reviews and ratings
router.post('/sessions/:id/review', (req, res) => {
  res.json({ status: 'success', message: 'Submit session review - Coming soon' })
})

router.get('/trainers/:id/reviews', (req, res) => {
  res.json({ status: 'success', message: 'Get trainer reviews - Coming soon' })
})

// Workout library
router.get('/workouts', (req, res) => {
  res.json({ status: 'success', message: 'Get workout library - Coming soon' })
})

router.get('/workouts/:id', (req, res) => {
  res.json({ status: 'success', message: 'Get workout details - Coming soon' })
})

router.post('/workouts/:id/start', (req, res) => {
  res.json({ status: 'success', message: 'Start workout session - Coming soon' })
})

router.post('/workouts/:id/complete', (req, res) => {
  res.json({ status: 'success', message: 'Complete workout session - Coming soon' })
})

// Exercise database
router.get('/exercises', (req, res) => {
  res.json({ status: 'success', message: 'Get exercise database - Coming soon' })
})

router.get('/exercises/:id', (req, res) => {
  res.json({ status: 'success', message: 'Get exercise details - Coming soon' })
})

export default router