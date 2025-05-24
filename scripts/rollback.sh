#!/bin/bash

# Configuration
DEST_SERVER="deploy.panelprofits.com"
DB_NAME="panel_profits"
BACKUP_DIR="/backups"
LOG_FILE="/var/log/sync/rollback-$(date +%Y%m%d).log"

# Find latest backup
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*/db_backup.sql | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No backup found" >> $LOG_FILE
    exit 1
fi

# Restore database
echo "Rolling back database..." >> $LOG_FILE
psql -h $DEST_SERVER -U panel_profits_user $DB_NAME < $LATEST_BACKUP

# Restore files
echo "Rolling back files..." >> $LOG_FILE
BACKUP_FILES_DIR=$(dirname $LATEST_BACKUP)
rsync -avz --delete \
    $BACKUP_FILES_DIR/files/ \
    $DEST_SERVER:/home/project/ \
    --log-file=$LOG_FILE