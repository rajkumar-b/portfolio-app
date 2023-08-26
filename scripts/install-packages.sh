#!/bin/bash
# install-packages.sh

# Change to the project directory
cd /var/www/html/portfolio-app

# Install project dependencies using npm
npm install

# Install three js in case not installed
npm install three

# make a directory for global installs
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Install Vite
npm install -g vite@latest

# Install node built-in server
npm install -g http-server
