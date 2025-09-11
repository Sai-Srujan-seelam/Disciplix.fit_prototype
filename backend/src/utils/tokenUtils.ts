import crypto from 'crypto'

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

export const generateApiKey = (): string => {
  const prefix = 'dx_'
  const randomPart = crypto.randomBytes(24).toString('base64').replace(/[+/=]/g, '')
  return `${prefix}${randomPart}`
}

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}