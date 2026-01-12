#!/bin/bash

# Tekion Lead Management Frontend Launcher
# This script starts a simple HTTP server for the frontend

echo "🚗 Tekion Lead Management System - Frontend"
echo "==========================================="
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo "🚀 Starting frontend server on http://localhost:8000"
    echo ""
    echo "📝 Make sure your backend is running on http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    echo "🚀 Starting frontend server on http://localhost:8000"
    echo ""
    echo "📝 Make sure your backend is running on http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
else
    echo "❌ Python not found!"
    echo ""
    echo "Please install Python or use one of these alternatives:"
    echo ""
    echo "Option 1: Install Python"
    echo "  - macOS: brew install python3"
    echo "  - Linux: sudo apt-get install python3"
    echo ""
    echo "Option 2: Use Node.js http-server"
    echo "  - npm install -g http-server"
    echo "  - http-server -p 8000"
    echo ""
    echo "Option 3: Use VS Code Live Server extension"
    echo "  - Install 'Live Server' extension"
    echo "  - Right-click index.html and select 'Open with Live Server'"
    echo ""
    exit 1
fi

