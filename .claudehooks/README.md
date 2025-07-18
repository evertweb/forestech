# 🎯 Forestech Hook System

Sistema completo de hooks y optimizaciones para aprovechar las nuevas características de Claude Code: **UserPromptSubmit hooks** y **In-memory shell snapshots**.

## 🚀 Características Implementadas

### ✅ **UserPromptSubmit Hook**
- **Validación automática** de sintaxis y patrones
- **Context loading** automático según el prompt
- **Filtros inteligentes** para detectar tipo de tarea
- **Logging mejorado** para trackear patrones de uso

### ✅ **Working Directory Detection**
- **Auto-context switching** entre combustibles/alimentación
- **Configuración específica** por directorio
- **Validaciones contextuales** automáticas

### ✅ **Shell Optimization**
- **In-memory snapshots** para consistencia
- **Builds paralelos** optimizados
- **State tracking** mejorado
- **Performance monitoring**

## 📂 Estructura del Sistema

```
.claudehooks/
├── hook-manager.js           # 🎯 Orquestador principal
├── user-prompt-submit.js     # ⚡ Hook principal de prompt
├── context-switcher.js       # 🔄 Cambio de contexto automático
├── shell-optimizer.js        # 🐚 Optimizador de shell
├── task-classifier.js        # 🔍 Clasificador inteligente
├── pattern-logger.js         # 📊 Logger de patrones
├── directory-validator.js    # 🔒 Validador por directorio
├── logs/                     # 📋 Logs del sistema
└── README.md                 # 📚 Esta documentación
```

## 🎮 Uso

### 🔧 **Setup Inicial**
```bash
cd .claudehooks
node hook-manager.js setup
```

### 🧪 **Testing**
```bash
node hook-manager.js test
```

### 📊 **Generar Reportes**
```bash
node hook-manager.js report
```

### ⚡ **Ejecutar Hook**
```bash
node hook-manager.js execute "crear nueva categoría de vehículo"
```

## 🎯 Hooks Individuales

### 1. **UserPromptSubmit Hook**
```bash
node user-prompt-submit.js "tu prompt aquí"
```

**Características:**
- Detección automática de contexto (combustibles/alimentación)
- Clasificación por tipo de tarea (bug/feature/refactor)
- Validación de sintaxis y patrones
- Sugerencias contextuales

### 2. **Context Switcher**
```bash
node context-switcher.js
```

**Características:**
- Detección automática de directorio
- Configuración específica por app
- Validaciones contextuales
- Setup automático de entorno

### 3. **Shell Optimizer**
```bash
node shell-optimizer.js --parallel-builds
node shell-optimizer.js --check-consistency
```

**Características:**
- Snapshots in-memory del file system
- Builds paralelos (combustibles + alimentación)
- Verificación de consistencia
- Queue inteligente de comandos

### 4. **Task Classifier**
```bash
node task-classifier.js "implementar nueva funcionalidad"
```

**Características:**
- Clasificación automática de tareas
- Detección de complejidad
- Sugerencias de workflow
- Estimación de tiempo

### 5. **Pattern Logger**
```bash
node pattern-logger.js --analyze
node pattern-logger.js --report
```

**Características:**
- Logging inteligente de patrones
- Análisis de tendencias
- Métricas de performance
- Reportes automáticos

### 6. **Directory Validator**
```bash
node directory-validator.js commit
node directory-validator.js --report
```

**Características:**
- Validaciones específicas por directorio
- Reglas de negocio contextuales
- Verificaciones antes de commit
- Prevención de operaciones peligrosas

## 📊 Logging y Métricas

### 📁 **Archivos de Log**
- `logs/usage-patterns.log` - Patrones de uso
- `logs/performance-metrics.log` - Métricas de rendimiento
- `logs/error-patterns.log` - Errores y recuperación
- `logs/context-switches.log` - Cambios de contexto
- `logs/insights-reports.log` - Reportes de insights

### 📈 **Métricas Tracked**
- **Tipos de tarea** más comunes
- **Apps** más utilizadas
- **Complejidad** promedio
- **Tiempo de ejecución**
- **Tasa de éxito**
- **Patrones de error**

## 🎯 Integración con Claude Code

### **Flujo Automático**
1. **Usuario envía prompt** → `UserPromptSubmit` hook se ejecuta
2. **Detección de contexto** → Auto-switch a combustibles/alimentación
3. **Clasificación de tarea** → Bug/Feature/Refactor identificado
4. **Validación** → Reglas específicas por directorio
5. **Optimización** → Shell snapshot si es necesario
6. **Logging** → Patrones y métricas guardados

### **Ventajas**
- ⚡ **Respuestas más rápidas** con contexto precargado
- 🎯 **Mayor precisión** en la clasificación de tareas
- 🔒 **Validaciones preventivas** antes de operaciones
- 📊 **Insights** sobre patrones de uso
- 🚀 **Builds paralelos** optimizados

## 🔧 Configuración

### **hook-config.json**
```json
{
  "enabled": true,
  "verbose": false,
  "timing": true,
  "hooks": {
    "userPromptSubmit": { "enabled": true, "priority": 1 },
    "contextSwitcher": { "enabled": true, "priority": 2 },
    "taskClassifier": { "enabled": true, "priority": 3 },
    "directoryValidator": { "enabled": true, "priority": 4 },
    "shellOptimizer": { "enabled": true, "priority": 5 },
    "patternLogger": { "enabled": true, "priority": 6 }
  }
}
```

## 📋 Casos de Uso

### 🔥 **Combustibles**
- Detección automática cuando estás en `/combustibles`
- Validaciones específicas para categorías de vehículos
- Reglas de negocio para tipos de combustible
- Verificación de integridad Firebase

### 🍽️ **Alimentación**
- Detección automática cuando estás en `/alimentacion`
- Validaciones específicas para empleados y liquidaciones
- Reglas de negocio para salarios y pagos
- Verificación de cálculos matemáticos

### 🔧 **Shared**
- Detección automática cuando estás en `/shared`
- Validaciones para componentes compartidos
- Prevención de breaking changes
- Verificación de APIs públicas

## 🎉 Beneficios

### **Para el Usuario**
- ✅ **Menos errores** con validaciones automáticas
- ⚡ **Respuestas más rápidas** con contexto precargado
- 🎯 **Sugerencias inteligentes** basadas en patrones
- 📊 **Insights** sobre tu productividad

### **Para el Proyecto**
- 🔒 **Mayor robustez** con validaciones preventivas
- 📈 **Mejor performance** con optimizaciones automáticas
- 🧠 **Aprendizaje continuo** con pattern recognition
- 🚀 **Workflows optimizados** basados en datos

## 🔮 Futuras Mejoras

- **AI-powered suggestions** basadas en histórico
- **Auto-completion** de tareas frecuentes
- **Predictive context switching**
- **Real-time collaboration insights**
- **Integration con CI/CD pipelines**

---

**🎯 ¡Sistema completo implementado y listo para aprovechar todas las nuevas características de Claude Code!**