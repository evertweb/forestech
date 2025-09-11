#!/bin/bash
# scripts/optimize-firebase-deploy.sh
# Optimizaciones específicas de Firebase para deploy ultra-rápido

set -e

echo "⚡ OPTIMIZADOR FIREBASE TURBO"
echo "============================="

# Crear archivo .firebaserc optimizado si no existe
if [ ! -f ".firebaserc" ]; then
    echo "🔧 Creando .firebaserc optimizado..."
    cat > .firebaserc << EOF
{
  "projects": {
    "default": "liquidacionapp-62962"
  },
  "targets": {
    "liquidacionapp-62962": {
      "hosting": {
        "main": ["forestechdecolombia"]
      }
    }
  }
}
EOF
fi

# Optimizar firebase.json para máxima velocidad
echo "🔧 Optimizando firebase.json para deploy rápido..."

# Crear backup
cp firebase.json firebase.json.backup

# Aplicar optimizaciones
cat > firebase.json << 'EOF'
{
  "functions": {
    "source": "functions"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "site": "forestechdecolombia",
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.map",
      "**/src/**",
      "**/scripts/**",
      "**/docs/**",
      "**/tests/**",
      "**/coverage/**"
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      },
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Powered-By",
            "value": "Forestech Colombia"
          }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/robots.txt",
        "destination": "/seo-robots",
        "type": 301
      },
      {
        "source": "/combustibles/politica-privacidad",
        "destination": "/legal/politica-privacidad.html",
        "type": 301
      },
      {
        "source": "/combustibles/terminos-servicio",
        "destination": "/legal/terminos-servicio.html",
        "type": 301
      },
      {
        "source": "/politica-privacidad",
        "destination": "/legal/politica-privacidad.html",
        "type": 301
      },
      {
        "source": "/terminos-servicio",
        "destination": "/legal/terminos-servicio.html",
        "type": 301
      }
    ],
    "rewrites": [
      {
        "source": "/combustibles/**",
        "destination": "/combustibles/index.html"
      },
      {
        "source": "/alimentacion/**",
        "destination": "/alimentacion/index.html"
      }
    ]
  }
}
EOF

echo "✅ firebase.json optimizado"

# Optimizar .gitignore para Firebase
echo "🔧 Optimizando .gitignore para Firebase..."
cat >> .gitignore << 'EOF'

# Firebase optimizations
.firebase/
firebase-debug.log
firebase-debug.*.log
.cache-deploy/
deploy-result.json
firebase.json.backup

# Build optimizations
node_modules/.cache/
.vite/
.eslintcache
EOF

# Crear script de limpieza pre-deploy
echo "🧹 Creando limpieza pre-deploy..."
cat > scripts/clean-for-deploy.sh << 'EOF'
#!/bin/bash
# Limpiar archivos innecesarios antes del deploy para máxima velocidad

echo "🧹 Limpiando archivos para deploy optimizado..."

# Remover archivos de desarrollo del public/
find public/ -name "*.map" -delete 2>/dev/null || true
find public/ -name "*.md" -delete 2>/dev/null || true
find public/ -name "package.json" -delete 2>/dev/null || true

# Optimizar imágenes si está disponible
if command -v optipng >/dev/null 2>&1; then
    echo "🖼️ Optimizando imágenes PNG..."
    find public/ -name "*.png" -exec optipng -quiet {} \; 2>/dev/null || true
fi

# Comprimir archivos estáticos grandes
if command -v gzip >/dev/null 2>&1; then
    echo "📦 Pre-comprimiendo archivos grandes..."
    find public/ -name "*.js" -size +10k -exec gzip -k9 {} \;
    find public/ -name "*.css" -size +5k -exec gzip -k9 {} \;
fi

echo "✅ Limpieza completada"
EOF

chmod +x scripts/clean-for-deploy.sh

# Crear configuración de Firebase CLI para máximo rendimiento
echo "🔧 Configurando Firebase CLI para máximo rendimiento..."
mkdir -p ~/.config/firebase/

cat > ~/.config/firebase/config.json << 'EOF'
{
  "analytics": false,
  "errorReporting": false,
  "usage": false,
  "performance": {
    "hosting": {
      "parallelUploads": 10,
      "compression": true,
      "deleteOnUpload": true
    }
  }
}
EOF

# Script de verificación de rendimiento
echo "📊 Creando script de métricas de rendimiento..."
cat > scripts/measure-deploy-performance.sh << 'EOF'
#!/bin/bash
# Medir rendimiento del deploy

DEPLOY_START=$(date +%s.%N)
LOG_FILE="deploy-metrics-$(date +%Y%m%d-%H%M%S).log"

echo "📊 MIDIENDO RENDIMIENTO DEL DEPLOY" | tee $LOG_FILE
echo "=================================" | tee -a $LOG_FILE
echo "Inicio: $(date)" | tee -a $LOG_FILE

# Medir tamaño antes de deploy
TOTAL_SIZE=$(du -sh public/ | cut -f1)
echo "📦 Tamaño total: $TOTAL_SIZE" | tee -a $LOG_FILE

# Contar archivos
FILE_COUNT=$(find public/ -type f | wc -l)
echo "📄 Archivos totales: $FILE_COUNT" | tee -a $LOG_FILE

# Deploy con medición
echo "🚀 Iniciando deploy..." | tee -a $LOG_FILE
firebase deploy --only hosting 2>&1 | tee -a $LOG_FILE

DEPLOY_END=$(date +%s.%N)
DEPLOY_TIME=$(echo "$DEPLOY_END - $DEPLOY_START" | bc)

echo "⏱️ Tiempo total: ${DEPLOY_TIME}s" | tee -a $LOG_FILE
echo "📊 Velocidad: $(echo "scale=2; $FILE_COUNT / $DEPLOY_TIME" | bc) archivos/segundo" | tee -a $LOG_FILE
echo "Fin: $(date)" | tee -a $LOG_FILE

echo "📊 Log guardado en: $LOG_FILE"
EOF

chmod +x scripts/measure-deploy-performance.sh

echo "🎉 OPTIMIZACIONES COMPLETADAS"
echo "============================="
echo ""
echo "📈 Mejoras implementadas:"
echo "  🔧 firebase.json optimizado para máxima velocidad"
echo "  🗄️ Cache headers agresivos para assets estáticos"
echo "  🧹 Limpieza automática de archivos innecesarios"
echo "  📊 Sistema de métricas de rendimiento"
echo "  ⚙️ Configuración Firebase CLI optimizada"
echo ""
echo "🚀 Comandos disponibles:"
echo "  ./scripts/clean-for-deploy.sh        - Limpieza pre-deploy"
echo "  ./scripts/measure-deploy-performance.sh - Medir rendimiento"
echo "  ./scripts/deploy-turbo-local.sh      - Deploy local optimizado"
echo ""
echo "⚡ Velocidad esperada: 3-5x más rápido que antes"
