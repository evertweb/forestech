# 💰 Gestión de Recursos en GitHub Codespaces - Forestech

## 🏗️ **Tipos de Máquinas y Costos**

### **GitHub Pro (Tu Plan Actual) 🌟**
- **Incluido**: 180 horas/mes de 2-core (vs 60 en Free)
- **Incluido**: 20GB-month almacenamiento (vs 15GB en Free)
- **Acceso**: Todas las máquinas premium sin restricciones
- **Prebuilds**: Configuración avanzada disponible
- **Private repos**: Codespaces ilimitados

### **Recursos Base Incluidos**
- **2-core, 8GB RAM, 32GB SSD** - Incluido en Pro (180h/mes)
- **Ideal para**: Desarrollo completo Forestech sin costo adicional

### **Premium (Organization/Enterprise)**
- **4-core, 16GB RAM, 32GB SSD** - ~$0.36/hora (~$26/mes uso completo)
- **8-core, 32GB RAM, 64GB SSD** - ~$0.72/hora (~$52/mes uso completo)  
- **16-core, 64GB RAM, 128GB SSD** - ~$1.44/hora (~$104/mes uso completo)
- **32-core, 128GB RAM, 256GB SSD** - ~$2.88/hora (~$208/mes uso completo)

## 🎯 **Configuraciones Forestech Preconfiguradas**

### **🏠 Development (Standard)**
```json
{
  "cpus": 2,
  "memory": "8gb",
  "storage": "32gb"
}
```
- **Costo**: Gratis (en plan personal)
- **Uso**: Desarrollo diario, debugging, cambios pequeños
- **Apps**: 1-2 aplicaciones simultáneas

### **⚡ Performance (Premium)**  
```json
{
  "cpus": 4,
  "memory": "16gb",
  "storage": "64gb"
}
```
- **Costo**: ~$26/mes uso completo
- **Uso**: Builds grandes, desarrollo intensivo, testing
- **Apps**: Todas las apps + Firebase emulators

### **🚀 Enterprise (High-Performance)**
```json
{
  "cpus": 8,
  "memory": "32gb", 
  "storage": "128gb"
}
```
- **Costo**: ~$52/mes uso completo
- **Uso**: Demos, CI/CD, desarrollo complejo
- **Apps**: Full stack + monitoreo + análisis

## ⚙️ **Cómo Cambiar Configuración**

### **Método 1: Al Crear Codespace**
```
GitHub → Code → Codespaces → 
"..." → "New with options" →
Machine type: Seleccionar recursos
```

### **Método 2: Cambiar Máquina Existente**
```
Codespace activo →
"..." → "Change machine type" →
Seleccionar nueva configuración
```

### **Método 3: Via Configuración (Recomendado)**
Editar `.devcontainer/devcontainer.json`:
```json
{
  "hostRequirements": {
    "cpus": 4,
    "memory": "16gb",
    "storage": "64gb"
  }
}
```

## 🎯 **Optimización Automática Forestech**

Nuestro sistema detecta automáticamente los recursos y optimiza:

### **Variables de Entorno Auto-configuradas**
```bash
# Para 8GB RAM
NODE_OPTIONS=--max-old-space-size=6144

# Para 16GB RAM  
NODE_OPTIONS=--max-old-space-size=8192

# Para 32GB RAM
NODE_OPTIONS=--max-old-space-size=16384
```

### **Configuraciones NPM Adaptivas**
```bash
# Máquina básica (2-8GB)
npm config set maxsockets 15
npm config set network-concurrency 2

# Máquina premium (16GB)
npm config set maxsockets 25
npm config set network-concurrency 4

# Máquina enterprise (32GB+)
npm config set maxsockets 50
npm config set network-concurrency 8
```

## 📊 **Monitoreo de Recursos**

### **Script de Monitoreo Incluido**
```bash
# Ver uso actual de recursos
./scripts/monitor-resources.sh

# Output ejemplo:
📊 Estado de Recursos Forestech
================================
🖥️  CPU: 4 cores disponibles
📈 CPU Usage: 15.2%
💾 RAM: 3.2GB/16.0GB (20.0%)
💿 Disk: 12GB/64GB (19%)

🚀 Procesos Forestech activos:
node       25.0%    15.2%  /workspace/combustibles/node_modules/.bin/vite
firebase   5.2%     8.1%   firebase emulators:start
```

### **Alertas de Rendimiento**
El sistema te avisa automáticamente si:
- **CPU > 80%** por más de 5 minutos
- **RAM > 90%** en cualquier momento  
- **Disk > 85%** de capacidad

## 💡 **Recomendaciones por Caso de Uso**

### **👤 Desarrollador Individual (Tu Caso - GitHub Pro)**
- **Configuración**: Development (2-core, 8GB) - **180h/mes incluido**
- **Upgrade**: Performance (4-core, 16GB) - Solo $0.36/hora cuando necesites
- **Costo efectivo**: $0/mes desarrollo normal, ~$15-30/mes si usas premium
- **Usar para**: Todo el desarrollo Forestech sin preocupaciones

### **👥 Equipo Pequeño (2-5 devs)**
- **Configuración**: Performance (4-core, 16GB)  
- **Costo**: ~$150/mes para equipo
- **Usar para**: Desarrollo colaborativo, testing

### **🏢 Empresa/Cliente Demos**
- **Configuración**: Enterprise (8-core, 32GB)
- **Costo**: ~$300/mes uso intensivo
- **Usar para**: Demos, CI/CD, desarrollo crítico

## 🔧 **Optimizaciones Específicas de Forestech**

### **Para Apps React/Vite (Combustibles)**
```bash
# Configuración automática aplicada
VITE_CACHE_DIR=/workspace/.vite-cache
VITE_MAX_MEMORY=2048  # Según RAM disponible
GENERATE_SOURCEMAP=false  # En producción
```

### **Para Firebase Emulators**
```bash
# Puertos optimizados para no conflicto
FIREBASE_EMULATOR_HUB=0.0.0.0:4400
# UI en puerto predefinido
firebase emulators:start --only auth,firestore,functions,hosting
```

### **Para Builds Simultáneos**
```bash  
# Script optimizado incluido
./scripts/build-all.sh
# Usa recursos disponibles inteligentemente
```

## 🛡️ **Control de Costos**

### **Apagar Codespaces Automáticamente**
```json
{
  "settings": {
    "codespaces.defaultExtensions": [...],
    "codespaces.timeout": 30  // minutos de inactividad
  }
}
```

### **Usar Prebuilds para Ahorro**
```yaml
# .github/workflows/codespaces-prebuild.yml
name: Codespaces Prebuild
on:
  push:
    branches: [main]
jobs:
  prebuild:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build container
        run: echo "Prebuild completed"
```

## 📈 **Escalado por Fases**

### **Fase 1: MVP (Gratis)**
- Usar tier gratuito
- 1 desarrollador principal
- Testing básico

### **Fase 2: Crecimiento (~$50/mes)**
- Performance tier
- 2-3 desarrolladores
- CI/CD básico

### **Fase 3: Empresa (~$200/mes)**
- Enterprise tier
- Equipo completo
- Demos + producción

## 🎯 **Comandos Útiles**

```bash
# Ver configuración actual
cat /workspace/.env.codespace

# Cambiar configuración sobre la marcha
export NODE_OPTIONS="--max-old-space-size=8192"

# Limpiar cache para liberar espacio
npm cache clean --force
./scripts/clean-all.sh

# Ver uso detallado
htop  # CPU y RAM en tiempo real
df -h # Uso de disco
```

---

**💡 Tip**: Empieza con el tier gratuito y escala según necesidad. El sistema Forestech se adapta automáticamente a cualquier configuración.