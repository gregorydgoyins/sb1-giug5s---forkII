#!/bin/bash

# Configuration
SOURCE_SERVER="api.panelprofits.com"
DEST_SERVER="deploy.panelprofits.com"
DB_NAME="panel_profits"
LOG_FILE="/var/log/sync/verify-$(date +%Y%m%d).log"

# Verify database
echo "Verifying database synchronization..." >> $LOG_FILE
psql -h $SOURCE_SERVER -U panel_profits_user $DB_NAME -c "SELECT COUNT(*) FROM news_items" > source_count.txt
psql -h $DEST_SERVER -U panel_profits_user $DB_NAME -c "SELECT COUNT(*) FROM news_items" > dest_count.txt

if diff source_count.txt dest_count.txt; then
    echo "Database verification passed" >> $LOG_FILE
else
    echo "Database verification failed" >> $LOG_FILE
    exit 1
fi

# Verify file checksums
echo "Verifying file checksums..." >> $LOG_FILE
find /home/project -type f -not -path "*/\.*" -exec md5sum {} \; | sort > source_checksums.txt
ssh $DEST_SERVER "find /home/project -type f -not -path "*/\.*" -exec md5sum {} \;" | sort > dest_checksums.txt

if diff source_checksums.txt dest_checksums.txt; then
    echo "File verification passed" >> $LOG_FILE
else
    echo "File verification failed" >> $LOG_FILE
    exit 1
fi