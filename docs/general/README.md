# 📋 GENERAL - Configuración Global Monorepo

## Estado Actual: CONFIGURADO Y OPERATIVO (2025)

```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones ✅ FUNCIONAL
├── combustibles/               # ⛽ App gestión combustibles ✅ FUNCIONAL
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Configuración hosting multi-app
├── firestore.rules            # Reglas seguridad
└── package.json               # Scripts monorepo
```

## URLs Operativas

- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

## Scripts Monorepo

```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Build
npm run build:alimentacion
npm run build:combustibles  
npm run build:all           # Build ambas apps

# Linting
npm run lint:alimentacion
npm run lint:combustibles

# Deploy
npm run deploy              # Deploy automático Firebase
```

## Configuración Firebase

### Multi-App Hosting
```json
{
  "rewrites": [
    {
      "source": "/alimentacion/**",
      "destination": "/alimentacion/index.html"
    },
    {
      "source": "/combustibles/**", 
      "destination": "/combustibles/index.html"
    }
  ]
}
```

### Servicios Activos
- **Authentication**: Email/Password + Google OAuth
- **Firestore**: Base datos con reglas seguridad
- **Storage**: Subida archivos (logos, firmas)
- **Analytics**: Eventos personalizados
- **Performance**: Monitoreo tiempo real
- **Cloud Messaging**: Push notifications
- **Hosting**: Multi-app con dominio personalizado

## GitHub Actions - Deploy Automático

### Proceso Automatizado
1. **Push a main** → Trigger automático
2. **Install dependencies** → Monorepo completo + sub-apps
3. **Auto-fix React Hooks** → Corrección automática warnings
4. **Lint** → Alimentación + Combustibles
5. **Build** → Ambas aplicaciones
6. **Deploy Firebase** → Hosting automático
7. **URLs actualizadas** → Producción en vivo

### Comandos para Desarrolladores
```bash
# ✅ ÚNICOS COMANDOS NECESARIOS
git add .
git commit -m "descripción cambios"
git push origin main
# GitHub Actions maneja todo lo demás automáticamente
```

## Dominio Personalizado

- **Dominio**: forestechdecolombia.com.co
- **Configuración**: DNS apunta a Firebase Hosting
- **Escalabilidad**: Nuevas apps se agregan sin configuración DNS adicional

## Escalabilidad

Para agregar nuevas aplicaciones al monorepo:
1. Crear carpeta nueva app
2. Agregar regla en `firebase.json`
3. Actualizar scripts en `package.json`
4. Deploy automático con GitHub Actions
5. Nueva URL disponible instantáneamente

---

**Última actualización**: Julio 2025 - Sistema completo operativo