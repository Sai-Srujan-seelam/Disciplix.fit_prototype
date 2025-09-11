import dotenv from 'dotenv'

dotenv.config()

interface Config {
  NODE_ENV: string
  PORT: number
  CLIENT_URL: string
  
  // Database
  DATABASE_URL: string
  
  // Authentication
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_EXPIRES_IN: string
  
  // Redis
  REDIS_URL: string
  
  // Email
  EMAIL_FROM: string
  SENDGRID_API_KEY?: string
  SMTP_HOST?: string
  SMTP_PORT?: number
  SMTP_USER?: string
  SMTP_PASS?: string
  
  // OAuth
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  APPLE_CLIENT_ID?: string
  APPLE_CLIENT_SECRET?: string
  FACEBOOK_CLIENT_ID?: string
  FACEBOOK_CLIENT_SECRET?: string
  
  // Stripe
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  
  // AWS
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  AWS_S3_BUCKET?: string
  
  // Health Platform APIs
  APPLE_HEALTH_CLIENT_ID?: string
  GOOGLE_FIT_CLIENT_ID?: string
  FITBIT_CLIENT_ID?: string
  FITBIT_CLIENT_SECRET?: string
  GARMIN_CLIENT_ID?: string
  GARMIN_CLIENT_SECRET?: string
  WHOOP_CLIENT_ID?: string
  WHOOP_CLIENT_SECRET?: string
  
  // AI/ML
  OPENAI_API_KEY?: string
  TENSORFLOW_SERVING_URL?: string
  
  // Monitoring
  SENTRY_DSN?: string
  DATADOG_API_KEY?: string
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/disciplix',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@disciplix.ai',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // AWS
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  
  // Health Platform APIs
  APPLE_HEALTH_CLIENT_ID: process.env.APPLE_HEALTH_CLIENT_ID,
  GOOGLE_FIT_CLIENT_ID: process.env.GOOGLE_FIT_CLIENT_ID,
  FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID,
  FITBIT_CLIENT_SECRET: process.env.FITBIT_CLIENT_SECRET,
  GARMIN_CLIENT_ID: process.env.GARMIN_CLIENT_ID,
  GARMIN_CLIENT_SECRET: process.env.GARMIN_CLIENT_SECRET,
  WHOOP_CLIENT_ID: process.env.WHOOP_CLIENT_ID,
  WHOOP_CLIENT_SECRET: process.env.WHOOP_CLIENT_SECRET,
  
  // AI/ML
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TENSORFLOW_SERVING_URL: process.env.TENSORFLOW_SERVING_URL,
  
  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN,
  DATADOG_API_KEY: process.env.DATADOG_API_KEY,
}

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
}

export default config