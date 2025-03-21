pipeline {
    agent any

    environment {
        NODE_VERSION = "20"
        GITHUB_USER = "Fujiitora"
        SSH_USER = "root"
        SSH_HOST = "10.30.30.17"
        SSH_CREDENTIALS = "4c3bc3ca-9a02-4ac1-8058-325dd39e8b4b"
        JOB_NAME = "demo-app_cicd"
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
                
                    cd src
                    # Start app in background

                    # Kill any process using port 3000
                    PID=\$(lsof -t -i:3000)
                    if [ -n "\$PID" ]; then
                      echo "Killing process on port 3000 (PID: \$PID)"
                      kill -9 \$PID
                    fi

                    echo "🚀 Starting app in background..."
                    nohup npm start > /var/www/app/app.log 2>&1 &
                    
                    echo "✅ App is running. Logs: /var/www/app/app.log"               
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
