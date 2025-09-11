import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Disciplix - AI-Powered Fitness & Personal Training',
    template: '%s | Disciplix'
  },
  description: 'Premium AI-powered fitness ecosystem that seamlessly integrates health tracking, personalized coaching, and human expertise to deliver transformative fitness experiences.',
  keywords: ['fitness', 'AI', 'personal training', 'health tracking', 'wellness'],
  authors: [{ name: 'Disciplix Team' }],
  creator: 'Disciplix',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://disciplix.ai',
    title: 'Disciplix - AI-Powered Fitness Platform',
    description: 'Transform your fitness journey with AI-powered insights and premium personal training.',
    siteName: 'Disciplix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Disciplix - AI-Powered Fitness Platform',
    description: 'Transform your fitness journey with AI-powered insights and premium personal training.',
    creator: '@disciplix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <Providers>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}