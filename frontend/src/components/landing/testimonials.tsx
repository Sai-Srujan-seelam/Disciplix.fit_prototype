'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    body: "Disciplix has completely transformed how I approach fitness. The AI insights are incredibly accurate and have helped me prevent injuries while maximizing my performance. The trainer matching system connected me with the perfect coach.",
    author: {
      name: 'Sarah Chen',
      handle: '@sarahfitness',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b6d96d62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      role: 'Fitness Enthusiast'
    },
  },
  {
    body: "As a busy executive, I love how Disciplix integrates all my health data and provides personalized recommendations that fit my hectic schedule. The predictive analytics have helped me optimize my recovery and energy levels.",
    author: {
      name: 'Marcus Johnson',
      handle: '@marcusexec',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      role: 'CEO, TechCorp'
    },
  },
  {
    body: "The platform's ability to sync data from all my devices and provide meaningful insights is game-changing. I've seen a 40% improvement in my training efficiency since switching to Disciplix. The community features keep me motivated.",
    author: {
      name: 'Emily Rodriguez',
      handle: '@emilytrains',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      role: 'Personal Trainer'
    },
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-background to-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-disciplix-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by fitness enthusiasts worldwide
          </p>
        </motion.div>
        
        <motion.div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-muted-foreground sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, testimonialIdx) => (
            <motion.div
              key={testimonial.author.handle}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`xl:col-start-${testimonialIdx === 0 ? '1' : testimonialIdx === 1 ? '2' : '4'} xl:col-end-${testimonialIdx === 0 ? '3' : testimonialIdx === 1 ? '4' : '5'} xl:row-start-1 xl:row-end-2`}
            >
              <Card className="h-full p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-foreground leading-relaxed">
                    "{testimonial.body}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={testimonial.author.imageUrl}
                      alt={testimonial.author.name}
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.author.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          <motion.div
            variants={itemVariants}
            className="xl:col-span-2 xl:col-start-1 xl:row-start-2 xl:row-end-3"
          >
            <Card className="h-full p-8 shadow-lg bg-gradient-to-r from-disciplix-primary to-disciplix-secondary text-white">
              <CardContent className="p-0 text-center space-y-4">
                <div className="text-4xl font-bold">4.9/5</div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-white text-white"
                    />
                  ))}
                </div>
                <p className="text-white/90">
                  Based on 10,000+ reviews
                </p>
                <p className="text-sm text-white/80">
                  "Best fitness platform I've ever used"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}