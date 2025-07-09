# 🧪 PLAN DE PRUEBAS PARA HOOKS FORESTECH

## 📋 **VERIFICACIÓN INICIAL**

### **1. Verificar archivos y permisos**
```bash
# Verificar que todos los hooks existen
ls -la hooks/level-*/*.sh

# Verificar permisos ejecutables (debe mostrar -rwx)
ls -la hooks/level-*/*.sh | grep -E "^-rwx"

# Si falta permiso ejecutable:
chmod +x hooks/level-*/*.sh

# Verificar directorio de logs
mkdir -p logs
ls -la logs/
```

### **2. Preparar monitoreo en tiempo real**
```bash
# En una terminal separada, monitorear logs:
tail -f logs/hooks.log

# O monitorear todos los logs:
tail -f logs/*.log
```

---

## 🔥 **PRUEBAS ESPECÍFICAS POR HOOK**

### **🔧 PRUEBA 1: PostToolUse (Linting Automático)**

**Qué hace**: Se ejecuta después de editar archivos

**Cómo probar**:
```bash
# 1. Crear archivo de prueba en combustibles
echo "import React from 'react';" > combustibles/src/test-component.jsx

# 2. Editar el archivo usando Claude
# Usar: Edit tool para modificar combustibles/src/test-component.jsx

# 3. Verificar en logs que se ejecutó:
grep "PostToolUse Hook" logs/hooks.log
grep "linting automático" logs/hooks.log
```

**Resultado esperado**:
- Aparece en `logs/hooks.log`: "PostToolUse Hook - Tool: Edit"
- Aparece: "Ejecutando linting automático para combustibles..."

### **🛑 PRUEBA 2: Stop (Cleanup Automático)**

**Qué hace**: Se ejecuta al finalizar sesión

**Cómo probar**:
```bash
# 1. Crear archivos temporales
touch test.tmp
touch .DS_Store

# 2. Finalizar sesión de Claude (o simular)
# El hook debería ejecutarse automáticamente

# 3. Verificar que se limpiaron:
ls -la test.tmp .DS_Store  # No deberían existir

# 4. Verificar en logs:
grep "Stop Hook" logs/hooks.log
grep "Cleanup completado" logs/hooks.log
```

**Resultado esperado**:
- Archivos .tmp y .DS_Store eliminados
- Timestamp actualizado en CLAUDE.md

### **📢 PRUEBA 3: Notification (Logging)**

**Qué hace**: Se ejecuta cuando hay notificaciones

**Cómo probar**:
```bash
# 1. Generar una notificación (simular error)
# El hook se activará automáticamente con notificaciones del sistema

# 2. Verificar logs específicos:
tail -f logs/notifications.log
tail -f logs/errors.log

# 3. Verificar categorización:
grep "NOTIFICATION" logs/notifications.log
```

**Resultado esperado**:
- Notificaciones categorizadas por tipo
- Logs separados por severidad

### **⚡ PRUEBA 4: PreToolUse (Verificaciones)**

**Qué hace**: Se ejecuta antes de operaciones críticas

**Cómo probar**:
```bash
# 1. Usar Firebase MCP
# Ejecutar cualquier comando mcp__firebase__*

# 2. Usar comando bash
# Ejecutar: bash command

# 3. Verificar en logs:
grep "PreToolUse Hook" logs/hooks.log
grep "Verificando" logs/hooks.log
```

**Resultado esperado**:
- Verificaciones antes de operaciones críticas
- Estado de Firebase reportado

### **🤖 PRUEBA 5: SubagentStop (Validaciones)**

**Qué hace**: Se ejecuta después de tareas del Task tool

**Cómo probar**:
```bash
# 1. Usar Task tool para tarea compleja
# Ejemplo: "Refactorizar componente de vehículos"

# 2. Verificar en logs:
grep "SubagentStop Hook" logs/hooks.log
grep "Validando" logs/hooks.log
```

**Resultado esperado**:
- Validaciones después de tareas complejas
- Verificación de builds si aplica

---

## 🚀 **PRUEBA INTEGRADA COMPLETA**

### **Secuencia de prueba completa**:

```bash
# 1. PREPARAR
tail -f logs/hooks.log &
mkdir -p logs

# 2. PROBAR PostToolUse
echo "test" > combustibles/src/test.jsx
# Editar con Claude: Add una línea al archivo

# 3. PROBAR PreToolUse  
# Usar Firebase MCP o Bash command

# 4. PROBAR SubagentStop
# Usar Task tool para tarea compleja

# 5. CREAR TEMPORALES PARA STOP
touch test.tmp otro.tmp

# 6. FINALIZAR SESIÓN (Stop se ejecuta automáticamente)

# 7. VERIFICAR RESULTADOS
grep -c "Hook" logs/hooks.log  # Debe mostrar varios hooks ejecutados
ls -la test*.tmp  # No deben existir
```

---

## 📊 **VERIFICACIÓN DE RESULTADOS**

### **Logs que deben existir después de pruebas**:
```bash
# Verificar archivos de log creados
ls -la logs/

# Debe contener:
# - hooks.log (log principal)
# - notifications.log (notificaciones)
# - errors.log (errores)
# - warnings.log (advertencias)
# - success.log (éxitos)
```

### **Contenido esperado en logs**:
```bash
# hooks.log debe contener:
grep "PostToolUse Hook" logs/hooks.log
grep "Stop Hook" logs/hooks.log  
grep "PreToolUse Hook" logs/hooks.log
grep "SubagentStop Hook" logs/hooks.log
grep "Notification procesada" logs/hooks.log
```

---

## 🚨 **TROUBLESHOOTING**

### **Si no aparece nada en logs**:
```bash
# 1. Verificar permisos
chmod +x hooks/level-*/*.sh

# 2. Verificar paths en configuración de Claude
ls -la /home/evert/Documentos/appwebforestech/forestech/hooks/level-*/*.sh

# 3. Probar hook manualmente
./hooks/level-1/post-tool-use-linting.sh

# 4. Verificar configuración en Claude
/hooks  # Revisar matchers y commands
```

### **Si hooks no se ejecutan**:
```bash
# 1. Reiniciar Claude Code
# 2. Reconfigurar hooks con /hooks
# 3. Verificar matchers exactos
```

---

## ✅ **CRITERIOS DE ÉXITO**

**✓ Configuración correcta si**:
1. Archivos de log se crean automáticamente
2. PostToolUse ejecuta después de editar archivos
3. Stop limpia archivos temporales al finalizar
4. PreToolUse verifica antes de operaciones críticas
5. SubagentStop valida después de tareas complejas
6. Logs muestran actividad de hooks

**🎯 RESULTADO**: Sistema de hooks completamente funcional con automatización transparente del flujo de trabajo.