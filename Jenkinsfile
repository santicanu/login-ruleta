pipeline {
    agent any

    environment {
        TESTING = '1'
        GITHUB_TOKEN = credentials('githubcicd') // 🔑 Token personal con permisos de repo
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
                script {
                    BRANCH_NAME = env.BRANCH_NAME ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    echo "Branch actual: ${BRANCH_NAME}"
                }
            }
        }

        stage('Backend Setup & Tests') {
            steps {
                echo 'Instalando dependencias y ejecutando tests del backend...'
                dir('backend') {
                    sh 'python3 -m venv venv'
                    sh '. venv/bin/activate && pip install --upgrade pip'
                    sh '. venv/bin/activate && pip install -r requirements.txt pytest httpx'
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
            when {
                branch 'main'
            }
            steps {
                echo 'Preparando build para deploy prebuilt en Vercel...'
                dir('frontend') {
                    sh 'mkdir -p .vercel/output/static'
                    sh 'cp -r dist/* .vercel/output/static/'
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

        stage('Merge to Main if Tests Passed') {
            when {
                expression { return BRANCH_NAME != 'main' }
            }
            steps {
                echo "Mergeando rama ${BRANCH_NAME} a main..."
                script {
                    // Crea un Pull Request y lo mergea automáticamente
                    def prResponse = sh(
                        script: """
                        curl -s -X POST -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github+json" \
                        https://api.github.com/repos/santicanu/login-ruleta/pulls \
                        -d '{"title":"Auto Merge ${BRANCH_NAME}","head":"${BRANCH_NAME}","base":"main"}'
                        """,
                        returnStdout: true
                    ).trim()
                    
                    def prNumber = sh(
                        script: "echo '${prResponse}' | grep -o '\"number\":[0-9]*' | head -1 | cut -d ':' -f2",
                        returnStdout: true
                    ).trim()

                    if (prNumber) {
                        echo "Pull Request creado #${prNumber}, intentando merge..."
                        sh """
                        curl -s -X PUT -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github+json" \
                        https://api.github.com/repos/santicanu/login-ruleta/pulls/${prNumber}/merge \
                        -d '{"commit_title":"Auto merge ${BRANCH_NAME} -> main","merge_method":"merge"}'
                        """
                    } else {
                        echo "⚠️ No se pudo crear el Pull Request automáticamente."
                    }
                }
            }
        }

        stage('Deploy Frontend via Vercel Webhook') {
            when {
                branch 'main'
            }
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
