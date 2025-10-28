import api from '@/lib/api'

export interface Trainer {
  id: string
  bio: string
  experience: number
  hourlyRate: number
  currency: string
  specialties: string[]
  certifications: {
    name: string
    issuer: string
    year: number
  }[]
  languages: string[]
  isVerified: boolean
  isAvailable: boolean
  rating: number | null
  reviewCount: number
  totalSessions: number
  location: {
    city: string
    state: string
    country: string
    timezone: string
  }
  availability: Record<string, string[]>
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  reviews?: Review[]
}

export interface Review {
  id: string
  overall: number
  punctuality: number | null
  professionalism: number | null
  effectiveness: number | null
  communication: number | null
  comment: string | null
  createdAt: string
  user: {
    name: string
    avatar: string | null
  }
}

export interface TrainingSession {
  id: string
  scheduledAt: string
  duration: number
  type: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID' | 'AI_GUIDED'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
  price: number
  currency: string
  location: any
  notes: string | null
  trainer: Trainer
}

export interface TrainerFilters {
  page?: number
  limit?: number
  specialty?: string
  minRate?: number
  maxRate?: number
  minRating?: number
  search?: string
  sortBy?: 'rating' | 'price' | 'experience' | 'sessions'
  sortOrder?: 'asc' | 'desc'
}

class TrainerService {
  async getTrainers(filters: TrainerFilters = {}) {
    const response = await api.get('/training/trainers', { params: filters })
    return response.data
  }

  async getTrainerById(id: string) {
    const response = await api.get(`/training/trainers/${id}`)
    return response.data
  }

  async getSpecialties() {
    const response = await api.get('/training/trainers/specialties')
    return response.data
  }

  async bookSession(trainerId: string, data: {
    scheduledAt: string
    duration: number
    type?: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID'
    notes?: string
  }) {
    const response = await api.post(`/training/trainers/${trainerId}/book`, data)
    return response.data
  }

  async getUserSessions(params?: { status?: string; upcoming?: boolean }) {
    const response = await api.get('/training/sessions', { params })
    return response.data
  }

  async cancelSession(sessionId: string) {
    const response = await api.post(`/training/sessions/${sessionId}/cancel`)
    return response.data
  }
}

export const trainerService = new TrainerService()
export default trainerService
