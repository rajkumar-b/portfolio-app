#!/bin/bash
# install-dependencies.sh

# Update the package repository
sudo yum update -y

# Install Node.js and npm
sudo yum install -y nodejs npm

# Change to the project directory
cd /var/www/html

# Install project dependencies using npm
npm install
