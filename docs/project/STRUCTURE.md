# 🏗️ **ESTRUCTURA MONOREPO FORESTECH**

## 📂 **Arquitectura General**

```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones ✅ FUNCIONAL
├── combustibles/               # ⛽ App combustibles ✅ FUNCIONAL
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Multi-app routing
└── package.json               # Scripts monorepo
```

## 📖 **Apps y Documentación**

### 🍽️ **ALIMENTACION**
- **Función**: Sistema liquidaciones completo
- **Estado**: 100% funcional
- **Documentación**: [docs/alimentacion/](../alimentacion/README.md)
- **Archivos**: `forestech/alimentacion/src/...`

### ⛽ **COMBUSTIBLES** 
- **Función**: Sistema completo + módulo reportes
- **Estado**: 100% funcional 
- **Documentación**: [docs/combustibles/](../combustibles/README.md)
- **Archivos**: `forestech/combustibles/src/...`

### 🔧 **SHARED**
- **Función**: Recursos compartidos entre apps
- **Documentación**: [docs/shared/](../shared/README.md)
- **Archivos**: `forestech/shared/...`

### 🏢 **EMPRESARIAL**
- **Función**: Manuales y SOPs
- **Documentación**: [docs/empresarial/](../empresarial/README.md)

## 🎯 **Contextos de Trabajo**

- **[ALIMENTACION]**: Archivos en `forestech/alimentacion/src/...`
- **[COMBUSTIBLES]**: Archivos en `forestech/combustibles/src/...` 
- **[SHARED]**: Archivos en `forestech/shared/...`
- **[GENERAL]**: Configuración Firebase, hosting, documentación

---

**📌 Última actualización: Julio 2025**