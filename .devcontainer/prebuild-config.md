# 🚀 Configuración de Prebuilds para Forestech

## ⚙️ Configuración Recomendada

### 📱 **Configuración Básica**
- **Branch:** `main`
- **Región:** `East US` (más rápida)
- **Machine Type:** `4-core` (recomendado para Node.js)
- **Storage:** `32 GB` (suficiente para node_modules)

### 🔄 **Triggers**
- ✅ **On push to main** - Rebuild automático en cada push
- ✅ **Scheduled daily at 2 AM** - Mantener dependencias actualizadas
- ✅ **Manual trigger** - Para rebuilds bajo demanda

### 📦 **Lo que se Pre-instala**
```bash
# Estas operaciones se ejecutan ANTES de crear Codespace:
1. Docker build del devcontainer
2. npm install en /combustibles
3. npm install en /alimentacion  
4. Setup de herramientas (Firebase CLI, etc.)
5. Configuración de VS Code extensions
6. Scripts de setup automático
```

### 💡 **Optimizaciones para Prebuilds**

#### 🔧 En `devcontainer.json`:
```json
{
  // Optimizar para prebuilds
  "postCreateCommand": "bash .devcontainer/setup-prebuild.sh",
  "updateContentCommand": "npm run update-deps",
  
  // Cache layers para builds más rápidos
  "build": {
    "dockerfile": "Dockerfile",
    "options": ["--cache-from", "forestech-prebuild:latest"]
  }
}
```

#### 📝 Script optimizado para prebuilds:
```bash
#!/bin/bash
# .devcontainer/setup-prebuild.sh

# Instalar dependencias en paralelo
(cd combustibles && npm ci --prefer-offline) &
(cd alimentacion && npm ci --prefer-offline) &

# Herramientas globales
npm install -g firebase-tools@latest &

wait # Esperar a que terminen todos los procesos

# Warm up de caches
(cd combustibles && npm run build --if-present) &
(cd alimentacion && npm run build --if-present) &

wait

echo "✅ Prebuild optimizado completado"
```

## 📊 **Métricas Esperadas**

### ⏱️ **Tiempos de Creación**
- **Sin prebuild:** ~8 minutos
- **Con prebuild:** ~45 segundos

### 💰 **Costos Estimados**
- **Prebuild:** ~10 minutos GitHub Actions/día
- **Ahorro:** ~7 minutos × número de codespaces creados

### 🎯 **ROI (Return on Investment)**
- **Breakeven:** 2+ codespaces creados por día
- **Recomendado:** Teams con 3+ desarrolladores

## 🚀 **Pasos para Activar**

1. **GitHub Settings → Codespaces → Set up prebuild**
2. **Seleccionar configuración:** Branch main, 4-core
3. **Primer prebuild:** Tarda ~10-15 minutos
4. **Subsecuentes:** ~3-5 minutos (cache optimizado)

## ⚠️ **Consideraciones**

### ✅ **Beneficios**
- Codespaces instantáneos
- Mejor experiencia de desarrollador
- Dependencias siempre actualizadas

### ⚠️ **Desventajas**
- Consume minutos de GitHub Actions
- Requiere configuración inicial
- Rebuilds automáticos en cada push

### 🎯 **Recomendación**
**SÍ configurar prebuilds si:**
- Team de 2+ desarrolladores
- Uso frecuente de Codespaces (>3/semana)
- Setup complejo (muchas dependencias)

**NO configurar si:**
- Desarrollador individual ocasional
- Setup muy simple
- Presupuesto limitado de GitHub Actions