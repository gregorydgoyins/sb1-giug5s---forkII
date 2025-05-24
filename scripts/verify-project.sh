#!/bin/bash

# Configuration
LOG_FILE="./verification.log"
echo "Starting project verification at $(date)" > $LOG_FILE

# Check Node.js and npm
echo "Checking Node.js installation..." >> $LOG_FILE
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed!" >> $LOG_FILE
    exit 1
fi

NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION" >> $LOG_FILE

if ! command -v npm &> /dev/null; then
    echo "npm is not installed!" >> $LOG_FILE
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "npm version: $NPM_VERSION" >> $LOG_FILE

# Check package.json
echo "Checking package.json..." >> $LOG_FILE
if [ ! -f "package.json" ]; then
    echo "package.json not found!" >> $LOG_FILE
    exit 1
fi

# Check if Vite is in dependencies
if ! grep -q '"vite":' package.json; then
    echo "Vite is not in package.json dependencies!" >> $LOG_FILE
    exit 1
fi

# Clean installation
echo "Removing node_modules..." >> $LOG_FILE
rm -rf node_modules
rm -f package-lock.json

# Fresh install
echo "Installing dependencies..." >> $LOG_FILE
npm install

# Check if Vite is installed
echo "Checking Vite installation..." >> $LOG_FILE
if [ ! -d "node_modules/vite" ]; then
    echo "Vite not found in node_modules!" >> $LOG_FILE
    echo "Installing Vite explicitly..." >> $LOG_FILE
    npm install vite
fi

# Verify Vite installation
if [ ! -d "node_modules/vite" ]; then
    echo "Failed to install Vite!" >> $LOG_FILE
    exit 1
fi

echo "Vite is properly installed." >> $LOG_FILE

# Try building the project
echo "Attempting to build the project..." >> $LOG_FILE
if npm run build; then
    echo "Build successful!" >> $LOG_FILE
else
    echo "Build failed!" >> $LOG_FILE
    exit 1
fi

echo "Project verification completed successfully at $(date)" >> $LOG_FILE
echo "Your project is in a working state."