import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users with trainer profiles
  const trainers = [
    {
      name: 'Alex Thompson',
      email: 'alex.thompson@disciplix.ai',
      bio: 'Certified personal trainer with 10+ years of experience in strength training and bodybuilding. Specializing in muscle gain and athletic performance.',
      experience: 10,
      hourlyRate: 85,
      specialties: ['Strength Training', 'Bodybuilding', 'Athletic Performance', 'Nutrition'],
      certifications: [
        { name: 'NASM-CPT', issuer: 'National Academy of Sports Medicine', year: 2014 },
        { name: 'CSCS', issuer: 'National Strength and Conditioning Association', year: 2015 }
      ],
      languages: ['English', 'Spanish'],
      isVerified: true,
      rating: 4.9,
      reviewCount: 127,
      totalSessions: 856
    },
    {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@disciplix.ai',
      bio: 'Yoga instructor and wellness coach focused on flexibility, mindfulness, and holistic fitness. Perfect for beginners and stress management.',
      experience: 7,
      hourlyRate: 65,
      specialties: ['Yoga', 'Flexibility', 'Mindfulness', 'Stress Management'],
      certifications: [
        { name: 'RYT-500', issuer: 'Yoga Alliance', year: 2018 },
        { name: 'Certified Wellness Coach', issuer: 'NBHWC', year: 2019 }
      ],
      languages: ['English', 'French'],
      isVerified: true,
      rating: 4.8,
      reviewCount: 89,
      totalSessions: 543
    },
    {
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@disciplix.ai',
      bio: 'Former professional athlete turned HIIT specialist. Expert in weight loss, cardiovascular fitness, and high-intensity training programs.',
      experience: 12,
      hourlyRate: 95,
      specialties: ['HIIT', 'Weight Loss', 'Cardio', 'Sports Performance'],
      certifications: [
        { name: 'ACE-CPT', issuer: 'American Council on Exercise', year: 2012 },
        { name: 'TRX Certified', issuer: 'TRX Training', year: 2016 }
      ],
      languages: ['English', 'Spanish', 'Portuguese'],
      isVerified: true,
      rating: 4.9,
      reviewCount: 203,
      totalSessions: 1245
    },
    {
      name: 'Emily Chen',
      email: 'emily.chen@disciplix.ai',
      bio: 'Pilates instructor and rehabilitation specialist. Helping clients recover from injuries and build core strength with low-impact exercises.',
      experience: 8,
      hourlyRate: 75,
      specialties: ['Pilates', 'Rehabilitation', 'Core Strength', 'Injury Prevention'],
      certifications: [
        { name: 'PMA-CPT', issuer: 'Pilates Method Alliance', year: 2017 },
        { name: 'Corrective Exercise Specialist', issuer: 'NASM', year: 2018 }
      ],
      languages: ['English', 'Mandarin'],
      isVerified: true,
      rating: 4.7,
      reviewCount: 64,
      totalSessions: 392
    },
    {
      name: 'David Park',
      email: 'david.park@disciplix.ai',
      bio: 'CrossFit coach and functional fitness expert. Building strength, endurance, and overall athletic ability through varied training methods.',
      experience: 9,
      hourlyRate: 80,
      specialties: ['CrossFit', 'Functional Fitness', 'Olympic Lifting', 'Endurance'],
      certifications: [
        { name: 'CrossFit Level 3', issuer: 'CrossFit Inc', year: 2016 },
        { name: 'USAW Level 1', issuer: 'USA Weightlifting', year: 2017 }
      ],
      languages: ['English', 'Korean'],
      isVerified: true,
      rating: 4.8,
      reviewCount: 112,
      totalSessions: 678
    },
    {
      name: 'Jessica Williams',
      email: 'jessica.williams@disciplix.ai',
      bio: 'Nutritionist and fitness coach specializing in women\'s health, prenatal/postnatal fitness, and sustainable lifestyle changes.',
      experience: 6,
      hourlyRate: 70,
      specialties: ['Women\'s Fitness', 'Prenatal/Postnatal', 'Nutrition', 'Lifestyle Coaching'],
      certifications: [
        { name: 'NASM-CPT', issuer: 'National Academy of Sports Medicine', year: 2018 },
        { name: 'Pre/Postnatal Coach', issuer: 'Girls Gone Strong', year: 2019 },
        { name: 'Certified Nutritionist', issuer: 'ACN', year: 2020 }
      ],
      languages: ['English'],
      isVerified: true,
      rating: 4.9,
      reviewCount: 95,
      totalSessions: 512
    }
  ]

  const hashedPassword = await bcrypt.hash('Demo123!@#', 12)

  for (const trainerData of trainers) {
    const { bio, experience, hourlyRate, specialties, certifications, languages, isVerified, rating, reviewCount, totalSessions, ...userData } = trainerData

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        verified: true,
        subscription: {
          create: {
            tier: 'PREMIUM',
            status: 'ACTIVE'
          }
        },
        preferences: {
          create: {}
        },
        profile: {
          create: {
            age: 25 + Math.floor(Math.random() * 15),
            activityLevel: 'VERY_ACTIVE',
            fitnessLevel: 'EXPERT'
          }
        },
        trainerProfile: {
          create: {
            bio,
            experience,
            hourlyRate,
            specialties,
            certifications,
            languages,
            isVerified,
            rating,
            reviewCount,
            totalSessions,
            location: {
              city: 'San Francisco',
              state: 'CA',
              country: 'USA',
              timezone: 'America/Los_Angeles'
            },
            availability: {
              monday: ['09:00-12:00', '14:00-18:00'],
              tuesday: ['09:00-12:00', '14:00-18:00'],
              wednesday: ['09:00-12:00', '14:00-18:00'],
              thursday: ['09:00-12:00', '14:00-18:00'],
              friday: ['09:00-12:00', '14:00-18:00'],
              saturday: ['10:00-14:00'],
              sunday: []
            }
          }
        }
      }
    })

    console.log(`✅ Created trainer: ${user.name}`)
  }

  // Create a regular test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@disciplix.ai',
      password: hashedPassword,
      verified: true,
      subscription: {
        create: {
          tier: 'FREE',
          status: 'TRIAL',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
        }
      },
      preferences: {
        create: {}
      },
      profile: {
        create: {
          age: 28,
          height: 175,
          weight: 75,
          activityLevel: 'MODERATE',
          fitnessLevel: 'BEGINNER'
        }
      },
      goals: {
        create: [
          {
            type: 'WEIGHT_LOSS',
            title: 'Lose 10 kg',
            description: 'Reach my target weight by summer',
            target: 65,
            current: 75,
            unit: 'kg',
            status: 'ACTIVE',
            priority: 'HIGH',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          },
          {
            type: 'ENDURANCE',
            title: 'Run 5K',
            description: 'Complete a 5K run without stopping',
            target: 5,
            current: 2,
            unit: 'km',
            status: 'ACTIVE',
            priority: 'MEDIUM',
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    }
  })

  console.log(`✅ Created test user: ${testUser.name}`)

  console.log('✨ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
