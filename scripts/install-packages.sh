#!/bin/bash
# install-packages.sh

# Change to the project directory
cd /var/www/html/portfolio-app

# Install project dependencies using npm
sudo npm install

# Install three js in case not installed
sudo npm install three

# Install Vite
sudo npm install -g vite@latest

# Install node built-in server
sudo npm install -g http-server
