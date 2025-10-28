'use client'

import { Search, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
            <Search className="h-8 w-8 text-purple-600" />
            <div className="h-1 w-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
          </div>
        </div>

        {/* Title and Description */}
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <p className="mb-4 text-sm font-semibold text-gray-700">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/trainers"
              className="text-sm text-purple-600 hover:underline"
            >
              Find Trainers
            </Link>
            <Link
              href="/about"
              className="text-sm text-purple-600 hover:underline"
            >
              About Us
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-purple-600 hover:underline"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm text-purple-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12"
        >
          <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-lg">
              <Search className="h-24 w-24 text-purple-300" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
