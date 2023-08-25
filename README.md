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
2. Create an IAM role and give full EC2 access and CodeDeploy access 
3. Launch an EC2 instance (make sure it allows ssh from your ip and general http/https access anywhere; also download the key pair)
4. From your local terminal, connect to ec2 instance using the command: `ssh -i "<location-to-keypairfile>/<filename>.pem" ec2-user@<public-ipv4-dns-of-ec2-instance>`

## Configure EC2 for hosting server:
1. Connect to ec2 and use commands `sudo yum update` and `sudo yum install httpd` to install httpd
2. Use `sudo service httpd start` to start httpd in your ec2
3. Use `sudo systemctl status httpd` to check httpd status (active and running) [Use CTRL+C to break out]
4. Go to your public-ipv4-dns address of your ec2 instance (use http, not https) to view a success message from httpd

## Git cloning and hosting basic site:
1. To install git, use `sudo yum install git`
2. Go to httpd location using `cd /var/www/html`
3. Git clone your project here [Note: AWS Linux might not allow git clone command via login or ssh; clone using tokens in that case (follow next section)]
4. Go to httpd config directory using: `cd /etc/httpd/conf.d/`
5. Create a config with same name as your git repo: `sudo nano <git-repo-name>.conf`
6. Paste the following code by modifying necessary parameters:
```<VirtualHost *:80>
    ServerName 10.123.15.21; # replace with your ec2 public ipv4 address
    DocumentRoot /var/www/html/your-repo # replace with your repo name

    <Directory /var/www/html/your-repo>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog /var/log/httpd/your-repo-error.log
    CustomLog /var/log/httpd/your-repo-access.log combined
</VirtualHost>```
7. write out the file using CTRL+O and exit using CTRL+X
8. Test config for syntax errors using `sudo apachectl configtest`
9. Reload the httpd server using `sudo systemctl reload httpd` and visit your ec2's public-ipv4-dns address to view the site
10. If you cannot see the images or the script, this is probably due to httpd serving our code which runs on npm server [although, as long as you see your site name in your browser tab, it means httpd is able to serve site from proper folder]

## Git clone using tokens
1. Go to GitHub -> Settings -> Developer Settings
2. Choose Personal Access Tokens -> Tokens (Classic)
3. Choose Generate New Token -> Generate New Token (Classic)
4. Choose your own note, expiration date but make sure to give full access to 'repo' (check all sub categories)
5. Generate token and copy/note the displayed token (Token will disappear if navigated outside and have to generate again in that case)
6. In your httpd location, use the command `sudo git clone https://<github-handle>:<your-generated-token>@github.com/<github-handle>/<github-repo-name>.git`


