# providers.tf

############################################################################

variable "aws_region" {
  description = "Name of the AWS region"
}

variable "ec2_iam_role_name" {
  description = "Name of the AWS IAM Role for EC2 and CodeDeploy"
}

variable "ec2_security_group_name" {
  description = "Name of the Security group for EC2 instance"
}

variable "ec2_allowed_ip_http" {
  description = "List of IP addresses for inbound HTTP connection"
}

variable "ec2_allowed_ip_https" {
  description = "List of IP addresses for inbound HTTPS connection"
}

variable "ec2_allowed_ip_ssh" {
  description = "List of IP addresses for inbound SSH connection"
}

variable "ec2_outbound_ip_all_port" {
  description = "List of IP addresses for all outbound connection"
}

variable "ec2_ssh_key_pair_name" {
  description = "Name for the SSH key pair to associate with EC2 instance"
}

variable "ec2_ssh_key_path" {
  description = "Folder Location for the generated SSH pair"
}

variable "ec2_ami_id" {
  description = "AMI ID for the EC2 instance"
}

variable "ec2_instance_type" {
  description = "Instance type for the EC2 instance"
}

variable "ec2_instance_storage_gb" {
  description = "Storage size in GB for the EC2 instance"
}

variable "ec2_tag_name" {
  description = "Tag name associated with the EC2 instance"
}

variable "ec2_tag_env" {
  description = "Environment tag for the EC2 instance"
}

variable "ec2_script_codedeploy_agent" {
  description = "Location of script to install CodeDeploy agent in the EC2 instance"
}

variable "git_owner" {
  description = "Owner of the github project to be deployed"
}

variable "git_repo" {
  description = "Repository Name of the github project for deployment"
}

variable "git_branch" {
  description = "Branch for CI/CD from github repo"
}

variable "github_connection_arn" {
  description = "Connection ARN of the github connection made for the repo in AWS"
}

variable "artifact_location_s3" {
  description = "Temp location for storing build artifacts of CodePipeline"
}

############################################################################

terraform {
  required_version = ">=1.6.0"
  
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.30.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "3.2.2"
    }
    local = {
      source  = "hashicorp/local"
      version = "2.4.1"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "4.0.5"
    }
  }
}

# Set AWS as provider with region
provider "aws" {
  region = var.aws_region
}

############################################################################