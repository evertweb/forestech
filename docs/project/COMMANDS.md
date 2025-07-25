# ⚙️ **COMANDOS Y DESARROLLO**

## 🚀 **Comandos Esenciales**

### 💻 **Desarrollo Local**
```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Linting (REQUERIDO antes de commit)
npm run lint:alimentacion
npm run lint:combustibles

# Deploy automático con GitHub Actions
git add .
git commit -m "descripción cambios"
git push origin main
```

## 🌐 **URLs Activas**

- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

## 🔍 **Testing PRs con GitHub CLI**

```bash
# Flujo para analizar PRs antes de merge
gh pr list                    # Ver PRs disponibles
gh pr checkout [NUMERO]      # Descargar PR para testing local
npm run dev                  # Probar funcionamiento  
gh pr merge [NUMERO] --merge --delete-branch
```

## 🛠️ **Scripts Disponibles**

### 📦 **Package.json Scripts**
- `dev:alimentacion` - Servidor desarrollo alimentación
- `dev:combustibles` - Servidor desarrollo combustibles  
- `build:alimentacion` - Build producción alimentación
- `build:combustibles` - Build producción combustibles
- `lint:alimentacion` - Linting alimentación
- `lint:combustibles` - Linting combustibles

### 🔧 **Utilidades**
- `npm run preview` - Preview builds localmente
- `npm run clean` - Limpiar node_modules y builds
- `npm run check-deps` - Verificar dependencias

---

**📌 Última actualización: Julio 2025**