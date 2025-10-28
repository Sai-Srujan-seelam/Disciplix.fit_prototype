'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Activity,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Clock,
  Dumbbell,
  Heart,
  Zap,
  User,
  LogOut,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { trainerService } from '@/services/trainerService'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await trainerService.getUserSessions({ upcoming: true })
      setSessions(response.data.sessions || [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  const stats = [
    { label: 'Workouts This Week', value: '0', icon: Activity, color: 'text-purple-600' },
    { label: 'Active Goals', value: '0', icon: Target, color: 'text-pink-600' },
    { label: 'Total Sessions', value: sessions.length, icon: Calendar, color: 'text-blue-600' },
    { label: 'Achievements', value: '0', icon: Award, color: 'text-yellow-600' },
  ]

  const quickActions = [
    { label: 'Find a Trainer', icon: User, href: '/trainers', color: 'from-purple-600 to-pink-600' },
    { label: 'My Sessions', icon: Calendar, href: '/dashboard/sessions', color: 'from-blue-600 to-cyan-600' },
    { label: 'Workout Library', icon: Dumbbell, href: '/dashboard/workouts', color: 'from-green-600 to-emerald-600' },
    { label: 'Progress', icon: TrendingUp, href: '/dashboard/progress', color: 'from-orange-600 to-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Disciplix</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.subscription?.tier || 'FREE'} Plan</p>
                </div>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to crush your fitness goals today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={action.label} href={action.href}>
                <Card className="group cursor-pointer p-6 transition-all hover:shadow-xl">
                  <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-r ${action.color} p-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                    {action.label}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-500">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="rounded-lg bg-gray-50 py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="mb-2 text-lg font-semibold text-gray-900">No upcoming sessions</p>
                  <p className="mb-4 text-gray-600">Book a session with one of our expert trainers</p>
                  <Link href="/trainers">
                    <Button>Find a Trainer</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {session.trainer.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(session.scheduledAt).toLocaleString()} • {session.duration} min
                          </p>
                        </div>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Activity Feed / Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Today's Tips</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-purple-50 p-4">
                  <Heart className="h-5 w-5 flex-shrink-0 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Stay Hydrated</p>
                    <p className="text-xs text-gray-600">
                      Drink at least 8 glasses of water today
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                  <Zap className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Morning Energy</p>
                    <p className="text-xs text-gray-600">
                      A 10-minute morning workout boosts your day
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
                  <Clock className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Rest Matters</p>
                    <p className="text-xs text-gray-600">
                      Get 7-8 hours of quality sleep tonight
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h3 className="mb-2 text-lg font-bold">Upgrade to Premium</h3>
              <p className="mb-4 text-sm text-purple-100">
                Unlock unlimited sessions and AI-powered insights
              </p>
              <Button variant="secondary" className="w-full">
                Upgrade Now
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
