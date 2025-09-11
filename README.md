# Disciplix.AI

Premium AI-Powered Fitness & Personal Training Platform

## Overview

Disciplix is a premium AI-powered fitness ecosystem that seamlessly integrates health tracking, personalized coaching, and human expertise to deliver transformative fitness experiences.

## Project Structure

```
Disciplix/
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/           # Next.js 14 app router
│   │   ├── components/    # React components
│   │   ├── lib/          # Core libraries and utilities
│   │   ├── types/        # TypeScript type definitions
│   │   ├── utils/        # Utility functions
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── utils/        # Server utilities
│   └── config/           # Configuration files
├── mobile/               # React Native mobile app
│   ├── src/
│   │   ├── screens/      # Mobile screens
│   │   ├── components/   # Mobile components
│   │   ├── services/     # Mobile services
│   │   └── types/        # Mobile types
│   └── assets/           # Mobile assets
├── docs/                 # Documentation
└── scripts/              # Build and deployment scripts
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: Zustand + React Query
- **UI Components**: Custom design system

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT with refresh tokens
- **API**: RESTful + GraphQL

### Mobile
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Zustand

### AI/ML
- **Framework**: TensorFlow.js / Python backend
- **Features**: Health insights, predictive analytics
- **Data**: Multi-platform health data integration

## Getting Started

1. Clone the repository
2. Install dependencies for each service
3. Set up environment variables
4. Run development servers

## Development

See individual README files in each directory for specific setup instructions.

## License

Proprietary - All rights reserved