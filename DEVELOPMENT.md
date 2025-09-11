# Disciplix Development Guide

## Quick Start

1. **Prerequisites**
   - Node.js 18+ 
   - Docker & Docker Compose
   - Git

2. **Setup Development Environment**
   ```bash
   # Clone and setup
   git clone <repository-url>
   cd Disciplix
   
   # Run automated setup
   ./scripts/setup-dev.sh
   ```

3. **Manual Setup (Alternative)**
   ```bash
   # Install dependencies
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   
   # Setup environment variables
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Start services
   docker-compose -f docker-compose.dev.yml up -d postgres redis mailhog
   
   # Setup database
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   
   # Start development servers
   npm run dev
   ```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
npm run storybook    # Start Storybook
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run lint         # Lint code
npm run test         # Run tests
```

### Database Management
```bash
cd backend

# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset

# View database in browser
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: Framer Motion
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Custom Components

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **Email**: Nodemailer with multiple provider support
- **File Storage**: AWS S3 (configurable)
- **Real-time**: Socket.io

### Database Schema
The database uses Prisma ORM with the following key models:
- `User` - Core user account and authentication
- `UserProfile` - Personal fitness information
- `HealthDataPoint` - Time-series health metrics
- `AIInsight` - AI-generated recommendations and insights
- `TrainingSession` - Personal trainer bookings
- `FitnessGoal` - User-defined fitness objectives

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Refresh access token
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password  - Password reset confirmation
```

### Protected Endpoints
All API endpoints except auth require `Authorization: Bearer <token>` header.

### Subscription Tiers
- **FREE**: Basic features, limited integrations
- **PREMIUM**: Advanced AI insights, trainer booking
- **ELITE**: Concierge services, priority support

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Naming**: camelCase for variables, PascalCase for components

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git commit -m "feat: add new feature"
git push origin feature/feature-name

# Bug fixes
git checkout -b fix/bug-description
git commit -m "fix: resolve issue with X"

# Commit message format
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: improve code structure
test: add tests
chore: update dependencies
```

### Testing Strategy
- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright (coming soon)
- **Component Tests**: Storybook + Chromatic

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
REDIS_URL=redis://localhost:6379
# ... see backend/.env.example for full list
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Common Issues & Solutions

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps postgres

# Reset database
cd backend
npx prisma migrate reset
```

### Port Conflicts
- Frontend: 3000
- Backend: 3001
- PostgreSQL: 5432
- Redis: 6379
- MailHog: 8025

### Clear Cache and Restart
```bash
# Clear all caches
docker-compose -f docker-compose.dev.yml down -v
rm -rf frontend/.next
rm -rf backend/dist
npm run dev
```

## Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production Build
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring & Debugging

### Logs
```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Health Checks
- Backend Health: http://localhost:3001/health
- Database: Connect to localhost:5432
- Redis: redis-cli ping at localhost:6379

### Development Tools
- **Database**: Prisma Studio at http://localhost:5555
- **Email Testing**: MailHog at http://localhost:8025
- **API Testing**: Use Postman/Insomnia with provided collection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linters and tests
6. Submit a pull request

For questions or support, contact the development team.