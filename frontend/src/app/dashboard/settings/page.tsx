'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Shield,
  Trash2,
  ArrowLeft,
  Save,
  CheckCircle,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500).optional()
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

type SettingsTab = 'profile' | 'account' | 'notifications' | 'subscription' | 'privacy'

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      bio: ''
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      // TODO: Implement profile update API call
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.'
      })
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive'
      })
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      // TODO: Implement password change API call
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.'
      })
      passwordForm.reset()
    } catch (error: any) {
      toast({
        title: 'Password change failed',
        description: error.response?.data?.message || 'Failed to change password',
        variant: 'destructive'
      })
    }
  }

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'account' as SettingsTab, label: 'Account', icon: Shield },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'subscription' as SettingsTab, label: 'Subscription', icon: Crown },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock }
  ]

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
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Tabs */}
          <Card className="h-fit p-4">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Profile Information</h2>

                  {/* Avatar */}
                  <div className="mb-8 flex items-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-3xl font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG or GIF. Max size of 5MB.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Input
                          {...profileForm.register('name')}
                          error={profileForm.formState.errors.name?.message}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          {...profileForm.register('email')}
                          error={profileForm.formState.errors.email?.message}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...profileForm.register('phone')}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <Input
                          placeholder="City, State"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        {...profileForm.register('bio')}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Brief description for your profile. Max 500 characters.
                      </p>
                    </div>

                    <Button type="submit" variant="gradient">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h2>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register('currentPassword')}
                        error={passwordForm.formState.errors.currentPassword?.message}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register('newPassword')}
                        error={passwordForm.formState.errors.newPassword?.message}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register('confirmPassword')}
                        error={passwordForm.formState.errors.confirmPassword?.message}
                      />
                    </div>
                    <Button type="submit" variant="gradient">
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </form>
                </Card>

                <Card className="border-red-200 bg-red-50 p-6">
                  <h2 className="mb-4 text-xl font-bold text-red-900">Danger Zone</h2>
                  <p className="mb-4 text-sm text-red-700">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">
                            Receive updates about your workouts and progress
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-600">
                            Get reminders for scheduled sessions and workouts
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPushNotifications(!pushNotifications)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          pushNotifications ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                            pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <Button variant="gradient">
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Current Plan</h2>
                  <div className="mb-6 flex items-center justify-between rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Crown className="h-6 w-6 text-purple-600" />
                        <h3 className="text-2xl font-bold text-gray-900">
                          {user?.subscription?.tier || 'FREE'} Plan
                        </h3>
                      </div>
                      <p className="text-gray-700">
                        {user?.subscription?.tier === 'FREE'
                          ? 'Basic features to get started'
                          : 'Full access to premium features'}
                      </p>
                    </div>
                    {user?.subscription?.tier === 'FREE' ? (
                      <Link href="/#pricing">
                        <Button variant="gradient" size="lg">
                          Upgrade Plan
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline">Manage Plan</Button>
                    )}
                  </div>

                  {user?.subscription?.tier !== 'FREE' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <span className="text-gray-700">Next billing date</span>
                        <span className="font-semibold text-gray-900">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <span className="text-gray-700">Amount</span>
                        <span className="font-semibold text-gray-900">$19.99</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Payment method</span>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-semibold text-gray-900">•••• 4242</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {user?.subscription?.tier === 'FREE' && (
                  <Card className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                    <h3 className="mb-2 text-xl font-bold">Unlock Premium Features</h3>
                    <ul className="mb-6 space-y-2 text-purple-100">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Unlimited trainer sessions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        AI-powered insights
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Priority support
                      </li>
                    </ul>
                    <Link href="/#pricing">
                      <Button variant="secondary" className="w-full">
                        View Plans
                      </Button>
                    </Link>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Privacy & Data</h2>
                  <div className="space-y-6">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-2 font-semibold text-gray-900">Data Collection</h3>
                      <p className="mb-4 text-sm text-gray-600">
                        We collect data to improve your experience and provide personalized recommendations.
                      </p>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-2 font-semibold text-gray-900">Download Your Data</h3>
                      <p className="mb-4 text-sm text-gray-600">
                        Request a copy of all your data stored in our system.
                      </p>
                      <Button variant="outline" size="sm">
                        Request Export
                      </Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-2 font-semibold text-gray-900">Account Visibility</h3>
                      <p className="mb-4 text-sm text-gray-600">
                        Control who can see your profile and workout activity.
                      </p>
                      <select className="w-full rounded-lg border border-gray-300 px-4 py-2">
                        <option>Public</option>
                        <option>Friends Only</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
