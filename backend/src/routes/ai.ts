import express from 'express'
import { authenticateToken, requireSubscription } from '@/middleware/auth'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// AI Insights
router.get('/insights', (req, res) => {
  res.json({ status: 'success', message: 'Get AI insights - Coming soon' })
})

router.get('/insights/:id', (req, res) => {
  res.json({ status: 'success', message: 'Get specific insight - Coming soon' })
})

router.post('/insights/:id/dismiss', (req, res) => {
  res.json({ status: 'success', message: 'Dismiss insight - Coming soon' })
})

router.post('/insights/:id/feedback', (req, res) => {
  res.json({ status: 'success', message: 'Provide insight feedback - Coming soon' })
})

// Recommendations
router.get('/recommendations/workouts', (req, res) => {
  res.json({ status: 'success', message: 'Get workout recommendations - Coming soon' })
})

router.get('/recommendations/nutrition', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Get nutrition recommendations - Coming soon' })
})

router.get('/recommendations/recovery', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Get recovery recommendations - Coming soon' })
})

// Predictions
router.get('/predictions/performance', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Get performance predictions - Coming soon' })
})

router.get('/predictions/injury-risk', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Get injury risk predictions - Coming soon' })
})

// Analysis
router.post('/analyze/form', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Analyze exercise form - Coming soon' })
})

router.post('/analyze/meal', requireSubscription(['PREMIUM', 'ELITE']), (req, res) => {
  res.json({ status: 'success', message: 'Analyze meal nutrition - Coming soon' })
})

export default router