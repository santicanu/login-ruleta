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
                    sh 'python -m pip install --upgrade pip'
                    sh 'python -m pip install -r requirements.txt'
                    sh 'python -m pip install pytest httpx'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Ejecutando tests de backend...'
                dir('backend') {
                    sh 'pytest tests'
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
