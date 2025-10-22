FROM jenkins/jenkins:lts

USER root

# Instalar Python, pip, venv, Node y npm
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    nodejs \
    npm \
 && rm -rf /var/lib/apt/lists/*

USER jenkins