// Core user types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  profile: UserProfile
  subscription: SubscriptionTier
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  age: number
  height: number // in cm
  weight: number // in kg
  activityLevel: ActivityLevel
  goals: FitnessGoal[]
  preferences: UserPreferences
  healthMetrics: HealthMetrics
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active'

export interface FitnessGoal {
  id: string
  type: GoalType
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'paused'
}

export type GoalType = 
  | 'weight_loss' 
  | 'weight_gain' 
  | 'muscle_gain' 
  | 'endurance' 
  | 'strength' 
  | 'flexibility'

export interface UserPreferences {
  units: 'metric' | 'imperial'
  notifications: NotificationPreferences
  privacy: PrivacySettings
  themes: 'light' | 'dark' | 'system'
}

export interface NotificationPreferences {
  workoutReminders: boolean
  achievementAlerts: boolean
  socialUpdates: boolean
  healthInsights: boolean
  trainerMessages: boolean
}

export interface PrivacySettings {
  shareHealthData: boolean
  publicProfile: boolean
  allowTrainerAccess: boolean
}

export type SubscriptionTier = 'free' | 'premium' | 'elite'

// Health data types
export interface HealthMetrics {
  heartRate: HealthDataPoint[]
  steps: HealthDataPoint[]
  calories: HealthDataPoint[]
  sleep: SleepData[]
  weight: HealthDataPoint[]
  bodyFat: HealthDataPoint[]
  bloodPressure: BloodPressureData[]
  vo2Max: HealthDataPoint[]
}

export interface HealthDataPoint {
  id: string
  value: number
  unit: string
  timestamp: string
  source: DataSource
  confidence: number
}

export interface SleepData extends HealthDataPoint {
  stages: SleepStage[]
  quality: number
}

export interface SleepStage {
  stage: 'awake' | 'light' | 'deep' | 'rem'
  duration: number // minutes
  percentage: number
}

export interface BloodPressureData {
  id: string
  systolic: number
  diastolic: number
  timestamp: string
  source: DataSource
}

export type DataSource = 
  | 'apple_health' 
  | 'google_fit' 
  | 'fitbit' 
  | 'garmin' 
  | 'whoop' 
  | 'samsung_health'
  | 'manual'

// AI insights types
export interface AIInsight {
  id: string
  userId: string
  type: InsightType
  title: string
  description: string
  confidence: number
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  actions: InsightAction[]
  category: InsightCategory
  timestamp: string
  expiresAt?: string
  isRead: boolean
}

export type InsightType = 
  | 'recommendation' 
  | 'warning' 
  | 'achievement' 
  | 'prediction' 
  | 'trend'

export type InsightCategory = 
  | 'workout' 
  | 'nutrition' 
  | 'recovery' 
  | 'sleep' 
  | 'performance' 
  | 'health'

export interface InsightAction {
  id: string
  type: 'workout' | 'nutrition' | 'sleep' | 'recovery' | 'booking'
  label: string
  description: string
  data: Record<string, any>
}

// Training types
export interface Trainer {
  id: string
  name: string
  bio: string
  avatar: string
  certifications: Certification[]
  specialties: Specialty[]
  experience: number // years
  rating: number
  reviewCount: number
  hourlyRate: number
  availability: TimeSlot[]
  languages: string[]
  location: Location
  isVerified: boolean
}

export interface Certification {
  id: string
  name: string
  organization: string
  expiryDate: string
  verified: boolean
}

export type Specialty = 
  | 'weight_loss' 
  | 'strength_training' 
  | 'cardio' 
  | 'yoga' 
  | 'pilates' 
  | 'nutrition' 
  | 'rehabilitation' 
  | 'sports_specific'

export interface TimeSlot {
  dayOfWeek: number // 0-6 (Sunday to Saturday)
  startTime: string // HH:MM
  endTime: string // HH:MM
  isAvailable: boolean
}

export interface Location {
  address: string
  city: string
  state: string
  zipCode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface TrainingSession {
  id: string
  trainerId: string
  userId: string
  type: SessionType
  status: SessionStatus
  scheduledAt: string
  duration: number // minutes
  location: SessionLocation
  notes?: string
  exercises: Exercise[]
  price: number
  rating?: SessionRating
}

export type SessionType = 'in_person' | 'virtual' | 'ai_guided'
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface SessionLocation {
  type: 'gym' | 'home' | 'outdoor' | 'online'
  address?: string
  meetingLink?: string
}

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  muscleGroups: MuscleGroup[]
  sets: ExerciseSet[]
  notes?: string
  videoUrl?: string
}

export type ExerciseCategory = 
  | 'strength' 
  | 'cardio' 
  | 'flexibility' 
  | 'balance' 
  | 'sports'

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'legs' 
  | 'glutes' 
  | 'full_body'

export interface ExerciseSet {
  reps: number
  weight?: number
  duration?: number // seconds
  distance?: number // meters
  restTime: number // seconds
}

export interface SessionRating {
  overall: number // 1-5
  punctuality: number
  professionalism: number
  effectiveness: number
  communication: number
  comment?: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface ProfileForm {
  name: string
  age: number
  height: number
  weight: number
  activityLevel: ActivityLevel
  goals: string[]
}

// UI types
export interface DashboardCard {
  id: string
  title: string
  type: 'metric' | 'chart' | 'insight' | 'action'
  data: any
  size: 'small' | 'medium' | 'large'
  position: {
    x: number
    y: number
  }
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}

// Notification types
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
  isRead: boolean
  actionUrl?: string
}