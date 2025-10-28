'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const stats = [
  { id: 1, name: 'Active Users', value: '50K+', icon: Users },
  { id: 2, name: 'AI Insights Generated', value: '2M+', icon: Zap },
  { id: 3, name: 'Average Rating', value: '4.9', icon: Star },
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-disciplix-primary to-disciplix-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border-2 border-disciplix-primary/30 bg-gradient-to-r from-disciplix-primary/15 to-disciplix-secondary/15 px-5 py-2.5 text-sm font-semibold text-disciplix-primary shadow-md mb-8"
            variants={fadeInUp}
            role="status"
            aria-label="Feature announcement"
          >
            <Zap className="h-4 w-4 text-disciplix-accent" aria-hidden="true" />
            AI-Powered Fitness Revolution
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            variants={fadeInUp}
          >
            <span className="block text-gray-900 dark:text-white">Transform Your</span>
            <span className="block bg-gradient-to-r from-disciplix-primary via-disciplix-secondary to-disciplix-accent bg-clip-text text-transparent mt-2">
              Fitness Journey with AI
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl leading-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium"
            variants={fadeInUp}
          >
            Disciplix seamlessly integrates health tracking, personalized AI coaching, and human expertise
            to deliver transformative fitness experiences tailored just for you.
          </motion.p>
          
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
            variants={fadeInUp}
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="gradient"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold shadow-xl hover:shadow-2xl"
                aria-label="Start your free 7-day trial"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                aria-label="Watch product demonstration video"
              >
                <Play className="h-5 w-5" aria-hidden="true" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
            variants={fadeInUp}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-disciplix-primary to-disciplix-secondary rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <dt className="text-base leading-7 text-muted-foreground">{stat.name}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </dd>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-disciplix-accent to-disciplix-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}