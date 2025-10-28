'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Filter,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { trainerService } from '@/services/trainerService'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS'

interface Session {
  id: string
  scheduledAt: string
  duration: number
  type: 'VIRTUAL' | 'IN_PERSON' | 'HYBRID'
  status: SessionStatus
  notes?: string
  trainer: {
    id: string
    user: {
      name: string
      avatar?: string
    }
    specialties: string[]
  }
  totalAmount: number
}

export default function SessionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuthStore()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchSessions()
  }, [isAuthenticated, router])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await trainerService.getUserSessions({})
      setSessions(response.data.sessions || [])
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load sessions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return

    try {
      await trainerService.cancelSession(sessionId)
      toast({
        title: 'Session cancelled',
        description: 'Your session has been cancelled successfully.'
      })
      fetchSessions()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel session',
        variant: 'destructive'
      })
    }
  }

  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'IN_PROGRESS':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getTypeIcon = (type: 'VIRTUAL' | 'IN_PERSON' | 'HYBRID') => {
    switch (type) {
      case 'VIRTUAL':
        return <Video className="h-4 w-4" />
      case 'IN_PERSON':
        return <MapPin className="h-4 w-4" />
      case 'HYBRID':
        return <Calendar className="h-4 w-4" />
    }
  }

  const filteredSessions = sessions.filter(session => {
    const now = new Date()
    const sessionDate = new Date(session.scheduledAt)

    // Apply status filter
    if (filter === 'upcoming' && (sessionDate < now || session.status !== 'SCHEDULED')) {
      return false
    }
    if (filter === 'past' && (sessionDate >= now || session.status === 'CANCELLED')) {
      return false
    }
    if (filter === 'cancelled' && session.status !== 'CANCELLED') {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return session.trainer.user.name.toLowerCase().includes(query) ||
             session.trainer.specialties.some(s => s.toLowerCase().includes(query))
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
              <p className="text-gray-600">Manage your training sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Sessions
              </Button>
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === 'past' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('past')}
              >
                Past
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </Button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search sessions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Sessions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-purple-600" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No sessions found</h3>
            <p className="mb-6 text-gray-600">
              {filter === 'all'
                ? "You haven't booked any sessions yet."
                : `No ${filter} sessions found.`}
            </p>
            <Link href="/trainers">
              <Button>Book a Session</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="flex flex-col md:flex-row">
                    {/* Session Info */}
                    <div className="flex-1 p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {session.trainer.user.avatar ? (
                            <img
                              src={session.trainer.user.avatar}
                              alt={session.trainer.user.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-bold text-white">
                              {session.trainer.user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {session.trainer.user.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                              {session.trainer.specialties.slice(0, 2).map(specialty => (
                                <span key={specialty} className="text-purple-600">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          {session.status}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} ({session.duration} min)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {getTypeIcon(session.type)}
                          {session.type.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                          ${session.totalAmount.toFixed(2)}
                        </div>
                      </div>

                      {session.notes && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Notes: </span>
                            {session.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 border-t bg-gray-50 p-6 md:w-48 md:border-l md:border-t-0">
                      {session.status === 'SCHEDULED' && (
                        <>
                          {session.type === 'VIRTUAL' && (
                            <Button size="sm" variant="default" className="w-full">
                              <Video className="mr-2 h-4 w-4" />
                              Join Session
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleCancelSession(session.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {session.status === 'COMPLETED' && (
                        <Button size="sm" variant="outline" className="w-full">
                          Leave Review
                        </Button>
                      )}
                      <Link href={`/trainers/${session.trainer.id}`}>
                        <Button size="sm" variant="ghost" className="w-full">
                          View Trainer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
