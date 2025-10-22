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

        stage('Frontend Setup & Build') {
            steps {
                echo 'Instalando dependencias y construyendo frontend...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Prepare Vercel Prebuilt') {
            steps {
                echo 'Preparando build para deploy prebuilt en Vercel...'
                dir('frontend') {
                    // Crear directorio .vercel/output si no existe
                    sh 'mkdir -p .vercel/output/static'
                    // Copiar los archivos de dist al directorio que Vercel espera
                    sh 'cp -r dist/* .vercel/output/static/'
                    // Crear un archivo de configuración que Vercel requiere
                    sh '''
                    cat > .vercel/output/config.json <<EOF
                    {
                        "version": 3,
                        "builds": [],
                        "routes": [
                            { "handle": "filesystem" },
                            { "src": "/.*", "dest": "/index.html" }
                        ]
                    }
                    EOF
                    '''
                }
            }
        }

        stage('Deploy Frontend via Vercel Webhook') {
            steps {
                echo 'Desplegando frontend prebuilt en Vercel mediante webhook...'
                dir('frontend') {
                    sh '''
                    curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_QCdQVaYVgP8w3lRuJj2heRHhvyT7/YbUnx27o4N
                    '''
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
