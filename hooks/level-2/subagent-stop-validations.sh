#!/bin/bash
# HOOK NIVEL 2: SubagentStop - Validaciones después de tareas complejas
# Intermedio: Verificar integridad después de operaciones del Task tool

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/evert/Documentos/appwebforestech/forestech"

# Variables del hook
TASK_DESCRIPTION="${TASK_DESCRIPTION:-unknown}"
TASK_RESULT="${TASK_RESULT:-unknown}"

# Log de inicio
echo "[$TIMESTAMP] SubagentStop Hook - Task: $TASK_DESCRIPTION" >> "$PROJECT_DIR/logs/hooks.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Validaciones específicas por tipo de tarea
echo "[$TIMESTAMP] Ejecutando validaciones post-tarea..." >> logs/hooks.log

# Validar refactoring
if [[ "$TASK_DESCRIPTION" == *"refactor"* ]] || [[ "$TASK_DESCRIPTION" == *"migrar"* ]]; then
    echo "[$TIMESTAMP] Validando refactoring..." >> logs/hooks.log
    
    # Verificar que el código compila
    if command -v npm &> /dev/null; then
        if [[ "$TASK_DESCRIPTION" == *"combustibles"* ]]; then
            echo "[$TIMESTAMP] Verificando build combustibles..." >> logs/hooks.log
            if npm run build:combustibles &>/dev/null; then
                echo "[$TIMESTAMP] ✅ Build combustibles exitoso" >> logs/hooks.log
                echo "✅ Build combustibles exitoso después de refactoring"
            else
                echo "[$TIMESTAMP] ❌ Build combustibles falló" >> logs/hooks.log
                echo "❌ Build combustibles falló después de refactoring"
            fi
        fi
        
        if [[ "$TASK_DESCRIPTION" == *"alimentacion"* ]]; then
            echo "[$TIMESTAMP] Verificando build alimentación..." >> logs/hooks.log
            if npm run build:alimentacion &>/dev/null; then
                echo "[$TIMESTAMP] ✅ Build alimentación exitoso" >> logs/hooks.log
                echo "✅ Build alimentación exitoso después de refactoring"
            else
                echo "[$TIMESTAMP] ❌ Build alimentación falló" >> logs/hooks.log
                echo "❌ Build alimentación falló después de refactoring"
            fi
        fi
    fi
fi

# Validar cambios en Firebase
if [[ "$TASK_DESCRIPTION" == *"firebase"* ]] || [[ "$TASK_DESCRIPTION" == *"firestore"* ]]; then
    echo "[$TIMESTAMP] Validando cambios Firebase..." >> logs/hooks.log
    
    # Verificar reglas de Firestore si existen
    if [ -f "firestore.rules" ]; then
        if command -v firebase &> /dev/null; then
            echo "[$TIMESTAMP] Verificando reglas Firestore..." >> logs/hooks.log
            if firebase firestore:rules:release --dry-run &>/dev/null; then
                echo "[$TIMESTAMP] ✅ Reglas Firestore válidas" >> logs/hooks.log
                echo "✅ Reglas Firestore válidas"
            else
                echo "[$TIMESTAMP] ❌ Reglas Firestore inválidas" >> logs/hooks.log
                echo "❌ Reglas Firestore inválidas"
            fi
        fi
    fi
fi

# Validar componentes nuevos
if [[ "$TASK_DESCRIPTION" == *"componente"* ]] || [[ "$TASK_DESCRIPTION" == *"component"* ]]; then
    echo "[$TIMESTAMP] Validando componentes nuevos..." >> logs/hooks.log
    
    # Verificar imports y exports
    if find . -name "*.jsx" -type f -exec grep -l "export.*function\|export.*const" {} \; | wc -l > /dev/null; then
        COMPONENT_COUNT=$(find . -name "*.jsx" -type f -exec grep -l "export.*function\|export.*const" {} \; | wc -l)
        echo "[$TIMESTAMP] ✅ $COMPONENT_COUNT componentes encontrados" >> logs/hooks.log
        echo "✅ $COMPONENT_COUNT componentes validados"
    fi
fi

# Validar estructura de archivos críticos
echo "[$TIMESTAMP] Verificando estructura de archivos críticos..." >> logs/hooks.log

# Verificar archivos críticos
CRITICAL_FILES=("package.json" "firebase.json" "CLAUDE.md")
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "[$TIMESTAMP] ✅ $file existe" >> logs/hooks.log
    else
        echo "[$TIMESTAMP] ⚠️ $file no encontrado" >> logs/hooks.log
        echo "⚠️ Archivo crítico no encontrado: $file"
    fi
done

# Log final
echo "[$TIMESTAMP] SubagentStop validaciones completadas" >> logs/hooks.log

exit 0