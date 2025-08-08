#!/bin/bash
# HOOK NIVEL 3: Security Validator - Validador de seguridad avanzado
# Avanzado: Verificaciones de seguridad para código y configuraciones

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/hp/Documents/forestech"

# Variables del hook
FILE_PATH="${FILE_PATH:-unknown}"
OPERATION="${OPERATION:-unknown}"

# Log de inicio
echo "[$TIMESTAMP] Security Validator - File: $FILE_PATH, Operation: $OPERATION" >> "$PROJECT_DIR/logs/security.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Crear directorio de security logs si no existe
mkdir -p logs/security

# Función para verificar patrones inseguros en código
check_code_security() {
    local file="$1"
    local violations=()
    
    if [ ! -f "$file" ]; then
        return 0
    fi
    
    # Patrones peligrosos comunes
    local dangerous_patterns=(
        "eval\s*\("
        "innerHTML\s*="
        "dangerouslySetInnerHTML"
        "document\.write"
        "\.exec\s*\("
        "new Function\s*\("
        "setTimeout\s*\(\s*['\"]"
        "setInterval\s*\(\s*['\"]"
    )
    
    for pattern in "${dangerous_patterns[@]}"; do
        if grep -qE "$pattern" "$file" 2>/dev/null; then
            violations+=("Dangerous pattern: $pattern")
        fi
    done
    
    # Verificar secrets potenciales
    local secret_patterns=(
        "password\s*=\s*['\"][^'\"]+['\"]"
        "api[_-]?key\s*=\s*['\"][^'\"]+['\"]"
        "secret\s*=\s*['\"][^'\"]+['\"]"
        "token\s*=\s*['\"][^'\"]+['\"]"
        "firebase[_-]?config.*apiKey"
    )
    
    for pattern in "${secret_patterns[@]}"; do
        if grep -qE -i "$pattern" "$file" 2>/dev/null; then
            violations+=("Potential secret exposure: $pattern")
        fi
    done
    
    # Imprimir violaciones encontradas
    for violation in "${violations[@]}"; do
        echo "[$TIMESTAMP] ⚠️ Security violation in $file: $violation" >> logs/security.log
        echo "⚠️ Security violation: $violation"
    done
    
    return ${#violations[@]}
}

# Función para verificar configuraciones de Firebase
check_firebase_security() {
    local config_violations=()
    
    # Verificar firebase.json
    if [ -f "firebase.json" ]; then
        # Verificar configuración de hosting
        if grep -q '"public"' firebase.json; then
            if ! grep -q '"rewrites"' firebase.json; then
                config_violations+=("Firebase hosting without rewrites configuration")
            fi
        fi
        
        # Verificar configuración de Firestore
        if grep -q '"firestore"' firebase.json; then
            if [ -f "firestore.rules" ]; then
                # Verificar reglas básicas de seguridad
                if grep -q "allow read, write: if true" firestore.rules; then
                    config_violations+=("Firestore rules too permissive: allow all")
                fi
                
                if ! grep -q "request.auth" firestore.rules; then
                    config_violations+=("Firestore rules missing authentication checks")
                fi
            else
                config_violations+=("Firebase Firestore config present but no rules file")
            fi
        fi
    fi
    
    # Verificar archivo .env
    if [ -f ".env" ]; then
        if grep -q "FIREBASE_API_KEY" .env; then
            config_violations+=("Firebase API key in .env file - consider using public config")
        fi
    fi
    
    # Imprimir violaciones de configuración
    for violation in "${config_violations[@]}"; do
        echo "[$TIMESTAMP] ⚠️ Configuration security issue: $violation" >> logs/security.log
        echo "⚠️ Configuration security issue: $violation"
    done
    
    return ${#config_violations[@]}
}

# Función para verificar dependencias vulnerables
check_dependencies() {
    local dep_issues=()
    
    # Verificar si npm audit está disponible
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        # Ejecutar audit y capturar resultado
        audit_result=$(npm audit --audit-level=high --json 2>/dev/null || echo '{"error": true}')
        
        if echo "$audit_result" | grep -q '"high":[1-9]'; then
            high_vulns=$(echo "$audit_result" | grep -o '"high":[0-9]*' | grep -o '[0-9]*')
            dep_issues+=("High severity vulnerabilities: $high_vulns")
        fi
        
        if echo "$audit_result" | grep -q '"critical":[1-9]'; then
            critical_vulns=$(echo "$audit_result" | grep -o '"critical":[0-9]*' | grep -o '[0-9]*')
            dep_issues+=("Critical vulnerabilities: $critical_vulns")
        fi
    fi
    
    # Verificar package-lock.json para packages específicamente inseguros
    if [ -f "package-lock.json" ]; then
        local known_vulnerable=(
            "lodash.*4\.17\.1[0-8]"
            "serialize-javascript.*[1-2]\."
            "yargs-parser.*5\.0\.[0-7]"
        )
        
        for pattern in "${known_vulnerable[@]}"; do
            if grep -qE "$pattern" package-lock.json 2>/dev/null; then
                dep_issues+=("Known vulnerable package: $pattern")
            fi
        done
    fi
    
    # Imprimir issues de dependencias
    for issue in "${dep_issues[@]}"; do
        echo "[$TIMESTAMP] ⚠️ Dependency security issue: $issue" >> logs/security.log
        echo "⚠️ Dependency security issue: $issue"
    done
    
    return ${#dep_issues[@]}
}

# Función para verificar permisos de archivos críticos
check_file_permissions() {
    local perm_issues=()
    
    # Archivos que no deberían ser ejecutables
    local non_exec_files=("package.json" "firebase.json" "*.md" "*.json")
    
    for pattern in "${non_exec_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ -x "$file" ]; then
                perm_issues+=("Unnecessary executable permission: $file")
            fi
        done
    done
    
    # Archivos que deberían ser ejecutables
    local exec_files=("hooks/**/*.sh" "scripts/*.sh")
    
    for pattern in "${exec_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ ! -x "$file" ]; then
                perm_issues+=("Missing executable permission: $file")
            fi
        done
    done
    
    # Imprimir issues de permisos
    for issue in "${perm_issues[@]}"; do
        echo "[$TIMESTAMP] ⚠️ File permission issue: $issue" >> logs/security.log
        echo "⚠️ File permission issue: $issue"
    done
    
    return ${#perm_issues[@]}
}

# Ejecutar verificaciones de seguridad
echo "[$TIMESTAMP] Running security validations..." >> logs/security.log

total_violations=0

# 1. Verificar código si se especificó un archivo
if [[ "$FILE_PATH" != "unknown" && -f "$FILE_PATH" ]]; then
    echo "[$TIMESTAMP] Checking code security for: $FILE_PATH" >> logs/security.log
    check_code_security "$FILE_PATH"
    total_violations=$((total_violations + $?))
fi

# 2. Verificar configuraciones de Firebase
echo "[$TIMESTAMP] Checking Firebase security configurations..." >> logs/security.log
check_firebase_security
total_violations=$((total_violations + $?))

# 3. Verificar dependencias vulnerables
echo "[$TIMESTAMP] Checking dependency vulnerabilities..." >> logs/security.log
check_dependencies
total_violations=$((total_violations + $?))

# 4. Verificar permisos de archivos
echo "[$TIMESTAMP] Checking file permissions..." >> logs/security.log
check_file_permissions
total_violations=$((total_violations + $?))

# Generar reporte de seguridad
SECURITY_REPORT="{
  \"timestamp\": \"$TIMESTAMP\",
  \"file\": \"$FILE_PATH\",
  \"operation\": \"$OPERATION\",
  \"total_violations\": $total_violations,
  \"status\": \"$([ $total_violations -eq 0 ] && echo "SECURE" || echo "VIOLATIONS_FOUND")\"
}"

# Guardar reporte
echo "$SECURITY_REPORT" >> logs/security/security-scan-$(date +%Y%m%d).json

# Resultado final
if [ $total_violations -eq 0 ]; then
    echo "[$TIMESTAMP] ✅ Security validation passed" >> logs/security.log
    echo "✅ Security validation passed"
else
    echo "[$TIMESTAMP] ⚠️ Security validation found $total_violations issues" >> logs/security.log
    echo "⚠️ Security validation found $total_violations issues"
fi

# Recomendaciones de seguridad
echo "[$TIMESTAMP] Security recommendations:" >> logs/security.log
echo "💡 Security recommendations:"
echo "  - Regularly run 'npm audit' to check dependencies"
echo "  - Keep Firebase rules restrictive and auth-based"
echo "  - Avoid hardcoding secrets in source code"
echo "  - Use environment variables for sensitive config"

# Limpiar logs antiguos (mantener solo 30 días)
find logs/security -name "security-scan-*.json" -mtime +30 -delete 2>/dev/null || true

# Log final
echo "[$TIMESTAMP] Security validation completed" >> logs/security.log

exit 0