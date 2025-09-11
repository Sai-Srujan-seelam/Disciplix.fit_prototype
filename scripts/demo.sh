#!/bin/bash

echo "🏋️  Disciplix AI-Powered Fitness Platform - Demo"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
    echo "❌ Please run this script from the Disciplix root directory"
    exit 1
fi

echo "📋 Testing Project Structure..."
echo "✅ Frontend directory exists"
echo "✅ Backend directory exists"
echo "✅ Root package.json exists"
echo ""

echo "🔍 Running Frontend Tests..."
cd frontend
echo "Frontend build test:"
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
fi
cd ..
echo ""

echo "🔍 Running Backend Tests..."
cd backend  
echo "Backend build test:"
if npm run build > /dev/null 2>&1; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed"
fi

echo "Database schema validation:"
if npx prisma validate > /dev/null 2>&1; then
    echo "✅ Prisma schema is valid"
else
    echo "❌ Prisma schema validation failed"
fi
cd ..
echo ""

echo "📊 Project Statistics:"
echo "Frontend files: $(find frontend/src -name '*.tsx' -o -name '*.ts' | wc -l | xargs) TypeScript/React files"
echo "Backend files: $(find backend/src -name '*.ts' | wc -l | xargs) TypeScript files"
echo "Database models: $(grep -c "^model " backend/prisma/schema.prisma) Prisma models"
echo ""

echo "🚀 Ready to Start Development!"
echo ""
echo "To start the development environment:"
echo "1. Frontend: cd frontend && npm run dev"
echo "2. Backend: cd backend && npm run dev (after setting up PostgreSQL)"
echo ""
echo "📖 See DEVELOPMENT.md for detailed setup instructions"
echo "📊 See TESTING_REPORT.md for complete test results"