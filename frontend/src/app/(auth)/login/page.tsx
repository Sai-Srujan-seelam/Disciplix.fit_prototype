'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isLoading, error } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      })

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
        variant: 'destructive',
      })
    }
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
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue your fitness journey</p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    error={errors.password?.message}
                    {...register('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me for 30 days
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">or continue with</span>
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

              <Button variant="outline" className="w-full" size="lg">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                    fill="#1877F2"
                  />
                </svg>
                Continue with Facebook
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5S7.313 3.5 12 3.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5zm3.5-9.5h-3V8c0-.552.448-1 1-1h1V5h-2c-1.657 0-3 1.343-3 3v3H8v2h1.5v5H12v-5h2.5l.5-2z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Apple
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-purple-600 hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          {/* Email Verification Notice */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p className="font-medium">Need to verify your email?</p>
            <p className="mt-1 text-blue-600">
              Check your inbox for the verification link we sent you.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero/Stats */}
      <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-purple-600 lg:to-pink-600 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-white"
        >
          <h2 className="mb-6 text-5xl font-bold">Your Fitness Journey Awaits</h2>
          <p className="mb-8 text-xl text-purple-100">
            AI-powered coaching tailored to your unique goals and lifestyle
          </p>

          <div className="mb-12 grid grid-cols-2 gap-6">
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold">50K+</div>
              <div className="text-sm text-purple-100">Active Members</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold">1M+</div>
              <div className="text-sm text-purple-100">Workouts Done</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold">95%</div>
              <div className="text-sm text-purple-100">Success Rate</div>
            </div>
            <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-4xl font-bold">4.9</div>
              <div className="text-sm text-purple-100">Average Rating</div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mx-auto max-w-lg rounded-lg bg-white/10 p-6 backdrop-blur-sm">
            <p className="mb-4 text-lg italic">
              "Disciplix transformed my fitness journey. The AI coaching adapts to my schedule and
              keeps me motivated every day!"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div className="text-left">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-purple-200">Lost 30 lbs in 6 months</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
