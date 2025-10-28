'use client'

import { motion } from 'framer-motion'
import { Award, Target, Users, Zap, Heart, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Workouts Completed', value: '1M+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Expert Trainers', value: '100+' },
  ]

  const values = [
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature is designed with your health and wellness journey in mind.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI to provide personalized fitness experiences.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community of fitness enthusiasts and professionals.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality training and support.',
    },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: null,
      bio: 'Former Olympic athlete with a passion for democratizing fitness.',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Medical Officer',
      image: null,
      bio: 'Sports medicine specialist with 15+ years of experience.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of AI',
      image: null,
      bio: 'AI researcher focused on personalized health recommendations.',
    },
    {
      name: 'James Williams',
      role: 'Head of Training',
      image: null,
      bio: 'Certified master trainer with expertise in multiple disciplines.',
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="mb-6 text-5xl font-bold md:text-6xl">
                Transforming Fitness Through AI
              </h1>
              <p className="mb-8 text-xl text-purple-100">
                Disciplix is on a mission to make world-class fitness coaching accessible to everyone
                through the power of artificial intelligence and human expertise.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2 text-4xl font-bold text-purple-600">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
              >
                <h2 className="mb-4 text-4xl font-bold text-gray-900">Our Mission</h2>
                <p className="text-xl text-gray-600">
                  To empower individuals to achieve their fitness goals through personalized,
                  AI-powered insights combined with expert human coaching.
                </p>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg bg-white p-8 shadow-lg"
                >
                  <Target className="mb-4 h-12 w-12 text-purple-600" />
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Our Vision</h3>
                  <p className="text-gray-600">
                    A world where everyone has access to personalized, professional-grade fitness
                    guidance, regardless of their location or budget.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg bg-white p-8 shadow-lg"
                >
                  <TrendingUp className="mb-4 h-12 w-12 text-purple-600" />
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">Our Approach</h3>
                  <p className="text-gray-600">
                    Combining cutting-edge AI technology with certified fitness professionals to
                    deliver truly personalized training experiences.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-gray-900">Our Values</h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <value.icon className="mb-4 h-10 w-10 text-purple-600" />
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold text-gray-900">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                Passionate experts dedicated to your success
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg bg-white p-6 shadow-lg text-center"
                >
                  <div className="mb-4 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-3xl font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-purple-600">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="mb-6 text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="mb-8 text-xl text-purple-100">
                Join thousands of users transforming their fitness with Disciplix
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/trainers">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Browse Trainers
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
