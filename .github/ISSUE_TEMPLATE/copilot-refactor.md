o---
name: 🔄 Copilot Agent - Refactoring
about: Template optimizado para tareas de refactoring con GitHub Copilot Agent
title: '[COPILOT-REFACTOR] '
labels: ['copilot-agent', 'refactor']
assignees: []
---

## 🔄 Descripción del Refactoring

**Módulo**: [ ] Combustibles | [ ] Alimentación | [ ] Shared | [ ] General

**Objetivo**: 
<!-- Descripción clara del objetivo del refactoring -->

### Problema Actual
<!-- Qué necesita ser mejorado -->

### Estado Deseado
<!-- Cómo debería quedar después del refactoring -->

## 📁 Archivos Afectados

### Archivos Principales
- [ ] **Componente**: `src/components/NombreComponente.jsx`
- [ ] **Hook**: `src/hooks/useNombreHook.js`
- [ ] **Servicio**: `src/services/nombreServicio.js`
- [ ] **Utilidad**: `src/utils/nombreUtilidad.js`

### Archivos Relacionados
- [ ] **Tests**: `src/__tests__/NombreComponente.test.jsx`
- [ ] **Tipos**: `src/types/nombreTipo.js`
- [ ] **Configuración**: `src/config/nombreConfig.js`

## 🎯 Tipo de Refactoring

### Categoría
- [ ] **Extracción**: Crear nuevos componentes/hooks
- [ ] **Consolidación**: Unificar código duplicado
- [ ] **Optimización**: Mejorar performance
- [ ] **Modernización**: Actualizar a patrones modernos
- [ ] **Separación**: Dividir responsabilidades

### Técnicas a Aplicar
- [ ] **Custom Hooks**: Extraer lógica a hooks
- [ ] **Componentes**: Dividir en componentes más pequeños
- [ ] **Servicios**: Centralizar lógica de negocio
- [ ] **Utilidades**: Crear funciones reutilizables

## 🏗️ Plan de Refactoring

### Fase 1: Análisis
- [ ] **Analizar**: Código existente y dependencias
- [ ] **Identificar**: Patrones y código duplicado
- [ ] **Mapear**: Relaciones entre componentes
- [ ] **Documentar**: Funcionalidad actual

### Fase 2: Diseño
- [ ] **Diseñar**: Nueva estructura
- [ ] **Definir**: Interfaces y contratos
- [ ] **Planificar**: Orden de implementación
- [ ] **Validar**: Compatibilidad con código existente

### Fase 3: Implementación
- [ ] **Crear**: Nuevos archivos y estructuras
- [ ] **Migrar**: Lógica existente
- [ ] **Actualizar**: Referencias y importaciones
- [ ] **Limpiar**: Código obsoleto

### Fase 4: Validación
- [ ] **Probar**: Funcionalidad completa
- [ ] **Verificar**: Performance
- [ ] **Validar**: Compatibilidad
- [ ] **Documentar**: Cambios realizados

## 📊 Métricas de Éxito

### Calidad de Código
- [ ] **Reducción**: Código duplicado eliminado
- [ ] **Modularidad**: Componentes más pequeños y focalizados
- [ ] **Reutilización**: Código más reutilizable
- [ ] **Mantenibilidad**: Código más fácil de mantener

### Performance
- [ ] **Rendimiento**: Mejora en tiempo de carga
- [ ] **Memoria**: Uso eficiente de memoria
- [ ] **Bundle**: Reducción de tamaño de bundle
- [ ] **Renders**: Optimización de re-renders

## 🔐 Consideraciones de Seguridad

### Validaciones
- [ ] **Mantener**: Validaciones de permisos existentes
- [ ] **Preservar**: Reglas de seguridad Firebase
- [ ] **Verificar**: Sanitización de datos
- [ ] **Validar**: Autenticación y autorización

## 🧪 Testing

### Tests Existentes
- [ ] **Mantener**: Tests unitarios existentes
- [ ] **Actualizar**: Tests afectados por cambios
- [ ] **Migrar**: Tests a nueva estructura
- [ ] **Validar**: Cobertura de tests

### Nuevos Tests
- [ ] **Crear**: Tests para nuevos componentes
- [ ] **Probar**: Integración entre componentes
- [ ] **Validar**: Casos límite
- [ ] **Verificar**: Performance tests

## 📋 Criterios de Aceptación

### Funcionalidad
- [ ] **Mantener**: Toda la funcionalidad existente
- [ ] **Preservar**: Comportamiento de la interfaz
- [ ] **Conservar**: Integración con Firebase
- [ ] **Validar**: Flujos de usuario completos

### Calidad
- [ ] **Seguir**: Patrones establecidos en custom_instructions.md
- [ ] **Mantener**: Consistencia con código existente
- [ ] **Mejorar**: Legibilidad y mantenibilidad
- [ ] **Documentar**: Cambios significativos

### Performance
- [ ] **Mantener**: Performance actual o mejorarla
- [ ] **Optimizar**: Queries Firebase si es necesario
- [ ] **Verificar**: Tiempo de carga de componentes
- [ ] **Validar**: Uso eficiente de recursos

## 🚀 Contexto Adicional

### Motivación
<!-- Por qué es necesario este refactoring -->

### Beneficios Esperados
<!-- Qué beneficios se esperan obtener -->

### Riesgos
<!-- Qué riesgos hay que considerar -->

### Dependencias
<!-- Qué otros cambios dependen de este refactoring -->

---

## 📝 Instrucciones para Copilot Agent

@github-copilot Por favor realiza este refactoring siguiendo:

1. **Análisis**: Entender código existente y dependencias
2. **Planificación**: Seguir el plan de refactoring descrito
3. **Implementación**: Aplicar cambios preservando funcionalidad
4. **Testing**: Verificar que todo funciona correctamente
5. **Limpieza**: Eliminar código obsoleto y actualizar documentación

**Archivos importantes a revisar**:
- `.github/copilot/custom_instructions.md`: Patrones a seguir
- `CLAUDE.md`: Documentación del proyecto
- Archivos mencionados en la sección de archivos afectados

**Principios importantes**:
- Mantener compatibilidad con código existente
- Seguir patrones establecidos
- Preservar funcionalidad existente
- Mejorar mantenibilidad y reutilización