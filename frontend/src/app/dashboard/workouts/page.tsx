'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Dumbbell,
  Clock,
  Flame,
  Target,
  Play,
  Heart,
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Users,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

type WorkoutCategory = 'STRENGTH' | 'CARDIO' | 'YOGA' | 'HIIT' | 'PILATES' | 'MOBILITY'
type WorkoutDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

interface Workout {
  id: string
  title: string
  description: string
  category: WorkoutCategory
  difficulty: WorkoutDifficulty
  duration: number
  calories: number
  equipment: string[]
  exercises: number
  rating: number
  completions: number
  isCompleted?: boolean
  thumbnail?: string
  trainer: {
    name: string
    avatar?: string
  }
}

const SAMPLE_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'Full Body Strength Builder',
    description: 'Build muscle and strength with this comprehensive full-body workout',
    category: 'STRENGTH',
    difficulty: 'INTERMEDIATE',
    duration: 45,
    calories: 350,
    equipment: ['Dumbbells', 'Barbell', 'Bench'],
    exercises: 8,
    rating: 4.8,
    completions: 1250,
    trainer: { name: 'Alex Thompson' }
  },
  {
    id: '2',
    title: 'Morning Yoga Flow',
    description: 'Start your day with energy and flexibility',
    category: 'YOGA',
    difficulty: 'BEGINNER',
    duration: 30,
    calories: 120,
    equipment: ['Yoga Mat'],
    exercises: 12,
    rating: 4.9,
    completions: 2100,
    trainer: { name: 'Sarah Mitchell' }
  },
  {
    id: '3',
    title: 'HIIT Cardio Blast',
    description: 'High-intensity intervals to torch calories and boost metabolism',
    category: 'HIIT',
    difficulty: 'ADVANCED',
    duration: 25,
    calories: 400,
    equipment: ['None'],
    exercises: 10,
    rating: 4.7,
    completions: 980,
    trainer: { name: 'Marcus Rodriguez' }
  },
  {
    id: '4',
    title: 'Core and Pilates Fusion',
    description: 'Strengthen your core with controlled, precise movements',
    category: 'PILATES',
    difficulty: 'INTERMEDIATE',
    duration: 35,
    calories: 200,
    equipment: ['Mat', 'Resistance Band'],
    exercises: 15,
    rating: 4.6,
    completions: 750,
    trainer: { name: 'Emily Chen' }
  },
  {
    id: '5',
    title: 'Beginner Running Program',
    description: 'Build your cardio endurance with structured running intervals',
    category: 'CARDIO',
    difficulty: 'BEGINNER',
    duration: 20,
    calories: 250,
    equipment: ['Running Shoes'],
    exercises: 5,
    rating: 4.5,
    completions: 1850,
    trainer: { name: 'David Park' }
  },
  {
    id: '6',
    title: 'Mobility and Flexibility',
    description: 'Improve range of motion and prevent injuries',
    category: 'MOBILITY',
    difficulty: 'BEGINNER',
    duration: 20,
    calories: 80,
    equipment: ['Foam Roller', 'Resistance Band'],
    exercises: 10,
    rating: 4.8,
    completions: 1420,
    trainer: { name: 'Jessica Williams' }
  }
]

export default function WorkoutsPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [workouts, setWorkouts] = useState<Workout[]>(SAMPLE_WORKOUTS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<WorkoutCategory | 'ALL'>('ALL')
  const [difficultyFilter, setDifficultyFilter] = useState<WorkoutDifficulty | 'ALL'>('ALL')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const getCategoryColor = (category: WorkoutCategory) => {
    const colors: Record<WorkoutCategory, string> = {
      STRENGTH: 'bg-purple-100 text-purple-700',
      CARDIO: 'bg-red-100 text-red-700',
      YOGA: 'bg-green-100 text-green-700',
      HIIT: 'bg-orange-100 text-orange-700',
      PILATES: 'bg-pink-100 text-pink-700',
      MOBILITY: 'bg-blue-100 text-blue-700'
    }
    return colors[category]
  }

  const getDifficultyColor = (difficulty: WorkoutDifficulty) => {
    const colors: Record<WorkoutDifficulty, string> = {
      BEGINNER: 'text-green-600',
      INTERMEDIATE: 'text-yellow-600',
      ADVANCED: 'text-red-600'
    }
    return colors[difficulty]
  }

  const filteredWorkouts = workouts.filter(workout => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        workout.title.toLowerCase().includes(query) ||
        workout.description.toLowerCase().includes(query) ||
        workout.equipment.some(e => e.toLowerCase().includes(query))

      if (!matchesSearch) return false
    }

    // Category filter
    if (categoryFilter !== 'ALL' && workout.category !== categoryFilter) {
      return false
    }

    // Difficulty filter
    if (difficultyFilter !== 'ALL' && workout.difficulty !== difficultyFilter) {
      return false
    }

    return true
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Workout Library</h1>
              <p className="text-gray-600">500+ expert-designed workouts</p>
            </div>
            <Button variant="gradient">
              <Target className="mr-2 h-4 w-4" />
              Create Custom Workout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workouts Completed</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <CheckCircle className="h-10 w-10 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Minutes</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <Clock className="h-10 w-10 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calories Burned</p>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <Flame className="h-10 w-10 text-orange-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-3xl font-bold text-green-600">0 days</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search workouts, equipment, exercises..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Category</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={categoryFilter === 'ALL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('ALL')}
                >
                  All
                </Button>
                {(['STRENGTH', 'CARDIO', 'YOGA', 'HIIT', 'PILATES', 'MOBILITY'] as WorkoutCategory[]).map(cat => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Difficulty</label>
              <div className="flex gap-2">
                <Button
                  variant={difficultyFilter === 'ALL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficultyFilter('ALL')}
                >
                  All Levels
                </Button>
                {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as WorkoutDifficulty[]).map(diff => (
                  <Button
                    key={diff}
                    variant={difficultyFilter === diff ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDifficultyFilter(diff)}
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Workouts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-purple-600" />
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <Card className="p-12 text-center">
            <Dumbbell className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No workouts found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group h-full overflow-hidden transition-all hover:shadow-xl">
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Dumbbell className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    {workout.isCompleted && (
                      <div className="absolute right-2 top-2 rounded-full bg-green-500 p-2">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(workout.category)}`}>
                        {workout.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Title and Difficulty */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-start justify-between">
                        <h3 className="flex-1 text-lg font-bold text-gray-900">
                          {workout.title}
                        </h3>
                        <span className={`text-xs font-semibold ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{workout.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-3 gap-3 border-y border-gray-100 py-3">
                      <div className="text-center">
                        <Clock className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                        <p className="text-xs text-gray-600">{workout.duration} min</p>
                      </div>
                      <div className="text-center">
                        <Flame className="mx-auto mb-1 h-4 w-4 text-orange-500" />
                        <p className="text-xs text-gray-600">{workout.calories} cal</p>
                      </div>
                      <div className="text-center">
                        <Target className="mx-auto mb-1 h-4 w-4 text-purple-500" />
                        <p className="text-xs text-gray-600">{workout.exercises} moves</p>
                      </div>
                    </div>

                    {/* Equipment */}
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-gray-700">Equipment:</p>
                      <div className="flex flex-wrap gap-1">
                        {workout.equipment.map(item => (
                          <span key={item} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating and Trainer */}
                    <div className="mb-4 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{workout.rating}</span>
                        <span>({workout.completions})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{workout.trainer.name}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full" variant="gradient">
                      <Play className="mr-2 h-4 w-4" />
                      Start Workout
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pro Upgrade CTA */}
        {user?.subscription?.tier === 'FREE' && (
          <Card className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-bold">Unlock Full Workout Library</h3>
                <p className="text-purple-100">
                  Get access to 500+ premium workouts, custom plans, and AI-powered recommendations
                </p>
              </div>
              <Link href="/#pricing">
                <Button variant="secondary" size="lg">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
