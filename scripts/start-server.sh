#!/bin/bash
# start-server.sh

# Check if httpd is running and stop it if needed
if sudo systemctl is-active httpd &> /dev/null; then
  sudo systemctl stop httpd
fi

# Change to the project directory
cd /var/www/html/portfolio-app

# Start your Three.js server (replace with your actual command)
npm start
