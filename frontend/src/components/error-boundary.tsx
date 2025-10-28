'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // Log to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

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
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 rounded-lg bg-gray-50 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Error Message:</p>
                      <p className="text-xs text-red-600">{this.state.error.message}</p>
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Stack Trace:</p>
                        <pre className="mt-1 overflow-auto text-xs text-gray-600">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
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

    return this.props.children
  }
}

// Hook-based error boundary for use with React hooks
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}

// Simple error fallback component
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600" />
        <h2 className="mb-2 text-xl font-bold text-gray-900">Something went wrong</h2>
        <p className="mb-4 text-sm text-gray-600">{error.message}</p>
        <Button onClick={resetError} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}
