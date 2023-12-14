#!/bin/bash
yum update -y  # Update packages (if needed)

# Install CodeDeploy agent
yum install -y ruby
wget https://aws-codedeploy-us-east-2.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto