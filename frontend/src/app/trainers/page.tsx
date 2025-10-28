'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, Star, DollarSign, Award, Calendar, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trainerService, type Trainer, type TrainerFilters } from '@/services/trainerService'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function TrainersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TrainerFilters>({
    page: 1,
    limit: 12,
    sortBy: 'rating',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchTrainers()
    fetchSpecialties()
  }, [filters])

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const response = await trainerService.getTrainers(filters)
      setTrainers(response.data.trainers)
      setPagination(response.data.pagination)
    } catch (error: any) {
      toast({
        title: 'Error loading trainers',
        description: error.response?.data?.message || 'Failed to load trainers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecialties = async () => {
    try {
      const response = await trainerService.getSpecialties()
      setSpecialties(response.data.specialties)
    } catch (error) {
      console.error('Failed to load specialties:', error)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    setFilters(prev => ({ ...prev, search, page: 1 }))
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-5xl font-bold">Find Your Perfect Trainer</h1>
            <p className="mb-8 text-xl text-purple-100">
              Connect with certified professionals who will help you achieve your fitness goals
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    name="search"
                    type="text"
                    placeholder="Search by name, specialty, or expertise..."
                    className="h-14 pl-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 bg-white text-purple-600 hover:bg-gray-100">
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>

              {/* Specialty Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filters.specialty || ''}
                  onChange={(e) => handleFilterChange('specialty', e.target.value || undefined)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Hourly Rate
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={filters.minRate || ''}
                    onChange={(e) => handleFilterChange('minRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={filters.maxRate || ''}
                    onChange={(e) => handleFilterChange('maxRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Minimum Rating
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="experience">Most Experienced</option>
                  <option value="sessions">Most Sessions</option>
                </select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({ page: 1, limit: 12, sortBy: 'rating', sortOrder: 'desc' })}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Trainers Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{pagination.total}</span> trainers
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : trainers.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-lg">
                <p className="text-xl text-gray-600">No trainers found matching your criteria</p>
                <Button className="mt-4" onClick={() => setFilters({ page: 1, limit: 12, sortBy: 'rating', sortOrder: 'desc' })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {trainers.map((trainer, index) => (
                    <motion.div
                      key={trainer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/trainers/${trainer.id}`}>
                        <div className="group h-full cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                          {/* Trainer Avatar */}
                          <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 p-4">
                            <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
                            <div className="flex h-full items-center justify-center">
                              {trainer.user.avatar ? (
                                <img
                                  src={trainer.user.avatar}
                                  alt={trainer.user.name}
                                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                                />
                              ) : (
                                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-bold text-purple-600 shadow-xl">
                                  {trainer.user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            {trainer.isVerified && (
                              <div className="absolute right-4 top-4 rounded-full bg-green-500 p-2 text-white shadow-lg">
                                <Award className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          {/* Trainer Info */}
                          <div className="p-6">
                            <h3 className="mb-2 text-xl font-bold text-gray-900">{trainer.user.name}</h3>

                            {/* Rating */}
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex items-center">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 font-semibold">{trainer.rating?.toFixed(1) || 'New'}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                ({trainer.reviewCount} reviews)
                              </span>
                            </div>

                            {/* Specialties */}
                            <div className="mb-4 flex flex-wrap gap-2">
                              {trainer.specialties.slice(0, 2).map((specialty) => (
                                <span
                                  key={specialty}
                                  className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                                >
                                  {specialty}
                                </span>
                              ))}
                              {trainer.specialties.length > 2 && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                  +{trainer.specialties.length - 2} more
                                </span>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="mb-4 space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{trainer.experience} years experience</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{trainer.totalSessions} sessions completed</span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between border-t pt-4">
                              <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                                <DollarSign className="h-6 w-6" />
                                {trainer.hourlyRate}
                                <span className="text-sm font-normal text-gray-500">/hour</span>
                              </div>
                              <Button size="sm" className="group-hover:bg-purple-700">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                    >
                      Previous
                    </Button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={pagination.page === i + 1 ? 'default' : 'outline'}
                        onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
