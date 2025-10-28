'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { X, Calendar, Clock, DollarSign, Video, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trainerService, type Trainer } from '@/services/trainerService'
import { useToast } from '@/hooks/use-toast'

const bookingSchema = z.object({
  scheduledAt: z.string().min(1, 'Date and time is required'),
  duration: z.number().min(30).max(180),
  type: z.enum(['VIRTUAL', 'IN_PERSON', 'HYBRID']),
  notes: z.string().optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingModalProps {
  trainer: Trainer
  onClose: () => void
  onBooked: () => void
}

export default function BookingModal({ trainer, onClose, onBooked }: BookingModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [selectedType, setSelectedType] = useState<'VIRTUAL' | 'IN_PERSON' | 'HYBRID'>('VIRTUAL')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 60,
      type: 'VIRTUAL'
    }
  })

  const duration = watch('duration', 60)
  const totalCost = (trainer.hourlyRate * (duration / 60)).toFixed(2)

  const onSubmit = async (data: BookingFormData) => {
    try {
      setLoading(true)
      await trainerService.bookSession(trainer.id, {
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        duration: data.duration,
        type: data.type,
        notes: data.notes
      })
      onBooked()
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.response?.data?.message || 'Failed to book session. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDurationChange = (newDuration: number) => {
    setSelectedDuration(newDuration)
    setValue('duration', newDuration)
  }

  const handleTypeChange = (newType: 'VIRTUAL' | 'IN_PERSON' | 'HYBRID') => {
    setSelectedType(newType)
    setValue('type', newType)
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString().slice(0, 16)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book a Session</h2>
            <p className="text-gray-600">with {trainer.user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            {/* Session Type */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Session Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange('VIRTUAL')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedType === 'VIRTUAL'
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Video className="h-6 w-6" />
                  <span className="text-sm font-medium">Virtual</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('IN_PERSON')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedType === 'IN_PERSON'
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm font-medium">In Person</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('HYBRID')}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedType === 'HYBRID'
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm font-medium">Hybrid</span>
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Session Duration
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[30, 60, 90, 120].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleDurationChange(mins)}
                    className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                      selectedDuration === mins
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">{mins} min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <Input
                type="datetime-local"
                min={getMinDate()}
                error={errors.scheduledAt?.message}
                {...register('scheduledAt')}
              />
              <p className="mt-1 text-xs text-gray-500">
                Sessions can be booked at least 24 hours in advance
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Any specific goals or requirements for this session?"
                {...register('notes')}
              />
            </div>

            {/* Price Summary */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between text-gray-700">
                <span>Hourly Rate:</span>
                <span className="font-medium">${trainer.hourlyRate}/hr</span>
              </div>
              <div className="mb-2 flex items-center justify-between text-gray-700">
                <span>Duration:</span>
                <span className="font-medium">{duration} minutes</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="flex items-center text-2xl font-bold text-purple-600">
                    <DollarSign className="h-6 w-6" />
                    {totalCost}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={loading}>
              Confirm Booking
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-center text-xs text-gray-500">
            By booking, you agree to our Terms of Service and cancellation policy.
            Sessions can be cancelled up to 24 hours in advance.
          </p>
        </form>
      </div>
    </div>
  )
}
