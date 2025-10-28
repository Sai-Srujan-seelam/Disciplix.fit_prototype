import api from '@/lib/api'

export interface RegisterData {
  email: string
  password: string
  name: string
  agreeToTerms: boolean
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  status: string
  data: {
    user: {
      id: string
      email: string
      name: string
      verified: boolean
      avatar?: string
      subscription?: {
        tier: string
        status: string
      }
    }
    accessToken?: string
    expiresIn?: string
  }
  message?: string
}

export interface ApiError {
  status: string
  message: string
  errors?: Record<string, string[]>
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)

    // Save token and user data to localStorage
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }

  async refreshToken(): Promise<string> {
    const response = await api.post<AuthResponse>('/auth/refresh-token')
    const accessToken = response.data.data.accessToken

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }

    return accessToken || ''
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export const authService = new AuthService()
export default authService
