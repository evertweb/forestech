# 🪝 GUÍA COMPLETA DE HOOKS CLAUDE CODE - FORESTECH

## 📋 **QUÉ NECESITAS SABER**

### 🔧 **1. CONFIGURACIÓN INICIAL**

#### **Activar los hooks en Claude Code:**
```bash
# Usar comando /hooks en Claude Code
/hooks

# Seleccionar evento y configurar script
# Ejemplo para PostToolUse:
# Script: /home/evert/Documentos/appwebforestech/forestech/hooks/level-1/post-tool-use-linting.sh
```

#### **Configurar cada hook:**

**📍 NIVEL 1 - BÁSICO (Configurar primero):**
1. **PostToolUse** → `hooks/level-1/post-tool-use-linting.sh`
2. **Stop** → `hooks/level-1/stop-cleanup.sh`
3. **Notification** → `hooks/level-1/notification-logging.sh`

**📍 NIVEL 2 - INTERMEDIO (Configurar después):**
4. **PreToolUse** → `hooks/level-2/pre-tool-use-verifications.sh`
5. **SubagentStop** → `hooks/level-2/subagent-stop-validations.sh`

**📍 NIVEL 3 - AVANZADO (Configurar al final):**
6. **PostToolUse** → `hooks/level-3/firebase-mcp-integration.sh`
7. **Notification** → `hooks/level-3/advanced-monitoring.sh`

### 📊 **2. MONITOREO DEL SISTEMA**

#### **Archivos de logs que debes revisar:**
```bash
# Log principal de hooks
tail -f logs/hooks.log

# Logs por categoría
tail -f logs/errors.log        # Errores críticos
tail -f logs/warnings.log      # Advertencias
tail -f logs/notifications.log # Notificaciones generales
tail -f logs/performance.log   # Alertas de performance
```

#### **Métricas automáticas:**
```bash
# Métricas diarias
ls logs/metrics_*.log

# Análisis de patrones
ls logs/analysis_*.log

# Health checks
ls logs/health_*.log
```

### 🚨 **3. ALERTAS Y NOTIFICACIONES**

#### **Tipos de alertas:**
- **🚨 CRÍTICAS**: Archivo `CRITICAL_ALERT.txt` creado
- **⚡ PERFORMANCE**: Logs en `logs/performance_alerts.log`
- **🔒 SEGURIDAD**: Logs en `logs/security_alerts.log`

#### **Qué hacer con alertas críticas:**
1. **Revisar archivo** `CRITICAL_ALERT.txt` si existe
2. **Verificar logs** de errores recientes
3. **Ejecutar health check** manual si es necesario
4. **Eliminar** `CRITICAL_ALERT.txt` después de resolver

### 🛠️ **4. MANTENIMIENTO**

#### **Tareas semanales:**
```bash
# Limpiar logs antiguos (automático, pero puedes hacerlo manual)
find logs -name "*.log" -mtime +7 -delete

# Verificar espacio en disco
df -h .

# Revisar alertas críticas
ls -la CRITICAL_ALERT.txt SYSTEM_CRITICAL.txt 2>/dev/null || echo "No hay alertas críticas"
```

#### **Tareas mensuales:**
```bash
# Limpiar backups antiguos
find backups -type d -mtime +30 -exec rm -rf {} \;

# Limpiar alertas antiguas
find alerts -name "*.log" -mtime +30 -delete

# Verificar funcionamiento de hooks
ls -la hooks/*/
```

### 🔧 **5. TROUBLESHOOTING**

#### **Problemas comunes:**

**🔴 Hook no se ejecuta:**
```bash
# Verificar permisos
ls -la hooks/level-*/*.sh

# Hacer ejecutable si es necesario
chmod +x hooks/level-*/*.sh
```

**🔴 Logs no se crean:**
```bash
# Verificar directorio logs
ls -la logs/

# Crear directorio si falta
mkdir -p logs
```

**🔴 Errores de Firebase:**
```bash
# Verificar autenticación
firebase projects:list

# Re-autenticar si es necesario
firebase login
```

**🔴 Espacio en disco lleno:**
```bash
# Limpiar archivos temporales
./hooks/level-1/stop-cleanup.sh

# Verificar espacio
df -h .
```

### ⚙️ **6. PERSONALIZACIÓN**

#### **Modificar comportamiento:**
- **Cambiar frecuencia de métricas**: Editar `advanced-monitoring.sh` línea con `CURRENT_HOUR`
- **Cambiar límites de alertas**: Editar umbrales en scripts (ej. `DISK_USAGE -gt 90`)
- **Agregar nuevas verificaciones**: Añadir casos en `pre-tool-use-verifications.sh`

#### **Agregar hooks personalizados:**
1. **Crear script** en `hooks/custom/`
2. **Hacer ejecutable** con `chmod +x`
3. **Configurar en Claude Code** con `/hooks`

### 🔒 **7. SEGURIDAD**

#### **Buenas prácticas:**
- **✅ Revisar logs** regularmente
- **✅ Mantener backups** actualizados
- **✅ Monitorear alertas** de seguridad
- **❌ No modificar** scripts críticos sin backup
- **❌ No ignorar** alertas críticas

#### **Archivos sensibles protegidos:**
- `firebase.json` → Backup automático antes de cambios
- `firestore.rules` → Validación automática
- `CLAUDE.md` → Timestamp automático

### 📈 **8. MÉTRICAS Y OPTIMIZACIÓN**

#### **Métricas que se recolectan:**
- **Sistema**: CPU, RAM, disco
- **Forestech**: Archivos .jsx/.js, líneas de código
- **Hooks**: Ejecuciones, errores, patrones

#### **Optimización automática:**
- **Linting automático** después de editar
- **Cleanup automático** al finalizar sesión
- **Backups inteligentes** antes de cambios críticos
- **Health checks** periódicos

---

## 🎯 **RESUMEN PARA ACCIÓN INMEDIATA**

### **PASO 1: Configurar hooks básicos**
```bash
# En Claude Code, usar /hooks para cada uno:
1. PostToolUse → hooks/level-1/post-tool-use-linting.sh
2. Stop → hooks/level-1/stop-cleanup.sh
3. Notification → hooks/level-1/notification-logging.sh
```

### **PASO 2: Monitorear**
```bash
# Revisar logs diariamente
tail -f logs/hooks.log

# Verificar alertas críticas
ls -la *CRITICAL*.txt
```

### **PASO 3: Mantener**
```bash
# Limpiar semanalmente
find logs -name "*.log" -mtime +7 -delete
```

---

**📌 IMPORTANTE**: Los hooks se ejecutan automáticamente. Solo necesitas configurarlos una vez en Claude Code y después monitorear los logs. ¡El sistema se mantiene solo!

**🚀 BENEFICIO**: Automatización completa del flujo de trabajo con linting automático, cleanup, monitoreo y alertas inteligentes.