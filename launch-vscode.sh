#!/bin/bash

# Cargar nvm
source ~/.nvm/nvm.sh

# Usar Node.js 22
nvm use 22

# Mostrar versión que se va a usar
echo "Lanzando VS Code con Node.js $(node --version)"

# Configurar variables de entorno
export NODE_PATH="/home/hp/.nvm/versions/node/v22.20.0/bin/node"
export PATH="/home/hp/.nvm/versions/node/v22.20.0/bin:$PATH"

# Lanzar VS Code con el proyecto actual
code /home/hp/Documents/forestech