# main.tf

############################################################################

# IAM Role creation
resource "aws_iam_role" "ec2_iam_role" {
  name = var.ec2_iam_role_name
  assume_role_policy = var.assume_policy_ec2_codedeploy
  
  inline_policy {
    name = "AmazonS3ReadOnlyAccess"
    policy = var.inline_policy_s3_readonly
  }

  inline_policy {
    name = "AmazonEC2FullAccess"
    policy = var.inline_policy_ec2_full_access
  }

  inline_policy {
    name = "AWSCodeDeployRole"
    policy = var.inline_policy_code_deploy_role
  }

  inline_policy {
    name = "AWSCodeDeployFullAccess"
    policy = var.inline_policy_code_deploy_full_access
  }

  inline_policy {
    name = "AmazonEC2RoleforAWSCodeDeploy"
    policy = var.inline_policy_ec2_role_for_codedeploy
  }

  inline_policy {
    name = "AWSCodePipelineServiceRole"
    policy = var.inline_policy_codepipeline_service_role
  }
}

# IAM Role's Profile creation
resource "aws_iam_instance_profile" "ec2_iam_profile" {
  # Generate profile name from role name
  name = "${aws_iam_role.ec2_iam_role.name}-profile"
  role = aws_iam_role.ec2_iam_role.name
}

############################################################################

# Security Group for SSH, HTTP, and HTTPS access
resource "aws_security_group" "ec2_security_group" {
  name        = var.ec2_security_group_name
  description = "Allow SSH, HTTP, and HTTPS access"
  
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ec2_allowed_ip_ssh
  }
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.ec2_allowed_ip_http
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.ec2_allowed_ip_https
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.ec2_outbound_ip_all_port
  }
}

############################################################################

# Generate a RSA key using tls if it does not exist locally
resource "tls_private_key" "ec2_private_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Delete key pair if it exists already in AWS
resource "null_resource" "delete_aws_key" {
  depends_on = [
    tls_private_key.ec2_private_key
  ]

  provisioner "local-exec" {
    command = "aws ec2 delete-key-pair --key-name ${var.ec2_ssh_key_pair_name} || (echo 'Deletion failed' && exit 1)"
  }
}

# Create a new SSH key pair in AWS
resource "aws_key_pair" "ec2_ssh_key" {
  depends_on = [
    null_resource.delete_aws_key
  ]
  
  key_name = var.ec2_ssh_key_pair_name
  public_key = tls_private_key.ec2_private_key.public_key_openssh
}


# Store private key locally
resource "local_sensitive_file" "ec2_private_key" {
  depends_on = [
    tls_private_key.ec2_private_key
  ]

  filename = "${var.ec2_ssh_key_path}/${var.ec2_ssh_key_pair_name}.pem" 
  content  = tls_private_key.ec2_private_key.private_key_pem
  file_permission = "0600"
}

# Store public key locally
resource "local_sensitive_file" "ec2_public_key" {
  depends_on = [
    aws_key_pair.ec2_ssh_key
  ]
  filename = "${var.ec2_ssh_key_path}/${var.ec2_ssh_key_pair_name}.pub" 
  content  = aws_key_pair.ec2_ssh_key.public_key
  file_permission = "0644"
}

############################################################################

# EC2 Instance creation
resource "aws_instance" "ec2_instance" {
  depends_on = [
    aws_key_pair.ec2_ssh_key,
    aws_iam_instance_profile.ec2_iam_profile,
    aws_security_group.ec2_security_group
  ]
  ami             = var.ec2_ami_id
  instance_type   = var.ec2_instance_type 
  security_groups = [aws_security_group.ec2_security_group.name]
  key_name        = aws_key_pair.ec2_ssh_key.key_name 
  iam_instance_profile = aws_iam_instance_profile.ec2_iam_profile.name
  root_block_device {
    volume_size   = var.ec2_instance_storage_gb
  }
  tags = {
    Name        = var.ec2_tag_name
    Environment = var.ec2_tag_env
  }
  user_data = file(var.ec2_script_codedeploy_agent)
  user_data_replace_on_change = true
}

############################################################################

# AWS CodeDeploy Application
resource "aws_codedeploy_app" "codedeploy_app" {
  compute_platform   = "Server"
  name               = "${var.ec2_tag_name}-deploy"
}

# AWS CodeDeploy Deployment Group
resource "aws_codedeploy_deployment_group" "code_deployment_group" {
  depends_on = [
    aws_codedeploy_app.codedeploy_app,
    aws_instance.ec2_instance
  ]
  app_name              = aws_codedeploy_app.codedeploy_app.name
  deployment_group_name = "${var.ec2_tag_name}-${var.ec2_tag_env}"
  service_role_arn      = aws_iam_role.ec2_iam_role.arn

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  ec2_tag_set{
    ec2_tag_filter {
      key    = "Name"
      type   = "KEY_AND_VALUE"
      value  = var.ec2_tag_name
    }
  }

  ec2_tag_set{
    ec2_tag_filter {
      key    = "Environment"
      type   = "KEY_AND_VALUE"
      value  = var.ec2_tag_env
    }
  }
}

############################################################################

resource "aws_s3_bucket" "artifact_bucket" {
  bucket = var.artifact_location_s3
}

resource "aws_s3_bucket_ownership_controls" "artifact_bucket" {
  bucket = aws_s3_bucket.artifact_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "artifact_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.artifact_bucket]
  bucket = aws_s3_bucket.artifact_bucket.id
  acl    = "private"
}

resource "aws_codepipeline" "ci_cd_pipeline" {
  depends_on = [
    aws_s3_bucket_acl.artifact_bucket,
    aws_codedeploy_deployment_group.code_deployment_group
  ]

  name     = "${var.ec2_tag_name}-pipeline"
  role_arn = aws_iam_role.ec2_iam_role.arn

  artifact_store {
    type = "S3"
    location = aws_s3_bucket_acl.artifact_bucket.bucket
  }

  stage {
    name = "Source"

    action {
      name             = "GitHub_Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        "ConnectionArn": var.github_connection_arn,
        "FullRepositoryId": "${var.git_owner}/${var.git_repo}",
        "BranchName": var.git_branch,
        "OutputArtifactFormat": "CODE_ZIP"
        }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "EC2_Deploy_Action"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeploy"
      version          = "1"
      input_artifacts = ["SourceArtifact"]

      configuration = {
        ApplicationName  = aws_codedeploy_app.codedeploy_app.name
        DeploymentGroupName = aws_codedeploy_deployment_group.code_deployment_group.deployment_group_name
      }
    }
  }
}

############################################################################
