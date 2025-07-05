# GEMINI.md

Este documento sirve como referencia interna para Gemini CLI al interactuar con el monorepo `forestech`.
Se basa en la documentación `CLAUDE.md` para asegurar una comprensión consistente del proyecto.

## 🎯 **CONTEXTO DEL PROYECTO**

El monorepo `forestech` contiene las siguientes aplicaciones principales:

- **🍽️ ALIMENTACION**: Aplicación de liquidaciones de comidas (`forestech/alimentacion/src/...`)
- **⛽ COMBUSTIBLES**: Aplicación de gestión de combustibles (`forestech/combustibles/src/...`)
- **🔧 SHARED**: Recursos compartidos entre aplicaciones (`forestech/shared/...`)
- **📋 GENERAL**: Configuración global del monorepo (Firebase, hosting, scripts)

## 🧠 **ENFOQUE DE ANÁLISIS Y PLANIFICACIÓN (Pensamiento Paso a Paso)**

Para cada tarea o consulta, seguiré un proceso de análisis estructurado:

1.  **🎯 CONTEXTO FORESTECH**: Identificar el módulo afectado (ALIMENTACION/COMBUSTIBLES/SHARED/GENERAL) y su impacto.
2.  **📊 ANÁLISIS CUANTITATIVO**: Considerar métricas, datos medibles y el impacto en el rendimiento.
3.  **🔧 EVALUACIÓN TÉCNICA**: Analizar la arquitectura, patrones de código existentes, dependencias y compatibilidad.
4.  **⚖️ ESCENARIOS MÚLTIPLES**: Evaluar diferentes enfoques, sus pros y contras, y la complejidad.
5.  **🚨 ANÁLISIS RIESGO-BENEFICIO**: Identificar posibles fallos, impacto en usuarios y reversibilidad.
6.  **💡 RECOMENDACIÓN JUSTIFICADA**: Proponer una solución basada en el análisis, con pasos de implementación y métricas de éxito.

## 📚 **ESTRUCTURA DE DOCUMENTACIÓN MODULAR**

La documentación detallada del proyecto se encuentra organizada modularmente en el directorio `docs/`:

-   **🍽️ ALIMENTACION**: `docs/alimentacion/README.md`
-   **⛽ COMBUSTIBLES**: `docs/combustibles/README.md`
-   **🔧 SHARED**: `docs/shared/README.md`
-   **📋 GENERAL**: `docs/general/README.md`
-   **🏢 EMPRESARIAL**: `docs/empresarial/README.md` (Incluye manuales de usuario y SOPs)

## **ESTRUCTURA DEL MONOREPO**

```
forestech/
├── alimentacion/               # App liquidaciones
├── combustibles/               # App combustibles
├── shared/                     # Recursos compartidos
├── docs/                       # Documentación modular
├── public/                     # Build output Firebase
├── firebase.json               # Multi-app routing
└── package.json               # Scripts monorepo
```

## **COMANDOS ESENCIALES**

-   **Desarrollo**:
    -   `npm run dev:alimentacion` (Puerto 5173)
    -   `npm run dev:combustibles` (Puerto 5174)
-   **Build**:
    -   `npm run build:all` (Build ambas apps)
-   **Linting**:
    -   `npm run lint:alimentacion`
    -   `npm run lint:combustibles`

## **URLS ACTIVAS**

-   **Alimentación**: `https://forestechdecolombia.com.co/alimentacion/`
-   **Combustibles**: `https://forestechdecolombia.com.co/combustibles/`
-   **Firebase**: `https://liquidacionapp-62962.web.app/`

## 🚀 **MEJORES PRÁCTICAS Y FLUJO DE TRABAJO**

-   **Máxima Eficiencia**: Siempre que sea posible, realizar operaciones múltiples e independientes de forma simultánea.
-   **Flujo de Trabajo Obligatorio**:
    1.  `TodoWrite` para tareas complejas (3+ pasos).
    2.  Búsqueda de contexto antes de implementar.
    3.  Anuncio del plan antes de ejecutar.
    4.  Operaciones simultáneas (uso de múltiples herramientas/MCPs en paralelo).
    5.  **SOLO `git commit + git push`**: GitHub Actions se encarga automáticamente del build y deploy.
-   **Deploy Automático**: GitHub Actions maneja la instalación de dependencias, auto-fix de lint, linting, build y despliegue a Firebase.
-   **Optimización de Tokens Git**: Utilizar comandos Git compactos para reducir el consumo de tokens (ej. `git status --porcelain`, `git diff --name-only`, `git log --oneline -3`).
-   **Comunicación Proactiva**: Informar sobre el progreso, decisiones técnicas y archivos modificados.

## 🎯 **ESTADO ACTUAL DEL PROYECTO (Julio 2025)**

-   **Aplicaciones Funcionales**: Alimentación y Combustibles están 100% funcionales.
-   **Calidad del Código**: Se han resuelto errores críticos de compilación y todos los problemas de ESLint en la aplicación `combustibles`, mejorando su estabilidad y mantenibilidad.
-   **Infraestructura**: Firebase multi-app hosting, dominio operativo, CI/CD con GitHub Actions.
-   **MCPs (Capacidades de Gemini)**:
    -   **Acceso a Archivos**: Nativo (lectura, escritura, búsqueda, listado).
    -   **Memoria Persistente**: Nativo (`save_memory`).
    -   **Pensamiento Secuencial**: Nativo (parte integral de mi operación).
    -   **Notion**: Puede ser invocado bajo demanda (`run_shell_command`) si se proporcionan las credenciales y el comando de inicio del servidor MCP de Notion.
    -   Otras herramientas como `google_web_search` están disponibles para ampliar mis capacidades.

## 📜 **HISTORIAL DE CAMBIOS RECIENTES**

-   **04/07/2025**:
    -   **fix(combustibles)**: Se solucionó un error de `crypto.hash` que impedía iniciar el servidor de desarrollo local (`npm run dev`). La solución consistió en limpiar y reinstalar las dependencias (`node_modules`, `package-lock.json`) para resolver inconsistencias.
    -   **fix(combustibles)**: Se corrigió un bug de pérdida de estado en el `MovementWizard` que causaba un error al crear movimientos. Se refactorizó la lógica de reseteo del formulario para garantizar la integridad del estado.
    -   **feat(combustibles)**: Se mejoró la UX del `MovementWizard` ajustando la posición de los botones de navegación para que estuvieran más cerca del formulario.
    -   **fix(combustibles)**: Se corrigieron errores de compilación en los componentes `Step7_Details.jsx` y `Step8_Summary.jsx` del asistente de movimientos.
    -   **refactor(combustibles)**: Se solucionaron todos los errores de ESLint en el `MovementWizard` y sus pasos.

---

**📌 IMPORTANTE**: Este documento se mantendrá actualizado con la información más relevante para mi operación.