# portfolio-app
VC house for the site: rajkumar.app

### Project Creation:
1. Install npm
2. Use the command `npm create vite@latest` to create the template
3. Enter Project Name, Choose Vanilla framework and javascript variant in the next options
4. Go into the project and use the command `npm install`
5. Install ThreeJS by using `npm install three`
6. Use `npm run dev` to initialize server and see a counter app by default
7. Use CTRL+C to terminate server

## AWS Setup - Prerequisites:
1. Create an AWS account
2. Create an IAM user and attach AdministratorAccess directly
3. Once the user is created, create an access key for that user to use AWS CLI and download the one-time CSV
[If you forget to download or save the key, perform same step again to get a new key association]
4. Run the command `aws configure` and supply it with necessary details for the AWS account
[Access key ID (from csv), Secret key (from csv), region (us-east-2), output format(json)]
5. Go to 'https://console.aws.amazon.com/codesuite/settings/connections', create a connection for GitHub and follow through process for new application 
[Login to your GitHub, choose just the repo and make sure proper access is given in GitHub.
Once get the ARN value for this connection and replace this value in tfvars variable: github_connection_arn]

## Terraform Setup - Prerequisites (Windows):
1. Download Terraform, preferably v1.5 or better
2. Set the path to the download location of the exe file in system/environment variables
3. Go to scripts/aws and make necessary adjustments in tfvars file to match the needs
4. From scripts/aws, initialize terraform using `terraform init`
[Use `terraform init -upgrade` in case of any changes next time]
5. From same location, check resource creations / validations using `terraform plan -var-file varfile.tfvars`

## Terraform - Create/Delete Resources (Windows):
1. From scripts/aws, create all resources using `terraform apply -var-file varfile.tfvars`
2. Once finished, go to AWS console and verify all resources
3. Verify if key files (.pem and .pub) are present in specified path
4. From any local terminal, check connection to ec2 instance using the command: `ssh -i "<location-to-keypairfile>/<filename>.pem" ec2-user@<public-ipv4-dns-of-ec2-instance>`
5. Go to the public ip address (only http, not https) to check the website rendered
6. To destroy all resources, use `terraform destroy -var-file varfile.tfvars`
