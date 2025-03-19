pipeline {
    agent any

    environment {
        NODE_VERSION = "18"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/YOUR_USERNAME/nodejs-demoapp.git'
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS 18', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            when {
                branch 'main'
            }
            steps {
                sshagent(['server-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST <<EOF
                    cd /var/www/app
                    git pull origin main
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
