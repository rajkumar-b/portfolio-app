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

Once done, get the ARN value for this connection and replace this value in tfvars variable: github_connection_arn]

## Terraform Setup - Prerequisites (Windows):
1. Download Terraform, preferably v1.5 or better
2. Set the path to the download location of the exe file in system/environment variables
3. Go to scripts/aws and make necessary adjustments in tfvars file to match the needs

[Also adjust codedeploy agent install script with proper region and start server script with proper site/cert details]
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
7. To plan, apply or destroy only a particular resource, use the flag `terraform <command> -target=<res-type>.<res-name> -var-file varfile.tfvars`

## SSL - Prerequisites (Google Domain):
1. Once all resources are created, login to ec2 instance using the command: `ssh -i "<location-to-keypairfile>/<filename>.pem" ec2-user@<public-ipv4-dns-of-ec2-instance>`
2. Simultaneously, go to https://domains.google.com/registrar/<your-site>/security and then onto "SSL/TLS certificates for your domain" -> "Google Trust Services" -> "Get EAB Key" to get both EAB & HMAC keys.
3. Fill in the values in below command and run it on the terminal from Step 1: `sudo certbot register --email <registered-email-for-site> --no-eff-email --server "https://dv.acme-v02.api.pki.goog/directory"  --eab-kid "<eab-id>" --eab-hmac-key "<hmac>"`. Type 'Y' to accept terms and register the account. 

[Note: Generated keys are one-time use and expires in 7 days]
4. Link your public IP v4 address of ec2 instance to the DNS of your site: https://domains.google.com/registrar/<your-site>/dns

[Fill in hostname(sitename), Type(A), TTL(5mins), Data(IPv4 address)]
5. In your ec2 intance, use `sudo killall http-server` to kill any existing connections.
6. Generate the initial certificate using command: `sudo certbot certonly -d <your-site> --server "https://dv.acme-v02.api.pki.goog/directory" --standalone`

[Generated certificate is valid for 3 months. It is usually a good process to renew certificate (Use command: `sudo certbot renew -q`) within that duration using a cron job to avoid generating certificates again]
7. Either do a dummy commit to trigger CI/CD, or use the CodePipeline from AWS console to release change.