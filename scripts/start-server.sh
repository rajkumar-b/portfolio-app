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
sudo ~/.npm-global/bin/http-server dist -p 80 > /var/log/http-server.log 2>&1 &
disown

# echo success
echo "success"
