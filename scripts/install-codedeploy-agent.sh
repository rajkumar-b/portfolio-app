#!/bin/bash
yum update -y  # Update packages (if needed)

# Install CodeDeploy agent
yum install -y ruby
wget https://aws-codedeploy-us-east-2.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto

# Install Certbot to generate SSL
sudo yum install python3
sudo python3 -m ensurepip --default-pip
sudo pip install certbot
