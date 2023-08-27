#!/bin/bash
# start-server.sh

# Check if httpd is running and stop it if needed
if sudo systemctl is-active httpd &> /dev/null; then
  sudo systemctl stop httpd
fi

# Change to the project directory
cd /var/www/html/portfolio-app

# Build app
npm run build

# stop the server if already running
sudo killall http-server

# start the server in background and disown
LOG_FILE=/home/ec2-user/http-server.log
sudo nohup ~/.npm-global/bin/http-server dist -p 80 -d false --hostname rajkumar.app > $LOG_FILE 2>&1 & \
sudo nohup ~/.npm-global/bin/http-server dist -p 443 --ssl --cert /etc/letsencrypt/live/rajkumar.app/cert.pem --key /etc/letsencrypt/live/rajkumar.app/privkey.pem -d false --hostname rajkumar.app > $LOG_FILE 2>&1 & \
disown

# echo success
echo "success"
