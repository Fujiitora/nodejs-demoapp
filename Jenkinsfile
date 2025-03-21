pipeline {
    agent any

    environment {
        NODE_VERSION = "20"
        GITHUB_USER = "Fujiitora"
        SSH_USER = "root"
        SSH_HOST = "10.30.30.17"
        SSH_CREDENTIALS = "4c3bc3ca-9a02-4ac1-8058-325dd39e8b4b"
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
                sh 'npm install'
            }
        }

        stage('Deploy to Server') {
            when {
                branch 'main'
            }
            steps {
                sshagent([env.SSH_CREDENTIALS]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST <<EOF
                    mkdir -p /var/www/app  # Creates only if it doesn't exist
                    cd /var/www/app
                    if [ -d .git ]; then
                        git pull origin main
                    else
                        git clone https://github.com/'"${GITHUB_USER}"'/nodejs-demoapp.git .
                    fi
                    npm install
                    pm2 restart app
                    EOF
                    '''
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
