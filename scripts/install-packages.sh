#!/bin/bash
# install-packages.sh

# Change to the project directory
cd /var/www/html/portfolio-app

# Install project dependencies using npm
npm install

# Install three js in case not installed
npm install three

# Install Vite
npm install -g vite@latest

# Build app
npm run build

# Install node build-in server
npm install -g http-server

# start the server
http-server dist -p 80
