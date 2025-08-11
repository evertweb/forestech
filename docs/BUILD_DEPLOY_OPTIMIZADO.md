# 🚀 Guía de Build y Deploy Optimizado - Forestech

> Sistema inteligente de build y deploy que reduce tiempos de 3 minutos a 30 segundos

## 📋 Resumen de Comandos

| Comando                      | Tiempo | Uso Principal                           |
| ---------------------------- | ------ | --------------------------------------- |
| `npm run deploy:smart`       | 30-60s | **🎯 Comando por defecto - Uso diario** |
| `npm run build:incremental`  | 3-8s   | Verificar build sin deploy              |
| `npm run build:single <app>` | 15-20s | Desarrollo de una app específica        |
| `npm run deploy:fast`        | 20-30s | Solo cambios frontend                   |
| `npm run clean:build`        | 45-60s | Problemas de cache                      |
| `npm run deploy`             | 2-3min | Releases importantes                    |

---

## 🔥 Comandos por Velocidad (Más Rápido → Más Lento)

### 1. ⚡ `npm run build:incremental` (3-8 segundos)

**Qué hace:**

- ✅ Analiza cambios desde último deploy
- ✅ Solo build apps modificadas
- ❌ NO deploya a producción

**Cuándo usar:**

- Solo verificar que tu código compila
- Testing rápido de builds locales
- Desarrollo con cambios frecuentes

**Casos de uso:**

```bash
# Verificar que cambios compilan sin deployar
npm run build:incremental

# Durante desarrollo de feature, builds frecuentes
npm run build:incremental

# Antes de commit, verificar errores de build
npm run build:incremental
```

---

### 2. ⚡ `npm run build:single <app>` (15-20 segundos)

**Qué hace:**

- ✅ Build solo de la app especificada
- ✅ Pregunta si quieres deployar
- ✅ Si aceptas, deploy inmediato

**Cuándo usar:**

- Trabajas solo en una app específica
- Desarrollo rápido con opción de deploy
- Testing de una app sin afectar la otra

**Casos de uso:**

```bash
# Trabajando solo en combustibles
npm run build:single combustibles

# Trabajando solo en alimentacion
npm run build:single alimentacion

# Bug fix urgente en una app específica
npm run build:single combustibles
```

---

### 3. 🚄 `npm run deploy:fast` (20-30 segundos)

**Qué hace:**

- ✅ Build incremental
- ✅ Deploy SOLO hosting (no functions/firestore)
- ⚡ Skip servicios backend para mayor velocidad

**Cuándo usar:**

- Cambios solo en frontend (React apps)
- NO cambiaste functions, firestore rules, o storage rules
- Deploy rápido de features de UI

**Casos de uso:**

```bash
# Cambios en componentes React, estilos, lógica frontend
npm run deploy:fast

# Features nuevas en UI sin backend changes
npm run deploy:fast

# Bug fixes solo en frontend
npm run deploy:fast
```

---

### 4. 🎯 `npm run deploy:smart` (30-60 segundos) ⭐ **RECOMENDADO**

**Qué hace:**

- ✅ Build incremental (solo apps que cambiaron)
- ✅ Deploy inteligente (solo servicios modificados)
- ✅ Detección automática de cambios
- ✅ Crea tags para rollback fácil

**Cuándo usar:**

- **USO DIARIO RECOMENDADO** 🎯
- Cualquier tipo de cambios (frontend + backend)
- Máxima eficiencia automática
- Cuando no estás seguro qué necesita deploy

**Casos de uso:**

```bash
# Tu comando por defecto para desarrollo diario
npm run deploy:smart

# Cambios mixtos (frontend + functions + firestore)
npm run deploy:smart

# Feature completa con múltiples cambios
npm run deploy:smart

# No sabes exactamente qué servicios cambiaron
npm run deploy:smart
```

**Ejemplo de output:**

```
🔍 Analizando cambios desde el último deploy...
✅ Alimentacion sin cambios - skipping build
🔨 Construyendo combustibles (cambios detectados)...
📦 Deploy hosting (apps React) requerido
🚀 Ejecutando: firebase deploy --only hosting
✅ Deploy completado - tag: deploy-20250811-185452
```

---

### 5. 🔧 `npm run clean:build` (45-60 segundos)

**Qué hace:**

- 🧹 Limpia todos los caches de Vite y npm
- 🔨 Build completamente limpio desde cero
- 🗑️ Remueve archivos temporales

**Cuándo usar:**

- Problemas con cache corrupto
- Builds inconsistentes o errores extraños
- Después de cambios en dependencies
- Reset completo del environment

**Casos de uso:**

```bash
# Error extraño que no desaparece
npm run clean:build

# Después de npm install de nuevas dependencies
npm run clean:build

# Cambios en vite.config.js o configuraciones
npm run clean:build

# Antes de release importante (build limpio)
npm run clean:build
```

---

### 6. 📦 `npm run deploy` (2-3 minutos) - Tradicional

**Qué hace:**

- 🔨 Build completo de ambas apps siempre
- 📦 Deploy completo de todos los servicios siempre
- 🐌 Método tradicional (lento pero seguro)

**Cuándo usar:**

- **SOLO para releases importantes**
- Cuando necesitas garantizar deploy completo
- Rollback a método tradicional si hay problemas

**Casos de uso:**

```bash
# Release de producción importante
npm run deploy

# Deploy completo después de clean
npm run clean && npm run deploy

# Si deploy:smart tiene problemas (fallback)
npm run deploy
```

---

## 🎯 Flujos de Trabajo Recomendados

### 🔄 Desarrollo Diario (Recomendado)

```bash
# 1. Hacer cambios en código
# 2. Deploy inteligente (comando por defecto)
npm run deploy:smart

# Si hay errores de cache:
npm run clean
npm run deploy:smart
```

### ⚡ Testing Rápido

```bash
# Solo verificar que compila
npm run build:incremental

# Build + preview de una app
npm run build:single combustibles
```

### 🎯 Casos Específicos

```bash
# Solo cambios de UI (no backend)
npm run deploy:fast

# Problemas con cache
npm run clean:build

# Release importante
npm run deploy
```

---

## 📊 Tabla de Decisión Rápida

| **Situación**            | **Comando Recomendado**      | **Tiempo** | **Qué Hace**                             |
| ------------------------ | ---------------------------- | ---------- | ---------------------------------------- |
| **Desarrollo diario**    | `npm run deploy:smart`       | 30-60s     | Auto-detecta y deploya solo lo necesario |
| **Solo verificar build** | `npm run build:incremental`  | 3-8s       | Build sin deploy                         |
| **Solo frontend cambió** | `npm run deploy:fast`        | 20-30s     | Skip backend, solo hosting               |
| **Solo una app**         | `npm run build:single <app>` | 15-20s     | Build específico con opción deploy       |
| **Errores de cache**     | `npm run clean:build`        | 45-60s     | Limpia cache + build limpio              |
| **Release importante**   | `npm run deploy`             | 2-3min     | Deploy completo tradicional              |

---

## 🔍 Ejemplos de Casos Reales

### 🐛 Caso 1: Bug Fix Urgente en Login

```bash
# Fix rápido solo en combustibles
npm run build:single combustibles
# Responder 'y' cuando pregunte si deployar
```

### ✨ Caso 2: Nueva Feature en Dashboard

```bash
# Múltiples archivos cambiados, detección automática
npm run deploy:smart
```

### ⚡ Caso 3: Cambios en Firebase Functions

```bash
# deploy:smart detecta cambios en functions/ automáticamente
npm run deploy:smart
```

### 📦 Caso 4: Actualizar Dependencies

```bash
# Limpiar cache después de npm install
npm run clean:build
```

### 🔍 Caso 5: Testing Cambios Sin Deploy

```bash
# Solo verificar que no hay errores
npm run build:incremental
```

### 🎨 Caso 6: Solo Cambios de CSS/Styling

```bash
# Solo frontend, skip backend
npm run deploy:fast
```

---

## 🚀 Mejoras de Performance

### Comparación de Tiempos

| **Método**         | **Antes** | **Después** | **Mejora**         |
| ------------------ | --------- | ----------- | ------------------ |
| Deploy completo    | 180s      | 180s        | Sin cambio         |
| Deploy inteligente | 180s      | **30s**     | **83% más rápido** |
| Build single app   | 25s       | **20s**     | **20% más rápido** |
| Build incremental  | 25s       | **3-8s**    | **70% más rápido** |

### Optimizaciones Implementadas

- ✅ **Cache persistente de Vite** para builds incrementales
- ✅ **Detección automática de cambios** desde último deploy
- ✅ **Deploy selectivo** solo de servicios modificados
- ✅ **Pre-bundling** de dependencies principales
- ✅ **Chunks estables** para mejor cache del navegador
- ✅ **Tags automáticos** para rollback fácil

---

## 💡 Tips y Mejores Prácticas

### ⭐ Regla de Oro

**En 90% de casos, usa `npm run deploy:smart` como tu comando por defecto. Es inteligente y siempre toma la decisión correcta.**

### 🔧 Comandos de Utilidad Adicionales

```bash
# Limpiar solo cache (sin build)
npm run clean

# Ver estado de archivos cambiados
git status

# Ver qué cambió desde último deploy
git log --oneline -10

# Revertir a deploy anterior
git checkout deploy-YYYYMMDD-HHMMSS
```

### 🎯 Cuándo NO Usar Deploy Inteligente

- **Primera vez configurando el proyecto** → Usar `npm run deploy`
- **Cambios masivos en configuración** → Usar `npm run clean:build`
- **Problemas extraños que no se van** → Usar `npm run clean:build`

---

## 🏷️ Sistema de Tags

Cada deploy exitoso crea un tag automático:

```bash
# Tags creados automáticamente
deploy-20250811-185452  # Formato: deploy-YYYYMMDD-HHMMSS

# Revertir a deploy específico
git checkout deploy-20250811-185452

# Ver lista de deploys
git tag -l "deploy-*" --sort=-version:refname
```

---

## 🆘 Troubleshooting

### Problemas Comunes

**Error: "No se encontró deploy anterior"**

```bash
# Primera vez usando el sistema, es normal
# El sistema hará deploy completo automáticamente
```

**Build muy lento después de cambios en package.json**

```bash
# Limpiar cache después de instalar dependencies
npm run clean:build
```

**Errores extraños de build**

```bash
# Reset completo
npm run clean
npm run build:incremental
```

**Deploy:smart no detecta cambios**

```bash
# Verificar que hay commits desde último deploy
git log --oneline -5

# Si no hay cambios reales, es correcto
# Si hay cambios pero no los detecta, usar fallback:
npm run deploy
```

---

## 📚 Recursos Adicionales

- **Configuración de Vite optimizada**: `combustibles/vite.config.js`
- **Scripts de automatización**: `scripts/build-incremental.sh`
- **Configuración de Firebase**: `firebase.json`
- **Documentación del proyecto**: `docs/`

---

**🎯 Recuerda: `npm run deploy:smart` es tu nuevo mejor amigo para desarrollo diario - 6x más rápido que el método tradicional.**
