pipeline {
    agent any

    environment {
        TESTING = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Backend Setup') {
            steps {
                echo 'Instalando dependencias de backend...'
                dir('backend') {
                    sh 'python3 -m venv venv'
                    sh '. venv/bin/activate && pip install --upgrade pip'
                    sh '. venv/bin/activate && pip install -r requirements.txt pytest httpx'
                    sh '. venv/bin/activate && pytest tests'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Ejecutando tests de backend...'
                dir('backend') {
                    sh '. venv/bin/activate && pytest tests'   
                }
            }
        }

        stage('Frontend Setup') {
            steps {
                echo 'Instalando dependencias de frontend...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Haciendo build de frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Frontend via Vercel Webhook') {
            steps {
                echo 'Desplegando frontend en Vercel mediante webhook...'
                sh '''
                curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_QCdQVaYVgP8w3lRuJj2heRHhvyT7/YbUnx27o4N
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado exitosamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
