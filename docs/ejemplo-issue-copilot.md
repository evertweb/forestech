di# 🧪 Ejemplo de Issue para GitHub Copilot Agent

## 📋 Issue de Prueba - Componente Button Reutilizable

### Template Aplicado
```markdown
---
name: 🤖 Copilot Agent - Nueva Funcionalidad
about: Template optimizado para implementación con GitHub Copilot Agent
title: '[COPILOT] Crear componente Button reutilizable para shared/'
labels: ['copilot-agent', 'enhancement']
assignees: []
---

## 🎯 Descripción de la Funcionalidad

**Módulo**: [x] Shared

**Funcionalidad**: 
Crear un componente Button reutilizable que pueda ser usado en ambos módulos (alimentación y combustibles) con múltiples variantes de estilo y funcionalidad.

## 📋 Requisitos Técnicos

### Componentes a Crear/Modificar
- [x] **Componente principal**: `shared/components/Button.jsx`
- [x] **Archivo de estilos**: `shared/components/Button.module.css`
- [x] **Archivo de tipos**: `shared/types/Button.js`
- [x] **Test unitario**: `shared/__tests__/Button.test.jsx`

### Integraciones Firebase
- [ ] **Colección**: No aplica
- [ ] **Reglas de seguridad**: No aplica
- [ ] **Índices**: No aplica

## 🎨 Requisitos de Diseño

### Variantes de Botón
- [x] **Primary**: Botón principal azul
- [x] **Secondary**: Botón secundario gris
- [x] **Success**: Botón verde para acciones exitosas
- [x] **Warning**: Botón naranja para advertencias
- [x] **Danger**: Botón rojo para acciones destructivas

### Tamaños
- [x] **Small**: Botón pequeño (sm)
- [x] **Medium**: Botón mediano (md) - default
- [x] **Large**: Botón grande (lg)

### Estados
- [x] **Default**: Estado normal
- [x] **Hover**: Estado al pasar el mouse
- [x] **Active**: Estado al hacer clic
- [x] **Disabled**: Estado deshabilitado
- [x] **Loading**: Estado de carga con spinner

### Responsive Design
- [x] **Mobile**: Optimizado para dispositivos móviles
- [x] **Tablet**: Funcional en tablets
- [x] **Desktop**: Experiencia completa en desktop

## 🔐 Seguridad y Permisos

### Validaciones de Datos
- [x] **Props**: Validación de props con PropTypes
- [x] **Eventos**: Validación de handlers
- [x] **Accessibility**: Atributos ARIA apropiados

## 🧪 Testing

### Tests Requeridos
- [x] **Renderizado**: Componente se renderiza correctamente
- [x] **Variantes**: Todas las variantes funcionan
- [x] **Eventos**: Click handlers funcionan
- [x] **Estados**: Estados disabled/loading funcionan
- [x] **Accessibility**: Tests de accesibilidad

### Casos de Prueba
1. **Caso normal**: Botón básico con texto
2. **Casos variantes**: Todas las variantes y tamaños
3. **Casos eventos**: Click, hover, disabled
4. **Casos loading**: Estado de carga con spinner

## 📊 Criterios de Aceptación

### Funcionalidad
- [x] Componente reutilizable en ambos módulos
- [x] Todas las variantes funcionan correctamente
- [x] Estados de loading y disabled funcionan
- [x] Eventos de click se propagan correctamente

### Calidad de Código
- [x] Sigue patrones TailwindCSS
- [x] Código bien documentado con JSDoc
- [x] Props tipadas correctamente
- [x] Tests con cobertura 100%

### Performance
- [x] Componente liviano y rápido
- [x] No re-renders innecesarios
- [x] Lazy loading no necesario

## 🚀 Contexto Adicional

### Archivos de Referencia
- `alimentacion/src/components/` - Componentes existentes
- `combustibles/src/components/` - Componentes existentes
- `shared/` - Estructura actual

### Ejemplo de Uso Esperado
```jsx
// Uso básico
<Button variant="primary" size="md">
  Guardar
</Button>

// Con loading
<Button variant="primary" loading={isLoading} disabled={isLoading}>
  {isLoading ? 'Guardando...' : 'Guardar'}
</Button>

// Con evento
<Button variant="danger" onClick={handleDelete}>
  Eliminar
</Button>
```

---

## 📝 Instrucciones para Copilot Agent

@github-copilot Por favor implementa este componente siguiendo:

1. **Patrones**: Usar patrones definidos en `.github/copilot/custom_instructions.md`
2. **Estructura**: Crear en `shared/components/Button.jsx`
3. **Estilos**: Usar TailwindCSS con variantes responsivas
4. **Testing**: Crear tests unitarios completos
5. **Documentación**: JSDoc para todas las props y métodos

**Archivos importantes a revisar**:
- `CLAUDE.md`: Documentación del proyecto
- `shared/`: Estructura actual
- Ejemplos en `combustibles/src/components/` y `alimentacion/src/components/`
```

## 🎯 Resultado Esperado

### Archivos Creados
1. **`shared/components/Button.jsx`** - Componente principal
2. **`shared/components/Button.module.css`** - Estilos (si es necesario)
3. **`shared/types/Button.js`** - Tipos y PropTypes
4. **`shared/__tests__/Button.test.jsx`** - Tests unitarios
5. **`shared/components/index.js`** - Exportación del componente

### Funcionalidades Implementadas
- ✅ Múltiples variantes de color
- ✅ Múltiples tamaños
- ✅ Estados (disabled, loading, hover)
- ✅ Accesibilidad completa
- ✅ Responsive design
- ✅ Tests unitarios
- ✅ Documentación JSDoc

### Integración
- ✅ Importable desde `shared/components`
- ✅ Usable en alimentación y combustibles
- ✅ Siguiendo patrones establecidos
- ✅ Compatible con TailwindCSS

---

## 🔄 Siguientes Pasos

### 1. Crear Issue en GitHub
```bash
# Ir a GitHub → Issues → New Issue
# Seleccionar template: "🤖 Copilot Agent - Nueva Funcionalidad"
# Copiar contenido del ejemplo
# Asignar a @github-copilot
```

### 2. Monitorear Progreso
```bash
# Ver Pull Request generado por Copilot
# Revisar implementación
# Validar tests
# Aprobar y mergear
```

### 3. Validar Resultado
```bash
# Importar en componente existente
# Verificar funcionalidad
# Validar integración
```

---

**Próximo experimento**: Issue más complejo con integración Firebase