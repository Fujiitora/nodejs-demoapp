pipeline {
    agent any

    environment {
        NODE_VERSION = "20"
        GITHUB_USER = "Fujiitora"
        SSH_USER = "root"
        SSH_HOST = "10.30.30.17"
        SSH_CREDENTIALS = "4c3bc3ca-9a02-4ac1-8058-325dd39e8b4b"
        JOB_NAME = "demo-app_cicd"
        LINUX_SERVICE = """
            [Unit]
            Description=Node.js Demo App
            After=network.target
            
            [Service]
            WorkingDirectory=/var/www/app/src
            ExecStart=/usr/bin/node --expose_gc server.mjs
            Restart=always
            User=root
            Environment=NODE_ENV=production
            StandardOutput=append:/var/www/app/app.log
            StandardError=append:/var/www/app/app-error.log
            
            [Install]
            WantedBy=multi-user.target
            SERVICE"""
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "https://github.com/${env.GITHUB_USER}/nodejs-demoapp.git"
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: "NodeJS ${env.NODE_VERSION}", type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('src') {
                    sh 'npm install'
                }
            }
        }
        stage('Deploy to Server') {
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST <<'EOF'
                    set -e
                
                    # Install Git if needed
                    if ! command -v git &> /dev/null; then
                        apt update && apt install -y git
                    fi
                
                    # Install Node.js if needed
                    if ! command -v npm &> /dev/null; then
                        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                        apt install -y nodejs
                    fi
                
                    # Install PM2 if needed
                    if ! command -v pm2 &> /dev/null; then
                        npm install -g pm2
                    fi
                
                    mkdir -p /var/www/app
                    cd /var/www/app
                
                    if [ -d .git ]; then
                        git pull origin main
                    else
                        git clone https://github.com/${env.GITHUB_USER}/nodejs-demoapp.git .
                    fi
                           
                    # --- create systemd service ---
                    cat << '${env.LINUX_SERVICE}' > /etc/systemd/system/nodejs-demoapp.service
                    
                    systemctl daemon-reload
                    systemctl enable nodejs-demoapp
                    systemctl restart nodejs-demoapp

                    echo "✅ App deployed and running as a systemd service"
                    """
                }
            }
        }
    }

    post {
        success {
            mail to: 's_wolff22@stud.hwr-berlin.de',
                 subject: "Jenkins Build Success: ${env.JOB_NAME}",
                 body: "The build was successful!"
        }
        failure {
            mail to: 's_wolff22@stud.hwr-berlin.de',
                 subject: "Jenkins Build Failed: ${env.JOB_NAME}",
                 body: "The build failed. Please check the logs."
        }
    }
}
