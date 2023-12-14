# variables.tfvars

aws_region = "us-west-1"
ec2_iam_role_name = "my-iam-role"
ec2_security_group_name = "my-security-group"
ec2_allowed_ip_http = ["0.0.0.0/0"]
ec2_allowed_ip_https = ["0.0.0.0/0"]
ec2_allowed_ip_ssh = ["x.x.x.x/32"]
ec2_outbound_ip_all_port = ["0.0.0.0/0"]
ec2_ssh_key_pair_name = "my-key-pair"
ec2_ssh_key_path = "../.ssh-keys"
ec2_ami_id = "ami-xxxxxxxxxxxxxxxxx"
ec2_instance_type = "t2.micro"
ec2_instance_storage_gb = 30
ec2_tag_name = "my-instance"
ec2_tag_env = "dev"
ec2_script_codedeploy_agent = "../install-codedeploy-agent.sh"
git_owner = "gitowner"
git_repo = "gitrepo"
git_branch = "main"
github_connection_arn = "arn:aws:codestar-connections:<region>:<accid>:connection/<connid>"
artifact_location_s3 = "aartifact-temp-loc"