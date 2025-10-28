'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { register: registerUser, isLoading } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('basic')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  })

  const password = watch('password', '')

  useEffect(() => {
    const plan = searchParams.get('plan')
    if (plan && ['basic', 'pro', 'elite'].includes(plan.toLowerCase())) {
      setSelectedPlan(plan.toLowerCase())
    }
  }, [searchParams])

  const getPlanDisplay = () => {
    const planMap: Record<string, { name: string; price: string }> = {
      basic: { name: 'Basic', price: 'Free' },
      pro: { name: 'Pro', price: '$19.99/mo' },
      elite: { name: 'Elite', price: '$49.99/mo' }
    }
    return planMap[selectedPlan] || planMap.basic
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        agreeToTerms: data.agreeToTerms,
      })

      setShowSuccess(true)
      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.',
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const passwordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    return strength
  }

  const getStrengthColor = () => {
    const strength = passwordStrength()
    if (strength < 50) return 'bg-red-500'
    if (strength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    const strength = passwordStrength()
    if (strength < 50) return 'Weak'
    if (strength < 75) return 'Medium'
    return 'Strong'
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Account Created!
            </h2>
            <p className="mb-6 text-center text-gray-600">
              We've sent a verification email to your inbox. Please verify your email address to
              get started.
            </p>
            <p className="text-center text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
              Join Disciplix
            </h1>
            <p className="text-gray-600">Start your fitness journey with AI-powered coaching</p>
            {selectedPlan && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                Selected Plan: {getPlanDisplay().name} - {getPlanDisplay().price}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${passwordStrength() >= 75 ? 'text-green-600' : passwordStrength() >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength()}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  {...register('agreeToTerms')}
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" size="lg">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-purple-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-purple-600 lg:to-pink-600 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-white"
        >
          <h2 className="mb-6 text-5xl font-bold">Transform Your Life</h2>
          <p className="mb-8 text-xl text-purple-100">
            Join thousands of users achieving their fitness goals with AI-powered coaching
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold">50K+</div>
              <div className="text-sm text-purple-100">Active Users</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold">1M+</div>
              <div className="text-sm text-purple-100">Workouts Completed</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold">4.9</div>
              <div className="text-sm text-purple-100">Average Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
