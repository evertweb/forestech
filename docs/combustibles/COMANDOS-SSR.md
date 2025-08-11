# 🛠️ Comandos y Scripts SSR - App Combustibles

**Guía completa de comandos disponibles para desarrollo, testing, deploy y monitoreo de la aplicación SSR.**

---

## 📦 **Scripts NPM Principales**

### **Desarrollo Local**

```bash
# Desarrollo app cliente (CSR normal)
npm run dev:combustibles

# Desarrollo SSR completo
npm run dev:ssr

# Servir SSR en local (emulators)
npm run serve:ssr

# Build para producción
npm run build:combustibles
```

### **Testing y Validación**

```bash
# Validación completa SSR vs CSR
npm run test:ssr-validation

# Test rollback Remote Config
npm run test:rollback

# Performance baseline Lighthouse
npm run perf:baseline

# Tests unitarios (si existen)
npm run test --workspace=combustibles
```

### **Deploy y Producción**

```bash
# Build + Deploy completo
npm run build:all && firebase deploy

# Deploy solo Functions SSR
npm run deploy:ssr

# Deploy solo Hosting
firebase deploy --only hosting

# Deploy solo Firestore rules
firebase deploy --only firestore
```

---

## 🔥 **Comandos Firebase**

### **Emulators (Desarrollo)**

```bash
# Iniciar emulators completos
firebase emulators:start

# Solo Functions + Hosting
firebase emulators:start --only functions,hosting

# Con puerto específico
firebase emulators:start --only functions,hosting --port=5000

# Ver UI emulators
open http://localhost:4000
```

### **Functions**

```bash
# Logs Functions en tiempo real
firebase functions:log --only=ssrCombustibles

# Logs con filtro
firebase functions:log --only=ssrCombustibles --lines 100

# Deploy solo Functions
firebase deploy --only functions

# Delete Function
firebase functions:delete ssrCombustibles
```

### **Hosting**

```bash
# Deploy solo Hosting
firebase deploy --only hosting

# Ver versiones
firebase hosting:clone

# Canal preview
firebase hosting:channel:deploy preview-ssr

# Ver sitios activos
firebase hosting:sites:list
```

### **Remote Config**

```bash
# Ver configuración actual
firebase remoteconfig:get

# Deploy Remote Config template
firebase deploy --only remoteconfig

# Ver versiones
firebase remoteconfig:versions:list
```

---

## ⚡ **Scripts de Emulators**

### **Inicio Rápido**

```bash
# Desarrollo SSR completo
firebase emulators:start --only functions,hosting,firestore

# Solo SSR sin DB
firebase emulators:start --only functions,hosting

# Background (no bloquea terminal)
firebase emulators:start --only functions,hosting &
```

### **Debugging**

```bash
# Functions con debugging
firebase emulators:start --only functions --inspect-functions

# Con logs detallados
firebase emulators:start --debug

# Kill emulators
pkill -f firebase
```

---

## 🧪 **Testing y Monitoreo**

### **Playwright Tests**

```bash
# Instalar Playwright (primera vez)
npx playwright install

# Tests SSR específicos
npx playwright test tests-e2e/ssr-validation.spec.ts

# Tests con UI
npx playwright test tests-e2e/ssr-validation.spec.ts --ui

# Tests con reporte
npx playwright test tests-e2e/ssr-validation.spec.ts --reporter=html
```

### **Performance Testing**

```bash
# Lighthouse baseline todas las rutas
node scripts/run-lighthouse-baseline.js

# Lighthouse ruta específica
npx lighthouse http://127.0.0.1:5000/combustibles/inventory --output json

# Performance budget check
npx lighthouse http://127.0.0.1:5000/combustibles/inventory --budget-path budget.json
```

### **Load Testing**

```bash
# Apache Bench (AB)
ab -n 100 -c 10 http://127.0.0.1:5000/combustibles/inventory

# Artillery (más avanzado)
artillery quick --count 100 --num 10 http://127.0.0.1:5000/combustibles/inventory

# K6 (profesional)
k6 run --vus 10 --duration 30s load-test.js
```

---

## 🔍 **Debugging y Logs**

### **Local Debugging**

```bash
# Ver logs Functions local
firebase functions:log --only=ssrCombustibles

# Debug con Node inspector
firebase emulators:start --inspect-functions

# Ver requests en tiempo real
tail -f logs/functions.log
```

### **Production Debugging**

```bash
# Logs producción
firebase functions:log --only=ssrCombustibles --lines 500

# Logs con timestamp
firebase functions:log --only=ssrCombustibles | grep "$(date +%Y-%m-%d)"

# Export logs
firebase functions:log --only=ssrCombustibles --lines 1000 > ssr-logs.txt
```

### **Error Monitoring**

```bash
# Buscar errores específicos
firebase functions:log --only=ssrCombustibles | grep "ERROR"

# Monitoreo fallbacks CSR
firebase functions:log --only=ssrCombustibles | grep "SSR Fallback"

# Performance monitoring
firebase functions:log --only=ssrCombustibles | grep "Server-Timing"
```

---

## 🌐 **URLs y Endpoints**

### **Development (Local)**

```bash
# Health check
curl http://127.0.0.1:5000/combustibles/ssr-health

# Test SSR routes
curl -H "Accept: text/html" http://127.0.0.1:5000/combustibles/inventory

# Test con headers
curl -H "User-Agent: Mozilla/5.0" http://127.0.0.1:5000/combustibles/vehicles

# Test performance
curl -w "@curl-format.txt" -o /dev/null -s http://127.0.0.1:5000/combustibles/inventory
```

### **Production**

```bash
# Health check producción
curl https://forestech.web.app/combustibles/ssr-health

# Test SSR con headers
curl -I https://forestech.web.app/combustibles/inventory

# Performance test
curl -w "Time: %{time_total}s\n" -o /dev/null -s https://forestech.web.app/combustibles/vehicles
```

---

## 📊 **Monitoreo Avanzado**

### **Real User Monitoring**

```bash
# Web Vitals desde consola
node -e "console.log(performance.getEntriesByType('navigation')[0])"

# Metrics export
node scripts/export-metrics.js > metrics.json

# Analytics events
node scripts/analytics-events.js --route=inventory --event=page_view
```

### **Firebase Console**

```bash
# Abrir Functions dashboard
open https://console.firebase.google.com/project/$(firebase use)/functions

# Abrir Performance dashboard
open https://console.firebase.google.com/project/$(firebase use)/performance

# Abrir Remote Config
open https://console.firebase.google.com/project/$(firebase use)/config
```

---

## 🔧 **Utilidades y Mantenimiento**

### **Cache Management**

```bash
# Limpiar cache Functions
firebase functions:delete ssrCombustibles && firebase deploy --only functions

# Limpiar cache Hosting
firebase hosting:sites:delete --site-id preview-ssr

# Clear build cache
rm -rf combustibles/dist functions/node_modules/.cache
```

### **Database Operations**

```bash
# Backup Firestore
gcloud firestore export gs://your-bucket/backup-$(date +%Y%m%d)

# Import data
firebase firestore:delete --all-collections

# Run migrations
node scripts/migrate-data.js
```

### **Environment Setup**

```bash
# Setup environment variables
cp .env.example .env.local

# Validate config
firebase functions:config:get

# Set production vars
firebase functions:config:set app.environment="production"
```

---

## 🚨 **Troubleshooting Commands**

### **Common Issues**

```bash
# Reset everything
pkill -f firebase
rm -rf node_modules functions/node_modules
npm install && cd functions && npm install

# Fix permissions
chmod +x scripts/*.js
chmod +x scripts/*.sh

# Validate Firebase project
firebase projects:list
firebase use --list
```

### **Error Recovery**

```bash
# Force redeploy
firebase deploy --force

# Rollback deployment
firebase hosting:rollback

# Reset Functions
firebase functions:delete ssrCombustibles
firebase deploy --only functions
```

### **Network Issues**

```bash
# Test connectivity
ping firebase.google.com
curl -I https://firebase.google.com

# Proxy settings
export HTTP_PROXY=http://proxy:8080
export HTTPS_PROXY=http://proxy:8080
```

---

## 📋 **Quick Reference**

### **Most Used Commands**

```bash
# 🔥 Development workflow
npm run dev:ssr                    # Start SSR development
npm run test:ssr-validation        # Validate SSR implementation
npm run deploy:ssr                 # Deploy to production

# 🧪 Testing workflow
firebase emulators:start --only functions,hosting
npm run test:rollback
npx playwright test tests-e2e/ssr-validation.spec.ts

# 📊 Monitoring workflow
firebase functions:log --only=ssrCombustibles
npm run perf:baseline
curl -I https://forestech.web.app/combustibles/inventory
```

### **Emergency Commands**

```bash
# 🚨 Quick rollback
firebase hosting:rollback

# 🚨 Disable SSR via Remote Config
# (Change ssr_enabled to false in Firebase Console)

# 🚨 Force redeploy
firebase deploy --force --only functions,hosting
```

---

## 🎯 **Aliases Útiles**

Añadir a tu `~/.bashrc` o `~/.zshrc`:

```bash
# Firebase SSR aliases
alias fstart='firebase emulators:start --only functions,hosting'
alias flog='firebase functions:log --only=ssrCombustibles'
alias fdeploy='npm run build:combustibles && firebase deploy'
alias ftest='npm run test:ssr-validation'

# Quick URLs
alias ssr-health='curl http://127.0.0.1:5000/combustibles/ssr-health'
alias ssr-test='curl -I http://127.0.0.1:5000/combustibles/inventory'
```

---

**💡 Tip**: Guarda este archivo como referencia y úsalo como cheatsheet para operaciones diarias con tu app SSR.
