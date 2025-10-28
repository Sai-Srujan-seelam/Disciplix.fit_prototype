'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>

          {/* Description */}
          <p className="mb-6 text-center text-gray-600">
            We're sorry, but something unexpected happened. Don't worry, we've logged the error
            and our team will look into it.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 rounded-lg bg-gray-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                Error Details (Development Only)
              </summary>
              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Error Message:</p>
                  <p className="text-xs text-red-600">{error.message}</p>
                </div>
                {error.digest && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Error Digest:</p>
                    <p className="text-xs text-gray-600">{error.digest}</p>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Stack Trace:</p>
                    <pre className="mt-1 max-h-40 overflow-auto text-xs text-gray-600">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={reset}
              variant="gradient"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Button>
            </Link>
          </div>

          {/* Support Link */}
          <p className="mt-6 text-center text-xs text-gray-500">
            If the problem persists, please{' '}
            <a
              href="mailto:support@disciplix.ai"
              className="text-purple-600 hover:underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
