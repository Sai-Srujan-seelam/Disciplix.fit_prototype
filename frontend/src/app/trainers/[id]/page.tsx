'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Star,
  Award,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  Globe,
  MessageSquare,
  Video,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trainerService, type Trainer } from '@/services/trainerService'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import BookingModal from '@/components/trainers/BookingModal'

export default function TrainerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuthStore()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTrainer()
    }
  }, [params.id])

  const fetchTrainer = async () => {
    try {
      setLoading(true)
      const response = await trainerService.getTrainerById(params.id as string)
      setTrainer(response.data.trainer)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load trainer',
        variant: 'destructive'
      })
      router.push('/trainers')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to book a session',
        variant: 'destructive'
      })
      router.push('/login')
      return
    }
    setShowBookingModal(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-4 border-purple-600" />
      </div>
    )
  }

  if (!trainer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 md:flex-row"
          >
            {/* Avatar */}
            <div className="relative">
              {trainer.user.avatar ? (
                <img
                  src={trainer.user.avatar}
                  alt={trainer.user.name}
                  className="h-48 w-48 rounded-full border-4 border-white object-cover shadow-2xl"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-full border-4 border-white bg-white text-6xl font-bold text-purple-600 shadow-2xl">
                  {trainer.user.name.charAt(0)}
                </div>
              )}
              {trainer.isVerified && (
                <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-3 text-white shadow-lg">
                  <Award className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-4xl font-bold">{trainer.user.name}</h1>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-semibold">
                    {trainer.rating?.toFixed(1) || 'New'}
                  </span>
                  <span className="text-purple-200">({trainer.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-purple-200">
                  <MapPin className="h-5 w-5" />
                  {trainer.location.city}, {trainer.location.state}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {trainer.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="rounded-lg bg-white p-6 text-gray-900 shadow-2xl">
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center gap-1 text-4xl font-bold text-purple-600">
                  <DollarSign className="h-8 w-8" />
                  {trainer.hourlyRate}
                </div>
                <p className="text-gray-600">per hour</p>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleBookSession}
                disabled={!trainer.isAvailable}
              >
                {trainer.isAvailable ? 'Book a Session' : 'Not Available'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-8 shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-bold text-gray-900">About</h2>
              <p className="text-gray-700 leading-relaxed">{trainer.bio}</p>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-white p-8 shadow-lg"
            >
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Certifications</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {trainer.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
                  >
                    <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">Year: {cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            {trainer.reviews && trainer.reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg bg-white p-8 shadow-lg"
              >
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Recent Reviews</h2>
                <div className="space-y-6">
                  {trainer.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600">
                          {review.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.user.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.overall
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-900">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">{trainer.experience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sessions</p>
                    <p className="font-semibold">{trainer.totalSessions} completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Virtual Sessions</p>
                    <p className="font-semibold">Available</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-white p-6 shadow-lg"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Globe className="h-5 w-5 text-purple-600" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {trainer.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white shadow-lg"
            >
              <MessageSquare className="mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-bold">Have Questions?</h3>
              <p className="mb-4 text-sm text-purple-100">
                Send a message to {trainer.user.name} before booking
              </p>
              <Button variant="secondary" className="w-full">
                Send Message
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          trainer={trainer}
          onClose={() => setShowBookingModal(false)}
          onBooked={() => {
            setShowBookingModal(false)
            toast({
              title: 'Session booked!',
              description: 'Your training session has been scheduled successfully.'
            })
          }}
        />
      )}
    </div>
  )
}
