'use client'

import { Brain, Users, TrendingUp, Shield, Smartphone, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    name: 'AI Health Intelligence',
    description: 'Advanced algorithms analyze your health data across 50+ platforms to provide personalized insights and predictive analytics.',
    icon: Brain,
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    name: 'Personal Training Marketplace',
    description: 'Connect with certified trainers through our AI-powered matching system for in-person, virtual, or hybrid sessions.',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    name: 'Predictive Analytics',
    description: 'Anticipate plateaus, prevent injuries, and optimize your training windows with our machine learning models.',
    icon: TrendingUp,
    gradient: 'from-green-500 to-teal-600'
  },
  {
    name: 'Enterprise Security',
    description: 'HIPAA compliant with enterprise-grade security. Your health data is encrypted and protected at every level.',
    icon: Shield,
    gradient: 'from-red-500 to-orange-600'
  },
  {
    name: 'Universal Integration',
    description: 'Seamlessly connect with Apple Health, Google Fit, Fitbit, Garmin, Whoop, and 45+ other health platforms.',
    icon: Smartphone,
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    name: 'Real-time Insights',
    description: 'Get instant feedback and recommendations based on your live health metrics and activity patterns.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-600'
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-disciplix-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Advanced Features for Modern Fitness
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Disciplix combines cutting-edge AI technology with human expertise to deliver 
            a premium fitness experience that adapts to your unique needs and goals.
          </p>
        </motion.div>
        
        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-7">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  )
}