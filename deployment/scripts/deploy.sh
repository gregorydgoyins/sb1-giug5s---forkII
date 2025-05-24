#!/bin/bash

# Configuration
ENVIRONMENT=$1
APP_DIR="/var/www/panelprofits"
BACKUP_DIR="/var/backups/panelprofits"
LOG_FILE="/var/log/panelprofits/deploy.log"

# Create directories if they don't exist
mkdir -p $APP_DIR $BACKUP_DIR $(dirname $LOG_FILE)

# Load environment variables
if [ "$ENVIRONMENT" == "production" ]; then
    source deployment/config/production.env
    PORT=4040
else
    source deployment/config/development.env
    PORT=4041
fi

# Backup current deployment
timestamp=$(date +%Y%m%d_%H%M%S)
if [ -d "$APP_DIR/current" ]; then
    mv $APP_DIR/current $BACKUP_DIR/$timestamp
fi

# Create new deployment directory
mkdir -p $APP_DIR/current

# Copy application files
cp -r . $APP_DIR/current

# Install dependencies
cd $APP_DIR/current
npm ci --production

# Verify Vite installation
if [ ! -d "node_modules/vite" ]; then
    echo "Vite not found in node_modules, installing explicitly..."
    npm install vite
fi

# Build application
npm run build

# Update environment variables
cp deployment/config/$ENVIRONMENT.env .env.local

# Start application
pm2 delete panelprofits-$ENVIRONMENT || true
pm2 start npm --name "panelprofits-$ENVIRONMENT" -- start -- --port $PORT

# Generate sitemap
npm run generate-sitemap

# Sync with repository
echo "Syncing with repository..."
git pull origin main

echo "Deployment completed successfully at $(date)" >> $LOG_FILE