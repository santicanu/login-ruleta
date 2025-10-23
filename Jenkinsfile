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
            when { expression { BRANCH_NAME != 'main' } }
            steps {
                script {
                    echo "Intentando mergear rama ${BRANCH_NAME} a main..."
                    env.TOKEN = "${GITHUB_TOKEN}"

                    // 1️⃣ Buscar PR abierto
                    def prList = sh(
                        script: """
                            curl -s -H "Authorization: token \$TOKEN" \
                                -H "Accept: application/vnd.github+json" \
                                "https://api.github.com/repos/${GITHUB_REPO}/pulls?head=santicanu:${BRANCH_NAME}&base=main"
                        """,
                        returnStdout: true
                    ).trim()

                    def prNumber = sh(
                        script: "echo '${prList}' | grep -m1 '\"number\"' | sed 's/[^0-9]*\\([0-9]*\\).*/\\1/'",
                        returnStdout: true
                    ).trim()

                    // 2️⃣ Si no existe, crear PR
                    if (!prNumber) {
                        echo "⚠️ No se encontró PR abierto. Creando uno..."
                        def createPR = sh(
                            script: """
                                curl -s -X POST -H "Authorization: token \$TOKEN" \
                                    -H "Accept: application/vnd.github+json" \
                                    -d '{ "title": "Auto Merge ${BRANCH_NAME}", "head": "${BRANCH_NAME}", "base": "main" }' \
                                    "https://api.github.com/repos/${GITHUB_REPO}/pulls"
                            """,
                            returnStdout: true
                        ).trim()

                        // Extraer número del PR recién creado
                        prNumber = sh(
                            script: "echo '${createPR}' | grep -m1 '\"number\"' | sed 's/[^0-9]*\\([0-9]*\\).*/\\1/'",
                            returnStdout: true
                        ).trim()
                        echo "Pull Request #${prNumber} creado."
                    }

                    // 3️⃣ Mergear PR
                    if (prNumber) {
                        echo "Haciendo merge del PR #${prNumber}..."
                        def mergeResponse = sh(
                            script: """
                                curl -s -X PUT -H "Authorization: token \$TOKEN" \
                                    -H "Accept: application/vnd.github+json" \
                                    -d '{"commit_title":"Auto merge ${BRANCH_NAME} -> main","merge_method":"merge"}' \
                                    "https://api.github.com/repos/${GITHUB_REPO}/pulls/${prNumber}/merge"
                            """,
                            returnStdout: true
                        ).trim()
                        echo "Resultado del merge: ${mergeResponse}"
                    } else {
                        echo "❌ No se pudo crear ni mergear PR."
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
