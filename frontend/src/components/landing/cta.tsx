'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-disciplix-primary via-disciplix-secondary to-disciplix-accent py-24 sm:py-32">
      {/* Improved background pattern with better contrast */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.violet.200/.3),transparent)] opacity-40" />
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-disciplix-primary shadow-lg mb-8 border border-white/20"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            transition={{ type: "spring", stiffness: 300 }}
            role="status"
            aria-label="Call to action badge"
          >
            <Sparkles className="h-4 w-4 text-disciplix-accent" aria-hidden="true" />
            Start Your Transformation Today
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-lg">
            Ready to revolutionize your fitness journey?
          </h2>

          <p className="mt-6 text-lg leading-8 text-white font-medium max-w-xl mx-auto drop-shadow-md">
            Join thousands of users who have already transformed their health with AI-powered
            insights and personalized coaching. Your best self is waiting.
          </p>
          
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="secondary"
                className="w-full sm:w-auto bg-white text-disciplix-primary hover:bg-gray-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-semibold border-2 border-white/50"
                aria-label="Start your free 7-day trial"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto text-white bg-white/10 backdrop-blur-sm border-2 border-white/50 hover:bg-white/20 hover:border-white shadow-lg font-semibold"
                aria-label="Contact our sales team"
              >
                Talk to Sales
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-300 text-lg" aria-hidden="true">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-300 text-lg" aria-hidden="true">✓</span>
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-300 text-lg" aria-hidden="true">✓</span>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}