import nodemailer from 'nodemailer'
import { config } from '@/config/config'
import { logger } from '@/utils/logger'

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    })

    // Verify transporter configuration
    if (config.NODE_ENV === 'development') {
      this.transporter.verify((error, success) => {
        if (error) {
          logger.error('Email transporter verification failed:', error)
        } else {
          logger.info('Email transporter is ready to send messages')
        }
      })
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`

      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Disciplix Account',
        html: this.getVerificationEmailTemplate(name, verificationUrl)
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`Verification email sent to ${email}`)
    } catch (error) {
      logger.error('Failed to send verification email:', error)
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    try {
      const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`

      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Reset Your Disciplix Password',
        html: this.getPasswordResetEmailTemplate(name, resetUrl)
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`Password reset email sent to ${email}`)
    } catch (error) {
      logger.error('Failed to send password reset email:', error)
      throw error
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: email,
        subject: 'Welcome to Disciplix!',
        html: this.getWelcomeEmailTemplate(name)
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`Welcome email sent to ${email}`)
    } catch (error) {
      logger.error('Failed to send welcome email:', error)
      throw error
    }
  }

  private getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Disciplix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Disciplix</div>
          </div>
          
          <h2>Verify Your Email Address</h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for signing up for Disciplix! To complete your registration and start your AI-powered fitness journey, please verify your email address by clicking the button below:</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't create an account with Disciplix, you can safely ignore this email.</p>
          
          <p>Best regards,<br>The Disciplix Team</p>
          
          <div class="footer">
            <p>&copy; 2024 Disciplix. All rights reserved.</p>
            <p>This email was sent from a notification-only address that cannot accept incoming email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Disciplix</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Disciplix</div>
          </div>
          
          <h2>Reset Your Password</h2>
          
          <p>Hi ${name},</p>
          
          <p>We received a request to reset the password for your Disciplix account. Click the button below to create a new password:</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
          
          <p>This password reset link will expire in 1 hour for security reasons.</p>
          
          <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>For security reasons, this link can only be used once.</p>
          
          <p>Best regards,<br>The Disciplix Team</p>
          
          <div class="footer">
            <p>&copy; 2024 Disciplix. All rights reserved.</p>
            <p>This email was sent from a notification-only address that cannot accept incoming email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Disciplix!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #6366f1; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Disciplix</div>
          </div>
          
          <h2>Welcome to Your AI-Powered Fitness Journey!</h2>
          
          <p>Hi ${name},</p>
          
          <p>Welcome to Disciplix! We're thrilled to have you join our community of fitness enthusiasts who are transforming their health with the power of AI.</p>
          
          <p>Here's what you can do next:</p>
          <ul>
            <li><strong>Complete your profile</strong> - Help our AI understand your goals better</li>
            <li><strong>Connect your devices</strong> - Sync with Apple Health, Google Fit, Fitbit, and more</li>
            <li><strong>Explore AI insights</strong> - Get personalized recommendations based on your data</li>
            <li><strong>Find a trainer</strong> - Connect with certified professionals in our marketplace</li>
          </ul>
          
          <p style="text-align: center; margin: 30px 0;">
            <a href="${config.CLIENT_URL}/dashboard" class="button">Get Started</a>
          </p>
          
          <p>If you have any questions or need help getting started, our support team is here to help. Just reply to this email!</p>
          
          <p>Here's to your fitness success!</p>
          
          <p>Best regards,<br>The Disciplix Team</p>
          
          <div class="footer">
            <p>&copy; 2024 Disciplix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}