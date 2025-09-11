import express from 'express'
import { body } from 'express-validator'
import { AuthController } from '@/controllers/AuthController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticateToken } from '@/middleware/auth'

const router = express.Router()
const authController = new AuthController()

// Registration validation
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('agreeToTerms').isBoolean().custom((value) => {
    if (!value) {
      throw new Error('You must agree to the terms and conditions')
    }
    return true
  }),
]

// Login validation
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

// Password reset validation
const resetPasswordValidation = [
  body('email').isEmail().normalizeEmail(),
]

const newPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
]

// Routes
router.post('/register', registerValidation, validateRequest, authController.register)
router.post('/login', loginValidation, validateRequest, authController.login)
router.post('/logout', authenticateToken, authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', resetPasswordValidation, validateRequest, authController.forgotPassword)
router.post('/reset-password', newPasswordValidation, validateRequest, authController.resetPassword)
router.post('/verify-email', authController.verifyEmail)
router.post('/resend-verification', authController.resendVerification)

// OAuth routes
router.get('/google', authController.googleAuth)
router.get('/google/callback', authController.googleCallback)
router.get('/apple', authController.appleAuth)
router.get('/apple/callback', authController.appleCallback)

// Profile completion
router.post('/complete-profile', authenticateToken, authController.completeProfile)

export default router