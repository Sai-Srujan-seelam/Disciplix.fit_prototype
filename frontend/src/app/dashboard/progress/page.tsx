'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Flame,
  Dumbbell,
  Heart,
  Scale,
  Target,
  ArrowLeft,
  Award,
  Activity,
  Clock,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'

interface ProgressMetric {
  label: string
  value: string
  change: number
  period: string
  icon: any
  color: string
}

interface WeeklyData {
  day: string
  workouts: number
  calories: number
  duration: number
}

interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  category: string
}

export default function ProgressPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const metrics: ProgressMetric[] = [
    {
      label: 'Workouts Completed',
      value: '0',
      change: 0,
      period: 'vs last week',
      icon: Dumbbell,
      color: 'text-purple-600'
    },
    {
      label: 'Calories Burned',
      value: '0',
      change: 0,
      period: 'vs last week',
      icon: Flame,
      color: 'text-orange-600'
    },
    {
      label: 'Active Minutes',
      value: '0',
      change: 0,
      period: 'vs last week',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      label: 'Current Streak',
      value: '0 days',
      change: 0,
      period: 'this month',
      icon: Zap,
      color: 'text-yellow-600'
    }
  ]

  const weeklyData: WeeklyData[] = [
    { day: 'Mon', workouts: 0, calories: 0, duration: 0 },
    { day: 'Tue', workouts: 0, calories: 0, duration: 0 },
    { day: 'Wed', workouts: 0, calories: 0, duration: 0 },
    { day: 'Thu', workouts: 0, calories: 0, duration: 0 },
    { day: 'Fri', workouts: 0, calories: 0, duration: 0 },
    { day: 'Sat', workouts: 0, calories: 0, duration: 0 },
    { day: 'Sun', workouts: 0, calories: 0, duration: 0 }
  ]

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Complete 12 Workouts',
      target: 12,
      current: 0,
      unit: 'workouts',
      deadline: '2025-11-30',
      category: 'Fitness'
    },
    {
      id: '2',
      title: 'Burn 3000 Calories',
      target: 3000,
      current: 0,
      unit: 'calories',
      deadline: '2025-11-30',
      category: 'Weight Loss'
    },
    {
      id: '3',
      title: 'Exercise 150 Minutes',
      target: 150,
      current: 0,
      unit: 'minutes',
      deadline: '2025-11-30',
      category: 'Endurance'
    }
  ]

  const achievements = [
    { id: '1', title: 'First Workout', description: 'Complete your first workout', earned: false, icon: '🎯' },
    { id: '2', title: 'Week Warrior', description: 'Complete 5 workouts in a week', earned: false, icon: '💪' },
    { id: '3', title: 'Calorie Crusher', description: 'Burn 1000 calories in a week', earned: false, icon: '🔥' },
    { id: '4', title: 'Consistency King', description: 'Maintain a 7-day streak', earned: false, icon: '👑' },
    { id: '5', title: 'Early Bird', description: 'Complete 5 morning workouts', earned: false, icon: '🌅' },
    { id: '6', title: 'Goal Getter', description: 'Achieve your first goal', earned: false, icon: '🎖️' }
  ]

  const maxWorkouts = Math.max(...weeklyData.map(d => d.workouts), 1)

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
              <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
              <p className="text-gray-600">Track your fitness journey and achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-sm text-gray-600">{metric.label}</p>
                    <p className="mb-2 text-3xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {metric.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : metric.change < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      ) : null}
                      <span className={metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-gray-500">{metric.period}</span>
                    </div>
                  </div>
                  <metric.icon className={`h-10 w-10 ${metric.color}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Weekly Activity Chart */}
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Weekly Activity</h2>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('year')}
                  >
                    Year
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{data.day}</div>
                    <div className="flex-1">
                      <div className="h-8 overflow-hidden rounded-lg bg-gray-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.workouts / maxWorkouts) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-semibold text-gray-900">
                      {data.workouts}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-gray-600">Total Workouts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-gray-600">Calories Burned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-xs text-gray-600">Minutes Active</p>
                </div>
              </div>
            </Card>

            {/* Body Measurements */}
            <Card className="p-6">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Body Measurements</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Weight</h3>
                  </div>
                  <div className="mb-2 flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="mb-1 text-gray-600">lbs</span>
                  </div>
                  <p className="text-xs text-gray-500">No data recorded yet</p>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Add Measurement
                  </Button>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Resting Heart Rate</h3>
                  </div>
                  <div className="mb-2 flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">--</span>
                    <span className="mb-1 text-gray-600">bpm</span>
                  </div>
                  <p className="text-xs text-gray-500">No data recorded yet</p>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    Add Measurement
                  </Button>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                  0 / {achievements.length}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border-2 p-4 transition-all ${
                      achievement.earned
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-3xl">{achievement.icon}</span>
                      {achievement.earned && (
                        <Award className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <h3 className="mb-1 font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Active Goals */}
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
                <Button variant="ghost" size="sm">
                  <Target className="mr-1 h-4 w-4" />
                  Add Goal
                </Button>
              </div>
              {goals.length === 0 ? (
                <div className="py-8 text-center">
                  <Target className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="mb-2 text-sm font-semibold text-gray-900">No active goals</p>
                  <p className="mb-4 text-xs text-gray-600">Set a goal to stay motivated</p>
                  <Button size="sm">Create Goal</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map(goal => {
                    const progress = (goal.current / goal.target) * 100
                    const daysLeft = Math.ceil(
                      (new Date(goal.deadline).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )

                    return (
                      <div key={goal.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-3">
                          <div className="mb-1 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                            <span className="text-xs text-gray-500">{goal.category}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {goal.current} / {goal.target} {goal.unit}
                          </p>
                        </div>
                        <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{progress.toFixed(0)}% complete</span>
                          <span>{daysLeft} days left</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>

            {/* Fitness Insights */}
            <Card className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
              <Activity className="mb-4 h-8 w-8" />
              <h3 className="mb-2 text-lg font-bold">Get AI-Powered Insights</h3>
              <p className="mb-4 text-sm text-purple-100">
                Upgrade to Pro to unlock personalized recommendations and detailed analytics
              </p>
              <Link href="/#pricing">
                <Button variant="secondary" className="w-full">
                  Upgrade Now
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
