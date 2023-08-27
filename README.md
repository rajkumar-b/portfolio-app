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

## EC2 instance creation:
1. Create an AWS account
2. Create an IAM role and give full EC2 access 
3. Launch an EC2 instance (make sure it allows ssh from your ip and general http/https access anywhere; also download the key pair)
4. Attach your IAM role to the EC2 instance
5. From your local terminal, connect to ec2 instance using the command: `ssh -i "<location-to-keypairfile>/<filename>.pem" ec2-user@<public-ipv4-dns-of-ec2-instance>`

## Configure EC2 for hosting server:
1. Connect to ec2 and use commands `sudo yum update` and `sudo yum install httpd` to install httpd
2. Use `sudo service httpd start` to start httpd in your ec2
3. Use `sudo systemctl status httpd` to check httpd status (active and running) [Use CTRL+C to break out]
4. Go to your public-ipv4-dns address of your ec2 instance (use http, not https) to view a success message from httpd
5. Use `sudo systemctl stop httpd` to stop the httpd server

## Git cloning and hosting basic site:
1. To install git, use `sudo yum install git`
2. To install node, use `sudo yum install nodejs npm`
3. Go to server location using `cd /var/www/html`
4. Git clone your project here [Note: AWS Linux might not allow git clone command via login or ssh; clone using tokens in that case (follow next section)]
5. Go to your project and use `npm install` to install the project packages
6. To install ThreeJS, use `npm install three`
7. To install vite and npm's http-server, execute the below set of commands:
```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g vite@latest
npm install -g http-server
```
8. To build your project, use `npm run build`
9. To host the build on http port, use `~/.npm-global/bin/http-server dist -p 80` and visit the ec2 instance's public ip
10. Use CTRL+C to exit the server (Note: port 80 is http only, not https; modify if necessary when visiting the ip)


## Git clone using tokens
1. Go to GitHub -> Settings -> Developer Settings
2. Choose Personal Access Tokens -> Tokens (Classic)
3. Choose Generate New Token -> Generate New Token (Classic)
4. Choose your own note, expiration date but make sure to give full access to 'repo' (check all sub categories)
5. Generate token and copy/note the displayed token (Token will disappear if navigated outside and have to generate again in that case)
6. In your destination, use the command `sudo git clone https://<github-handle>:<your-generated-token>@github.com/<github-handle>/<github-repo-name>.git`

## Using CodeDeploy to get data from git and directly host in the ec2 instance
1. Go to CodeDeploy service in your AWS Management console
2. Go to applications tab and create an application with appropriate name and 'EC2' as the compute platform
3. Go to the IAM role that was already created for EC2 and add the following permissions:
    -   S3 ReadOnly Access
    -   CodeDeploy Role
    -   CodeDeploy Full Access
    -   EC2Role for AWS CodeDeploy
4. Edit the trust policy to add a principal for AWS service - 'codedeploy'
5. Go to your ec2 instance, and add a tag with a custom key-value pair (edit it if already present)
6. Go to the recently created codedeploy application and create a new deployment group (eg. project name suffixed with dev, prod, etc)
7. Attach the same IAM role to it and under the environment, choose EC2 and use the same key-value pair tag
8. Disable the load balancer and create your deployment group
9. Make sure your appspec.yml file contains appropriate deployment scripts for codedeploy's stages
10. Go to your deployment group and create a deployment
11. Choose github for revision type and choose proper github token (Create and connect to your github if doing for the first time)
12. Enter the repo name in the form `<github-handle>/<github-repo-name>` and copy-paste the corresponding commit id from your branch
13. Once you create the deployment, wait for it to finish and access your ec2 instance's public ip to verify server behaviour

## Automating code deployment (CI/CD) using CodePipeline
1. Go to CodePipeline in your AWS management console and Create Pipeline from Pipelines tab
2. Create a new IAM role for this pipeline and give appropriate names to both pipeline and role
3. Choose Github Version 2 as the source provider and Use the existing github connection (if visible, else connect and create a new one)
4. Choose the repo name and the branch name (a drop down should appear on proper github connection for both options)
5. Make sure the pipeline starts on code change (check mark should be active)
6. Configure build if required (This project uses post deployment script, hence skipped)
7. Choose AWS CodeDeploy as the deploy provider and choose the application name and deployment group that were created earlier
8. Review changes and create pipeline. An initial build should successfully deploy the site and this build can be seen in the codedeploy
