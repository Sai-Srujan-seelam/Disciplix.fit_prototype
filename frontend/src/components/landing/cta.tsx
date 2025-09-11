'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-r from-disciplix-primary to-disciplix-secondary py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="h-4 w-4" />
            Start Your Transformation Today
          </motion.div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to revolutionize your fitness journey?
          </h2>
          
          <p className="mt-6 text-lg leading-8 text-white/90 max-w-xl mx-auto">
            Join thousands of users who have already transformed their health with AI-powered 
            insights and personalized coaching. Your best self is waiting.
          </p>
          
          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/register">
              <Button 
                size="xl" 
                variant="secondary"
                className="bg-white text-disciplix-primary hover:bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button 
                size="xl" 
                variant="ghost"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Talk to Sales
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            className="mt-12 flex items-center justify-center gap-8 text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-sm">
              ✓ No credit card required
            </div>
            <div className="text-sm">
              ✓ 7-day free trial
            </div>
            <div className="text-sm">
              ✓ Cancel anytime
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}