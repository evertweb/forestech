# 🚀 SISTEMA PRE-COMMIT UNIFICADO - FORESTECH

## ✅ **IMPLEMENTACIÓN COMPLETADA**

¡Perfecto! Ya tienes implementado un **sistema pre-commit unificado** que ejecuta automáticamente **tests + lint + build + deploy** en cada commit.

## 🔄 **CÓMO FUNCIONA AHORA**

### **Comportamiento Automático:**
Cuando hagas cualquier `git commit`, automáticamente se ejecuta:

1. **🔍 Validación** - Verifica archivos staged
2. **🧹 Linting** - Ejecuta linting completo o rápido
3. **🧪 Tests** - Ejecuta tests (en modo completo)
4. **🏗️ Build Inteligente** - Solo builddea apps con cambios
5. **✅ Validación Build** - Verifica que los builds existan
6. **🚀 Deploy Automático** - Despliega a Firebase automáticamente

### **Deploy Automático Eliminado:**
- ❌ **YA NO NECESITAS** `npm run deploy`
- ✅ **TODO ES AUTOMÁTICO** en cada commit
- ⚡ **Detección inteligente** de qué apps buildear

## 🎯 **COMANDOS DISPONIBLES**

### **Commits Normales:**
```bash
git add .
git commit -m "feat: nueva funcionalidad"
# ↑ Ejecuta automáticamente: lint + test + build + deploy
```

### **Commits Rápidos (desarrollo):**
```bash
# Opción 1: Variable de entorno
SKIP_DEPLOY=true git commit -m "wip: trabajo en progreso"

# Opción 2: Comando específico
npm run commit:fast -m "fix: corrección rápida"

# Opción 3: Solo build y lint (sin deploy)
npm run commit:dev -m "chore: cambio menor"
```

### **Commits con Control Total:**
```bash
# Modo completo (por defecto)
npm run commit:safe -m "feat: nueva feature completa"

# Solo validación (sin deploy)
npm run precommit:no-deploy
```

## ⚙️ **CONFIGURACIÓN PERSONALIZADA**

### **Variables de Entorno Rápidas:**
```bash
# Saltar deploy solo este commit
SKIP_DEPLOY=true git commit -m "docs: actualizar README"

# Saltar tests (solo lint + build + deploy)
SKIP_TESTS=true git commit -m "style: ajustar estilos"

# Build completo siempre
FORCE_FULL_BUILD=true git commit -m "refactor: cambio estructural"
```

### **Configuración Permanente:**
```bash
# Crear configuración personalizada
cp .forestech-precommit.config.example .forestech-precommit.config

# Editar configuración (ejemplo)
echo 'SKIP_DEPLOY=true' >> .forestech-precommit.config
echo 'FAST_MODE_DEFAULT=true' >> .forestech-precommit.config
```

## 🔧 **ESCENARIOS DE USO**

### **1. Desarrollo Normal (Recomendado):**
```bash
git add .
git commit -m "feat: implementar login"
# ✅ Automático: lint + test + build + deploy
```

### **2. Desarrollo Rápido:**
```bash
SKIP_DEPLOY=true git commit -m "wip: trabajo en progreso"
# ✅ Solo: lint + build (sin deploy)
```

### **3. Emergencias:**
```bash
npm run precommit:fast
git commit -m "hotfix: error crítico"
# ✅ Rápido: lint básico + build + deploy rápido
```

### **4. Solo Validación:**
```bash
npm run precommit:no-deploy
# ✅ Todo excepto deploy
```

## 📊 **DETECCIÓN INTELIGENTE**

El sistema detecta automáticamente qué apps buildear:

- **📁 Cambios en `alimentacion/`** → Build solo alimentación
- **📁 Cambios en `combustibles/`** → Build solo combustibles  
- **📁 Cambios en `shared/`** → Build ambas apps
- **📁 Solo docs/config** → Sin build necesario

## 🚀 **BENEFICIOS DEL NUEVO SISTEMA**

### **✅ Ventajas:**
- **🔄 Automático**: Cero comandos manuales
- **⚡ Inteligente**: Solo builds necesarios
- **🛡️ Seguro**: Validación completa antes de deploy
- **🚀 Rápido**: Optimizaciones en paralelo

### **🎯 Tiempo Estimado:**
- **Commit completo**: ~60-90 segundos
- **Commit rápido**: ~30-40 segundos
- **Commit sin deploy**: ~20-30 segundos

## 🔄 **MIGRACIÓN DESDE SISTEMA ANTERIOR**

### **Antes:**
```bash
# Proceso manual anterior
npm run lint
npm run test
npm run build
npm run deploy
git add .
git commit -m "feat: nueva funcionalidad"
```

### **Ahora:**
```bash
# Proceso unificado
git add .
git commit -m "feat: nueva funcionalidad"
# ↑ TODO automático: lint + test + build + deploy
```

## 🛠️ **TROUBLESHOOTING**

### **Si el Pre-commit Falla:**
```bash
# Ver logs detallados
cat /tmp/precommit-step-*.log

# Ejecutar manualmente para debug
./scripts/precommit-unified.sh --fast

# Saltar pre-commit temporalmente (NO recomendado)
git commit --no-verify -m "bypass: situación especial"
```

### **Desactivar Temporalmente:**
```bash
# Opción 1: Variable de entorno
SKIP_DEPLOY=true git commit -m "commit sin deploy"

# Opción 2: Configuración permanente
echo 'AUTO_DEPLOY_ENABLED=false' >> .forestech-precommit.config
```

## 🎉 **RESULTADO FINAL**

🚀 **YA NO NECESITAS EJECUTAR `npm run deploy`**

✅ **Todo está automatizado en cada commit**

⚡ **Deploy continuo sin esfuerzo adicional**

🛡️ **Calidad garantizada en cada cambio**
