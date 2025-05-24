#!/bin/bash

# Configuration
SOURCE_SERVER="api.panelprofits.com"
DEST_SERVER="deploy.panelprofits.com"
DB_NAME="panel_profits"
BACKUP_DIR="/backups/$(date +%Y%m%d)"
LOG_FILE="/var/log/sync/sync-$(date +%Y%m%d).log"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Creating database backup..." >> $LOG_FILE
pg_dump -h $SOURCE_SERVER -U panel_profits_user $DB_NAME > $BACKUP_DIR/db_backup.sql

# Sync application files
echo "Syncing application files..." >> $LOG_FILE
rsync -avz --exclude-from='sync-exclude.txt' \
    /home/project/ \
    $DEST_SERVER:/home/project/ \
    --delete \
    --log-file=$LOG_FILE

# Sync environment files
echo "Syncing environment files..." >> $LOG_FILE
rsync -avz \
    /home/project/.env.production \
    $DEST_SERVER:/home/project/.env.production

# Apply database changes
echo "Applying database changes..." >> $LOG_FILE
psql -h $DEST_SERVER -U panel_profits_user $DB_NAME < $BACKUP_DIR/db_backup.sql

# Verify sync
echo "Verifying synchronization..." >> $LOG_FILE