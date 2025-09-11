#!/bin/bash
# scripts/measure-deploy-performance.sh
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
DEPLOY_TIME=$(echo "$DEPLOY_END - $DEPLOY_START" | bc -l 2>/dev/null || echo "N/A")

echo "⏱️ Tiempo total: ${DEPLOY_TIME}s" | tee -a $LOG_FILE
if [ "$DEPLOY_TIME" != "N/A" ]; then
    echo "📊 Velocidad: $(echo "scale=2; $FILE_COUNT / $DEPLOY_TIME" | bc -l) archivos/segundo" | tee -a $LOG_FILE
fi
echo "Fin: $(date)" | tee -a $LOG_FILE

echo "📊 Log guardado en: $LOG_FILE"
