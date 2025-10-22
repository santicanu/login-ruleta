pipeline {
    agent any

    environment {
        TESTING = '1'
        GITHUB_TOKEN = credentials('github-token') // 🔑 Token con permisos de repo
        GITHUB_REPO = 'santicanu/login-ruleta'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Clonando repositorio...'
                checkout scm
                script {
                    BRANCH_NAME = env.BRANCH_NAME ?: sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()
                    echo "🪣 Rama actual: ${BRANCH_NAME}"
                }
            }
        }

        stage('Backend Setup & Tests') {
            steps {
                echo '🧪 Ejecutando tests del backend...'
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate && pip install --upgrade pip
                        . venv/bin/activate && pip install -r requirements.txt pytest httpx
                        . venv/bin/activate && pytest tests
                    '''
                }
            }
        }

        stage('Frontend Setup & Build') {
            steps {
                echo '⚙️ Construyendo frontend...'
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Prepare Vercel Prebuilt') {
            when { branch 'main' }
            steps {
                echo '📦 Preparando build para Vercel...'
                dir('frontend') {
                    sh '''
                        mkdir -p .vercel/output/static
                        cp -r dist/* .vercel/output/static/
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
            when { expression { return BRANCH_NAME != 'main' } }
            steps {
                echo "🔀 Mergeando rama ${BRANCH_NAME} a main..."
                script {
                    // Crear Pull Request
                    def prResponse = sh(
                        script: """
                        curl -s -X POST \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github+json" \
                        https://api.github.com/repos/${GITHUB_REPO}/pulls \
                        -d '{"title":"Auto Merge ${BRANCH_NAME}","head":"${BRANCH_NAME}","base":"main"}'
                        """,
                        returnStdout: true
                    ).trim()

                    def prNumber = sh(
                        script: "echo '${prResponse}' | grep -o '\"number\":[0-9]*' | cut -d ':' -f2 | head -1",
                        returnStdout: true
                    ).trim()

                    if (prNumber) {
                        echo "✅ Pull Request creado #${prNumber}, mergeando..."
                        sh """
                        curl -s -X PUT \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github+json" \
                        https://api.github.com/repos/${GITHUB_REPO}/pulls/${prNumber}/merge \
                        -d '{"commit_title":"Auto merge ${BRANCH_NAME} -> main","merge_method":"merge"}'
                        """
                        
                    } else {
                        echo "⚠️ No se pudo crear el Pull Request automáticamente."
                    }
                }
            }
        }

        stage('Deploy Frontend via Vercel Webhook') {
            when { branch 'main' }
            steps {
                echo '🚀 Desplegando en Vercel...'
                sh '''
                curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_QCdQVaYVgP8w3lRuJj2heRHhvyT7/YbUnx27o4N
                '''
            }
        }
    }

    post {
        success { echo '✅ Pipeline completado exitosamente.' }
        failure { echo '❌ Pipeline falló.' }
    }
}
