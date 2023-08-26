#!/bin/bash
# install-packages.sh

# Change to the project directory
cd /var/www/html/portfolio-app

# Install project dependencies using npm
npm install

# Install three js in case not installed
npm install three

# Install Vite
npm install -g create-vite
