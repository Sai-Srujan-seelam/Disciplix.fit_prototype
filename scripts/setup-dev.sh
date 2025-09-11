#!/bin/bash

# Disciplix Development Environment Setup Script

echo "🏋️  Setting up Disciplix development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
echo "📄 Creating environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from .env.example"
    echo "⚠️  Please update backend/.env with your actual configuration"
fi

if [ ! -f frontend/.env.local ]; then
    cat > frontend/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
    echo "✅ Created frontend/.env.local"
fi

# Create logs directory for backend
mkdir -p backend/logs

echo "🐳 Starting Docker services..."

# Start the development environment
docker-compose -f docker-compose.dev.yml up -d postgres redis mailhog

echo "⏳ Waiting for database to be ready..."
sleep 10

# Install dependencies and setup database
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "🗄️  Setting up database..."
npx prisma migrate dev --name init
npx prisma generate

cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install

cd ..

echo "🚀 Starting the application..."
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "✅ Disciplix development environment is ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001"
echo "📧 MailHog (Email testing): http://localhost:8025"
echo "🗄️  Database: localhost:5432 (disciplix/disciplix_dev_password)"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📊 Health check: http://localhost:3001/health"
echo ""
echo "To stop the environment, run: docker-compose -f docker-compose.dev.yml down"
echo "To view logs, run: docker-compose -f docker-compose.dev.yml logs -f [service-name]"