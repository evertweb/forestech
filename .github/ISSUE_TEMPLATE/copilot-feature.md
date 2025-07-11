---
name: 🤖 Copilot Agent - Nueva Funcionalidad
about: Template optimizado para implementación con GitHub Copilot Agent
title: '[COPILOT] '
labels: ['copilot-agent', 'enhancement']
assignees: []
---

## 🎯 Descripción de la Funcionalidad

**Módulo**: [ ] Combustibles | [ ] Alimentación | [ ] Shared | [ ] General

**Funcionalidad**: 
<!-- Descripción clara y concisa de la funcionalidad a implementar -->

## 📋 Requisitos Técnicos

### Componentes a Crear/Modificar
- [ ] **Componente principal**: `src/components/NombreComponente.jsx`
- [ ] **Hook personalizado**: `src/hooks/useNombreHook.js`
- [ ] **Servicio Firebase**: `src/services/nombreServicio.js`
- [ ] **Utilidades**: `src/utils/nombreUtilidad.js`

### Integraciones Firebase
- [ ] **Colección**: `nombre_coleccion`
- [ ] **Reglas de seguridad**: Actualizar firestore.rules
- [ ] **Índices**: Actualizar firestore.indexes.json

## 🎨 Requisitos de Diseño

### Responsive Design
- [ ] **Mobile**: Optimizado para dispositivos móviles
- [ ] **Tablet**: Funcional en tablets
- [ ] **Desktop**: Experiencia completa en desktop

### Componentes UI
- [ ] **Botones**: Usar componentes Button existentes
- [ ] **Inputs**: Usar componentes Input con validación
- [ ] **Cards**: Usar componentes Card para layout
- [ ] **Modals**: Usar componentes Modal si es necesario

## 🔐 Seguridad y Permisos

### Validaciones de Roles
- [ ] **Admin**: Acceso completo
- [ ] **Operator**: Acceso limitado
- [ ] **Viewer**: Solo lectura

### Validaciones de Datos
- [ ] **Frontend**: Validación con React Hook Form + Zod
- [ ] **Backend**: Validación en reglas Firestore
- [ ] **Sanitización**: Limpiar datos de entrada

## 🧪 Testing

### Tests Requeridos
- [ ] **Unit Tests**: Componentes individuales
- [ ] **Integration Tests**: Flujo completo
- [ ] **Firebase Tests**: Operaciones de base de datos

### Casos de Prueba
1. **Caso normal**: Funcionalidad básica
2. **Casos límite**: Validaciones extremas
3. **Casos de error**: Manejo de errores

## 📊 Criterios de Aceptación

### Funcionalidad
- [ ] La funcionalidad cumple con los requisitos especificados
- [ ] Interfaz responsive en todos los dispositivos
- [ ] Manejo adecuado de estados de carga y error
- [ ] Validaciones completas en frontend y backend

### Calidad de Código
- [ ] Sigue patrones establecidos en custom_instructions.md
- [ ] Componentes reutilizables y modulares
- [ ] Código bien documentado
- [ ] Tests con cobertura adecuada

### Performance
- [ ] Carga rápida de componentes
- [ ] Optimización de consultas Firebase
- [ ] Lazy loading donde sea necesario

## 🚀 Contexto Adicional

### Archivos de Referencia
<!-- Mencionar archivos existentes que sirvan como referencia -->

### Dependencias
<!-- Listar nuevas dependencias si son necesarias -->

### Notas Técnicas
<!-- Cualquier consideración técnica específica -->

---

## 📝 Instrucciones para Copilot Agent

@github-copilot Por favor implementa esta funcionalidad siguiendo:

1. **Patrones**: Usar patrones definidos en `.github/copilot/custom_instructions.md`
2. **Estructura**: Seguir estructura de archivos del monorepo
3. **Estilos**: Usar TailwindCSS con clases responsive
4. **Firebase**: Implementar operaciones con manejo de errores
5. **Testing**: Crear tests unitarios básicos
6. **Documentación**: Comentar código complejo

**Archivos importantes a revisar**:
- `CLAUDE.md`: Documentación del proyecto
- `shared/`: Componentes reutilizables
- Ejemplos en `combustibles/src/` y `alimentacion/src/`