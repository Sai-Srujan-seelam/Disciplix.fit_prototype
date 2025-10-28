'use client'

import { Check, Crown, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const tiers = [
  {
    name: 'Basic',
    id: 'tier-basic',
    href: '/register?plan=basic',
    priceMonthly: '$0',
    priceYearly: '$0',
    description: 'Perfect for getting started with AI-powered fitness insights.',
    features: [
      'Basic health data sync (2 platforms)',
      'Weekly AI insights',
      'Community access',
      'Basic workout library (20 workouts)',
      '7-day data history',
    ],
    limitations: [
      'No personal training booking',
      'Ads in free content',
    ],
    mostPopular: false,
    gradient: 'from-gray-50 to-white',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/register?plan=pro',
    priceMonthly: '$19.99',
    priceYearly: '$199',
    description: 'Advanced features for serious fitness enthusiasts.',
    features: [
      'Unlimited platform integration',
      'Real-time AI insights and predictions',
      'Advanced analytics and trends',
      'Full workout library (500+ workouts)',
      'Personal training booking',
      'Priority customer support',
      'Ad-free experience',
      'Unlimited data history',
      'Custom goal setting',
    ],
    mostPopular: true,
    gradient: 'from-purple-50 to-blue-50',
    buttonVariant: 'gradient' as const,
  },
  {
    name: 'Elite',
    id: 'tier-elite',
    href: '/register?plan=elite',
    priceMonthly: '$49.99',
    priceYearly: '$499',
    description: 'Premium experience with dedicated support and concierge services.',
    features: [
      'Everything in Pro',
      'Dedicated AI health coach',
      'Concierge health services',
      'Custom nutrition planning',
      'Priority trainer booking',
      'White-glove onboarding',
      'Direct access to health experts',
      '24/7 health monitoring',
      'Exclusive community access',
    ],
    mostPopular: false,
    gradient: 'from-yellow-50 to-orange-50',
    buttonVariant: 'premium' as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export function Pricing() {
  return (
    <div id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-base font-semibold leading-7 text-disciplix-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Choose the perfect plan for your fitness journey
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Start free and upgrade as you grow. All plans include our core AI insights and health tracking capabilities.
          </p>
        </motion.div>
        
        <motion.div
          className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card 
                className={`relative h-full ${
                  tier.mostPopular 
                    ? 'ring-2 ring-disciplix-primary shadow-xl' 
                    : 'shadow-lg hover:shadow-xl'
                } transition-all duration-300 bg-gradient-to-br ${tier.gradient}`}
              >
                {tier.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-disciplix-primary to-disciplix-secondary px-4 py-1.5 text-sm font-bold text-white shadow-lg border-2 border-white">
                      <Star className="h-4 w-4 fill-white" aria-hidden="true" />
                      Most Popular
                    </div>
                  </div>
                )}
                {tier.name === 'Elite' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg border-2 border-white">
                      <Crown className="h-4 w-4 fill-white" aria-hidden="true" />
                      Premium
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tier.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400 min-h-[3rem]">
                    {tier.description}
                  </CardDescription>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-baseline gap-x-2">
                      <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-disciplix-primary to-disciplix-secondary bg-clip-text text-transparent">
                        {tier.priceMonthly}
                      </span>
                      {tier.priceMonthly !== '$0' && (
                        <span className="text-base font-semibold text-gray-600 dark:text-gray-400">
                          /month
                        </span>
                      )}
                    </div>
                    {tier.priceYearly !== '$0' && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="text-green-600 dark:text-green-400">💰</span>
                        Save 17% with annual billing ({tier.priceYearly}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col pt-6">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                      What's Included
                    </h3>
                    <ul role="list" className="space-y-3.5 text-sm leading-6 flex-1" aria-label={`${tier.name} plan features`}>
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3 items-start">
                          <Check className="h-5 w-5 flex-none text-disciplix-primary mt-0.5" aria-hidden="true" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto space-y-4">
                    <Link href={tier.href} className="block">
                      <Button
                        size="lg"
                        variant={tier.buttonVariant}
                        className="w-full text-base font-semibold h-12 shadow-lg hover:shadow-xl transition-all"
                        aria-label={`Get started with ${tier.name} plan`}
                      >
                        {tier.name === 'Basic' ? 'Start Free' : `Start ${tier.name}`}
                      </Button>
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                      <span className={tier.name === 'Basic' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}>
                        {tier.name === 'Basic' ? '🎉' : '✨'}
                      </span>
                      <span className="font-medium">
                        {tier.name === 'Basic'
                          ? 'No credit card required'
                          : '7-day free trial • Cancel anytime'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}