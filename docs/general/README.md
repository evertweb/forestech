# 📋 GENERAL - Configuración Global Monorepo

## Estructura Monorepo Forestech

```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones
├── combustibles/               # ⛽ App gestión combustibles
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Configuración hosting
├── firestore.rules            # Reglas seguridad
└── package.json               # Scripts monorepo
```

## Configuración Firebase Hosting

### Multi-App Routing
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

### URLs Operativas
- 🍽️ **Alimentación**: `https://forestechdecolombia.com.co/alimentacion/`
- ⛽ **Combustibles**: `https://forestechdecolombia.com.co/combustibles/`
- 📋 **Firebase**: `https://liquidacionapp-62962.web.app/[app]/`

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

## Configuración DNS

### Dominio Personalizado (Configurado)
```
Namecheap DNS: forestechdecolombia.com.co → liquidacionapp-62962.web.app
Firebase: Maneja routing automático por rutas
```

### Escalabilidad Sin DNS Adicional
Para nuevas apps (nomina, inventario):
1. Agregar regla en `firebase.json`
2. `firebase deploy`
3. **Nueva URL funciona automáticamente**

## Servicios Firebase Activos

- **Authentication**: Email/Password + Google OAuth
- **Firestore**: Base datos con reglas seguridad
- **Storage**: Subida archivos (logos, firmas)
- **Analytics**: Eventos personalizados
- **Performance**: Monitoreo tiempo real
- **Cloud Messaging**: Push notifications
- **Hosting**: Multi-app con dominio personalizado

## Reglas de Seguridad Firestore

```javascript
// Acceso por roles
allow read, write: if request.auth != null 
  && resource.data.userId == request.auth.uid;

// Admin full access
allow read, write: if request.auth != null 
  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

Ver más detalles en:
- [Monorepo](./monorepo.md)
- [Hosting](./hosting.md)
- [Mejores Prácticas](./best-practices.md)