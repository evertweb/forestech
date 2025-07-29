# 🏠 Codespace Permanente para Forestech

## 🎯 **Configuración para Codespace Persistente**

### **1. Crear Codespace con configuración permanente:**

**En GitHub:**
- Ve a tu repo: `github.com/evertweb/forestech`
- **Code** → **Codespaces** → **"..."** → **"New with options"**
- **Machine type**: `4-core, 16GB RAM` (recomendado Pro)
- **☑️ Marcar: "Keep codespace running"**
- **☑️ Marcar: "Enable persistence"**

### **2. Configuración de persistencia automática:**

```bash
# Al crear el Codespace, ejecutar:
gh codespace create --repo evertweb/forestech \
  --machine 4core \
  --display-name "Forestech-Permanent" \
  --idle-timeout never \
  --retention-period 30d
```

### **3. Configuración en el navegador:**

**Una vez dentro del Codespace:**
1. **Settings** → **Codespaces**
2. **Default idle timeout**: `Never`
3. **Auto-delete**: `Never`
4. **Storage retention**: `Maximum (30 days)`

## ⚙️ **Scripts para mantener activo**

### **Keep-Alive automático:**

```bash
# Script que se ejecuta automáticamente cada 30 minutos
cat > /workspace/scripts/keep-alive.sh << 'EOF'
#!/bin/bash
while true; do
    echo "🚀 Forestech Codespace activo: $(date)"
    # Actividad mínima para mantener vivo
    touch /workspace/.keep-alive
    git status > /dev/null 2>&1
    sleep 1800  # 30 minutos
done
EOF

chmod +x /workspace/scripts/keep-alive.sh

# Ejecutar en background
nohup /workspace/scripts/keep-alive.sh &
```

### **Auto-start servicios:**

```bash
# Crear servicio que auto-inicia al conectar
cat > /workspace/.codespace-startup << 'EOF'
#!/bin/bash
echo "🔄 Auto-iniciando servicios de Forestech..."

# Iniciar keep-alive
if ! pgrep -f keep-alive.sh; then
    nohup /workspace/scripts/keep-alive.sh &
fi

# Iniciar servicios de desarrollo
if [ "$AUTO_START_SERVICES" = "true" ]; then
    /workspace/scripts/dev-all.sh &
fi
EOF

chmod +x /workspace/.codespace-startup
```

## 💰 **Optimización de costos con GitHub Pro**

### **Configuración costo-efectiva:**

**Para tu plan GitHub Pro:**
- ✅ **180 horas gratis/mes** con 2-core, 8GB
- ✅ **Solo pagar premium cuando necesites** 4-core+
- ✅ **Codespace persistente** - datos nunca se pierden

### **Estrategia de uso:**

```json
{
  "desarrollo_diario": {
    "machine": "2-core, 8GB",
    "costo": "GRATIS (180h/mes)",
    "uso": "Código, debugging, cambios pequeños"
  },
  "builds_intensivos": {
    "machine": "4-core, 16GB", 
    "costo": "$0.36/hora (~$15-30/mes parcial)",
    "uso": "Builds, testing, demos"
  },
  "modo_hibernacion": {
    "machine": "Cualquiera en pausa",
    "costo": "$0/hora",
    "nota": "Datos persisten, se reactive instantáneamente"
  }
}
```

## 🔄 **Ciclo de trabajo permanente**

### **1. Mañana - Activar:**
```bash
# Se conecta automáticamente, servicios inician solos
./scripts/dev-all.sh  # Si no están corriendo
```

### **2. Durante el día - Desarrollo:**
```bash
# Todo está siempre disponible:
cd combustibles && npm run dev  # Si necesitas reiniciar
cd alimentacion && npm start   # Si necesitas reiniciar
```

### **3. Noche - Pausa inteligente:**
```bash
# El Codespace se pausa automáticamente después de inactividad
# PERO mantiene todos los datos y configuración
```

### **4. Reconexión - Instantánea:**
```bash
# Al volver, todo está como lo dejaste:
# - Archivos editados guardados
# - Extensiones configuradas  
# - Claude Code funcionando
# - Git status preservado
```

## 🛡️ **Backup y seguridad**

### **Auto-backup de configuración:**

```bash
# Script que hace backup de tu configuración personal
cat > /workspace/scripts/backup-config.sh << 'EOF'
#!/bin/bash
echo "💾 Haciendo backup de configuración..."

# Crear backup de settings personales
mkdir -p /workspace/.backups/$(date +%Y%m%d)
cp -r ~/.vscode-server/data/User/settings.json /workspace/.backups/$(date +%Y%m%d)/
cp -r ~/.claude/ /workspace/.backups/$(date +%Y%m%d)/ 2>/dev/null || true
cp -r ~/.gitconfig /workspace/.backups/$(date +%Y%m%d)/ 2>/dev/null || true

# Commit automático de configuración
cd /workspace
git add .backups/
git commit -m "🔧 Auto-backup configuración $(date)" || true

echo "✅ Backup completado"
EOF

chmod +x /workspace/scripts/backup-config.sh

# Ejecutar backup diario
(crontab -l 2>/dev/null; echo "0 2 * * * /workspace/scripts/backup-config.sh") | crontab -
```

## 🎯 **Configuración recomendada final**

### **Para máxima persistencia:**

1. **Crear con configuración específica:**
   ```bash
   # Comando exacto para crear tu Codespace permanente
   gh codespace create \
     --repo evertweb/forestech \
     --machine 4core \
     --display-name "Forestech-Dev-Permanent" \
     --idle-timeout never \
     --retention-period maximum
   ```

2. **Variables de entorno permanentes:**
   ```bash
   echo 'export CODESPACE_PERMANENT=true' >> ~/.bashrc
   echo 'export AUTO_START_SERVICES=true' >> ~/.bashrc
   echo 'export FORESTECH_ENV=development' >> ~/.bashrc
   ```

3. **Servicios que se auto-inician:**
   - ✅ Keep-alive automático
   - ✅ Firebase emulators
   - ✅ Claude Code configurado
   - ✅ Git auto-fetch
   - ✅ Backup diario automático

## 📊 **Monitoreo de uso**

### **Dashboard de recursos:**
```bash
# Ver uso actual y proyección de costos
./scripts/monitor-resources.sh

# Output incluirá:
# 💰 Costo estimado este mes: $12.50 (dentro de presupuesto Pro)
# ⏰ Horas usadas gratis: 67/180
# 🚀 Horas premium usadas: 15 ($5.40)
```

---

**🏆 Resultado final:** 
Tu Codespace será un entorno de desarrollo permanente y persistente, optimizado para tu GitHub Pro, donde nunca perderás trabajo y siempre tendrás todo configurado exactamente como te gusta.