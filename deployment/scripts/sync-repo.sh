#!/bin/bash

# Configuration
REPO_URL=${REPO_URL:-"https://github.com/yourusername/panel-profits.git"}
BRANCH=${BRANCH:-"main"}
APP_DIR="/var/www/panelprofits/current"
LOG_FILE="/var/log/panelprofits/sync.log"

# Create log directory if it doesn't exist
mkdir -p $(dirname $LOG_FILE)

echo "Starting repository sync at $(date)" >> $LOG_FILE

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Installing git..." >> $LOG_FILE
    apt-get update && apt-get install -y git
fi

# Navigate to app directory
cd $APP_DIR || {
    echo "Failed to navigate to $APP_DIR" >> $LOG_FILE
    exit 1
}

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "Initializing git repository..." >> $LOG_FILE
    git init
    git remote add origin $REPO_URL
    git fetch
    git checkout -b $BRANCH --track origin/$BRANCH
else
    # Fetch latest changes
    echo "Fetching latest changes from repository..." >> $LOG_FILE
    git fetch origin $BRANCH
    
    # Check for local changes
    if git diff-index --quiet HEAD --; then
        echo "No local changes, pulling latest code..." >> $LOG_FILE
        git pull origin $BRANCH
    else
        echo "Local changes detected. Stashing changes before pulling..." >> $LOG_FILE
        git stash
        git pull origin $BRANCH
        git stash pop || echo "Stash pop failed, may need manual resolution" >> $LOG_FILE
    fi
fi

# Install any new dependencies
echo "Installing dependencies..." >> $LOG_FILE
npm ci --production

# Verify Vite installation
if [ ! -d "node_modules/vite" ]; then
    echo "Vite not found in node_modules, installing explicitly..." >> $LOG_FILE
    npm install vite
fi

# Rebuild application
echo "Rebuilding application..." >> $LOG_FILE
npm run build

echo "Repository sync completed at $(date)" >> $LOG_FILE

# Restart application if needed
if [ -n "$(pm2 list | grep panelprofits)" ]; then
    echo "Restarting application..." >> $LOG_FILE
    pm2 restart panelprofits-production panelprofits-development || true
fi