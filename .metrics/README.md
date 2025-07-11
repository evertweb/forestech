# 📊 Sistema de Métricas Auto-Fix

Este directorio contiene el sistema de métricas y feedback inteligente para los auto-fixes del proyecto Forestech.

## 📋 Estructura

```
.metrics/
├── auto-fix-metrics.json     # Métricas históricas (gitignored)
├── reports/                  # Reportes generados (gitignored)
│   └── report-YYYY-MM-DD.md
└── README.md                 # Esta documentación
```

## 🔧 Funcionamiento

### Recolección Automática
- Las métricas se recolectan automáticamente en cada ejecución de `fix-all-issues.js`
- Se registran estadísticas por fixer: archivos modificados, tipos de errores, timestamps
- Se almacenan en `auto-fix-metrics.json` para análisis histórico

### Análisis Inteligente
- **Detección de patrones**: Identifica archivos con errores recurrentes
- **Análisis temporal**: Tendencias y horarios pico de ejecución
- **Recomendaciones automáticas**: Sugerencias basadas en patrones detectados

### Reportes
- Generación automática de reportes en Markdown
- Análisis por fixer individual y consolidado
- Recomendaciones de mejora categorizadas por prioridad

## 📈 Métricas Recolectadas

### Por Ejecución
- Timestamp y duración
- Fixer ejecutado
- Archivos modificados
- Estadísticas específicas del fixer
- Contexto del entorno (CI, rama, commit)

### Análisis Agregado
- Tendencias por fixer
- Archivos más problemáticos
- Eficiencia del sistema
- Patrones temporales

## 🎯 Beneficios

1. **Visibilidad**: Insight completo del sistema de auto-fix
2. **Optimización**: Identificación de oportunidades de mejora
3. **Prevención**: Detección temprana de problemas recurrentes
4. **Automatización**: Recomendaciones automáticas de mejoras

## 🚀 Uso

### Manual
```bash
# Generar reporte de métricas
node scripts/metrics-collector.js
```

### Automático
Las métricas se generan automáticamente cuando:
- Se ejecuta `fix-all-issues.js`
- Hay cambios significativos en el código
- Se ejecuta el workflow de GitHub Actions

## 🔒 Privacidad

- Los archivos de métricas están en `.gitignore`
- Solo se almacenan paths de archivos y estadísticas
- No se almacena contenido de código sensible
- Los reportes son para análisis local únicamente

---
**Sistema implementado como parte del proyecto Claude Code + GitHub Copilot Agent**