#!/bin/bash

# Paystack Payment Testing - Docker Script

echo "🐳 Paystack Payment Testing - Docker Management"
echo "=============================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check for environment files
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found!"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo "Please update backend/.env with your Paystack secret key"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found!"
    echo "Creating from template..."
    cp frontend/.env.local.example frontend/.env.local
    echo "Please update frontend/.env.local with your Paystack public key"
fi

# Menu
echo "Select an option:"
echo "1) Start application (docker-compose up)"
echo "2) Start in background (docker-compose up -d)"
echo "3) Build and start (docker-compose up --build)"
echo "4) Stop application (docker-compose down)"
echo "5) View logs"
echo "6) Restart services"
echo "7) Clean up (remove containers and volumes)"
echo "8) Exit"
echo ""
read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        echo "🚀 Starting application..."
        docker-compose up
        ;;
    2)
        echo "🚀 Starting application in background..."
        docker-compose up -d
        echo "✅ Application started!"
        echo "Frontend: http://localhost:3030"
        echo "Backend: http://localhost:5000"
        echo ""
        echo "View logs: docker-compose logs -f"
        echo "Stop: docker-compose down"
        ;;
    3)
        echo "🔨 Building and starting..."
        docker-compose up --build
        ;;
    4)
        echo "🛑 Stopping application..."
        docker-compose down
        echo "✅ Stopped!"
        ;;
    5)
        echo "📋 Viewing logs (Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    6)
        echo "🔄 Restarting services..."
        docker-compose restart
        echo "✅ Restarted!"
        ;;
    7)
        echo "🧹 Cleaning up..."
        docker-compose down -v
        echo "✅ Cleaned up!"
        ;;
    8)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac
