#!/bin/bash

# Configuration
ENVIRONMENT=$1
LOG_FILE="/var/log/panelprofits/monitor.log"

# Check application status
check_app_status() {
    local port=$1
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/api/health)
    if [ "$response" == "200" ]; then
        echo "Application is healthy"
        return 0
    else
        echo "Application is not responding correctly (HTTP $response)"
        return 1
    fi
}

# Check database connection
check_database() {
    psql -h localhost -U panel_profits_user -d panel_profits -c "SELECT 1" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "Database connection successful"
        return 0
    else
        echo "Database connection failed"
        return 1
    fi
}

# Main monitoring loop
while true; do
    echo "=== Monitoring Check: $(date) ===" >> $LOG_FILE
    
    if [ "$ENVIRONMENT" == "production" ]; then
        check_app_status 4040 >> $LOG_FILE
    else
        check_app_status 4041 >> $LOG_FILE
    fi
    
    check_database >> $LOG_FILE
    
    sleep 60
done