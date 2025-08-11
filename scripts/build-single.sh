#!/bin/bash
# scripts/build-single.sh
# Build y deploy de una sola app para desarrollo rápido

APP=$1

if [ -z "$APP" ]; then
    echo "❌ Uso: ./scripts/build-single.sh [combustibles|alimentacion]"
    echo "📝 Ejemplos:"
    echo "   ./scripts/build-single.sh combustibles"
    echo "   ./scripts/build-single.sh alimentacion"
    exit 1
fi

if [ "$APP" != "combustibles" ] && [ "$APP" != "alimentacion" ]; then
    echo "❌ App debe ser 'combustibles' o 'alimentacion'"
    exit 1
fi

echo "🔨 Construyendo solo la app: $APP"

# Build de la app específica
start_time=$(date +%s)

npm run build:$APP

end_time=$(date +%s)
duration=$((end_time - start_time))

echo "✅ Build de $APP completado en ${duration}s"

# Opcional: deploy solo de hosting para esa app
read -p "¿Quieres deployar solo la app $APP? (y/N): " deploy_choice

if [ "$deploy_choice" = "y" ] || [ "$deploy_choice" = "Y" ]; then
    echo "🚀 Deployando solo hosting..."
    firebase deploy --only hosting
    echo "✅ Deploy de $APP completado"
else
    echo "📋 Build listo. Para deployar manualmente: firebase deploy --only hosting"
fi
