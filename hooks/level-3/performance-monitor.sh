#!/bin/bash
# HOOK NIVEL 3: Performance Monitor - Sistema de monitoreo automático
# Avanzado: Monitoreo de rendimiento y salud del sistema Forestech

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/hp/Documents/forestech"

# Variables del hook
OPERATION_TYPE="${OPERATION_TYPE:-general}"
OPERATION_DURATION="${OPERATION_DURATION:-0}"

# Log de inicio
echo "[$TIMESTAMP] Performance Monitor - Operation: $OPERATION_TYPE" >> "$PROJECT_DIR/logs/performance.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Crear directorio de métricas si no existe
mkdir -p logs/metrics

# Función para obtener métricas del sistema
get_system_metrics() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    local mem_usage=$(free -m | awk 'NR==2{printf "%.1f", $3*100/$2}')
    local disk_usage=$(df "$PROJECT_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
    
    echo "CPU: ${cpu_usage}%, Memory: ${mem_usage}%, Disk: ${disk_usage}%"
}

# Función para verificar procesos de desarrollo
check_dev_processes() {
    local processes=()
    
    if pgrep -f "npm run dev" > /dev/null; then
        processes+=("dev-server")
    fi
    
    if pgrep -f "firebase emulators" > /dev/null; then
        processes+=("firebase-emulator")
    fi
    
    if pgrep -f "vite" > /dev/null; then
        processes+=("vite")
    fi
    
    echo "${processes[*]}"
}

# Función para analizar tamaño de archivos críticos
analyze_file_sizes() {
    local large_files=()
    
    # Verificar archivos JS/JSX grandes (>100KB)
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && $(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null) -gt 102400 ]]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            large_files+=("$(basename "$file"):${size}B")
        fi
    done < <(find . -name "*.js" -o -name "*.jsx" -print0 2>/dev/null)
    
    if [ ${#large_files[@]} -gt 0 ]; then
        echo "Large files: ${large_files[*]}"
    else
        echo "No large files detected"
    fi
}

# Función para verificar estado de Firebase
check_firebase_health() {
    if command -v firebase &> /dev/null; then
        if firebase projects:list --format=json &>/dev/null; then
            # Verificar proyecto específico
            if firebase projects:list --format=json | grep -q "liquidacionapp-62962"; then
                echo "Firebase: Connected (liquidacionapp-62962)"
            else
                echo "Firebase: Connected (different project)"
            fi
        else
            echo "Firebase: Authentication required"
        fi
    else
        echo "Firebase: CLI not available"
    fi
}

# Obtener métricas actuales
echo "[$TIMESTAMP] Collecting system metrics..." >> logs/performance.log
SYSTEM_METRICS=$(get_system_metrics)
DEV_PROCESSES=$(check_dev_processes)
FILE_ANALYSIS=$(analyze_file_sizes)
FIREBASE_STATUS=$(check_firebase_health)

# Crear entrada de métricas
METRICS_ENTRY="{
  \"timestamp\": \"$TIMESTAMP\",
  \"operation\": \"$OPERATION_TYPE\",
  \"duration\": $OPERATION_DURATION,
  \"system\": \"$SYSTEM_METRICS\",
  \"processes\": \"$DEV_PROCESSES\",
  \"files\": \"$FILE_ANALYSIS\",
  \"firebase\": \"$FIREBASE_STATUS\"
}"

# Guardar métricas
echo "$METRICS_ENTRY" >> logs/metrics/performance-$(date +%Y%m%d).json

# Análisis de rendimiento
echo "[$TIMESTAMP] Performance analysis:" >> logs/performance.log

# Alertas por uso de recursos
if [[ "$SYSTEM_METRICS" == *"CPU:"* ]]; then
    CPU_VAL=$(echo "$SYSTEM_METRICS" | grep -o 'CPU: [0-9]*' | grep -o '[0-9]*')
    if [ "$CPU_VAL" -gt 80 ]; then
        echo "[$TIMESTAMP] ⚠️ High CPU usage: $CPU_VAL%" >> logs/performance.log
        echo "⚠️ High CPU usage detected: $CPU_VAL%"
    fi
fi

# Alertas por archivos grandes
if [[ "$FILE_ANALYSIS" == "Large files:"* ]]; then
    echo "[$TIMESTAMP] ⚠️ Large files detected: $FILE_ANALYSIS" >> logs/performance.log
    echo "⚠️ Large files detected - consider code splitting"
fi

# Recomendaciones específicas por contexto
if [[ "$PWD" == *"combustibles"* ]]; then
    echo "[$TIMESTAMP] 🔍 Combustibles context - checking vehicle categories..." >> logs/performance.log
    
    if [ -f "src/data/vehicleCategories.js" ]; then
        CATEGORIES_SIZE=$(wc -l < src/data/vehicleCategories.js)
        if [ "$CATEGORIES_SIZE" -gt 500 ]; then
            echo "[$TIMESTAMP] ⚠️ Large vehicleCategories.js: $CATEGORIES_SIZE lines" >> logs/performance.log
            echo "⚠️ Large vehicleCategories.js - consider data optimization"
        fi
    fi
    
elif [[ "$PWD" == *"alimentacion"* ]]; then
    echo "[$TIMESTAMP] 🍽️ Alimentación context - checking liquidations..." >> logs/performance.log
    
    # Verificar tamaño de logs de liquidaciones
    if [ -d "logs" ]; then
        LOGS_SIZE=$(du -sh logs 2>/dev/null | cut -f1)
        echo "[$TIMESTAMP] 📊 Logs directory size: $LOGS_SIZE" >> logs/performance.log
    fi
fi

# Recomendaciones de optimización
RECOMMENDATIONS=()

if [[ "$DEV_PROCESSES" == "" ]]; then
    RECOMMENDATIONS+=("Consider starting development server for better performance")
fi

if [[ "$FIREBASE_STATUS" == *"Authentication required"* ]]; then
    RECOMMENDATIONS+=("Firebase authentication required for full functionality")
fi

if [ ${#RECOMMENDATIONS[@]} -gt 0 ]; then
    echo "[$TIMESTAMP] 💡 Recommendations:" >> logs/performance.log
    for rec in "${RECOMMENDATIONS[@]}"; do
        echo "[$TIMESTAMP]   - $rec" >> logs/performance.log
        echo "💡 $rec"
    done
fi

# Limpiar logs antiguos (mantener solo 7 días)
find logs/metrics -name "performance-*.json" -mtime +7 -delete 2>/dev/null || true
find logs -name "performance.log" -size +10M -exec truncate -s 1M {} \; 2>/dev/null || true

# Log final
echo "[$TIMESTAMP] Performance monitoring completed" >> logs/performance.log

exit 0