## Análisis del Proyecto Forestech

Este es un análisis del proyecto `forestech` realizado por Gemini.

### Resumen del Proyecto

- **Nombre:** forestech
- **Estructura:** Monorepo que contiene múltiples aplicaciones web (actualmente `alimentacion` y `combustibles`).
- **Tecnologías Clave:** React, Vite, Firebase (Auth, Firestore, Storage), Chart.js.
- **Framework/Estilo:** Aplicaciones React funcionales con Hooks y Context para la gestión del estado.

### Convenciones de Código

- **Commits:** Se sigue la especificación de "Conventional Commits". Los commits deben tener un tipo (`feat`, `fix`, `docs`, `refactor`, etc.) y un mensaje descriptivo.
- **Autoría de IA:** Cuando un commit es generado por una IA, el mensaje debe indicar el agente utilizado (ej. "feat(combustibles): ... (hecho con gemini cli)").
- **Estructura de Módulos:** El código se organiza por funcionalidad, separando la lógica de la interfaz de usuario (UI) de los servicios de datos y la configuración.
  - `components/`: Componentes de React.
  - `services/`: Lógica de negocio y comunicación con APIs/Firebase.
  - `firebase/`: Configuración específica de Firebase.
  - `utils/`: Funciones de utilidad.
  - `contexts/`: Contextos de React para el estado global.
- **Linting:** Se utiliza ESLint para mantener la calidad y consistencia del código.

### Áreas de Mejora Identificadas

1.  **Centralización de Código:** Existe una duplicación significativa de código (constantes, servicios de Firebase, utilidades) entre los subproyectos. Se debe hacer un esfuerzo para mover toda la lógica compartida al directorio `/shared` y configurar las rutas de importación para eliminar la redundancia.
2.  **Gestión del Monorepo:** Considerar la adopción de `npm workspaces` para gestionar las dependencias y los scripts de forma centralizada. Esto mejoraría la mantenibilidad y reduciría la duplicación de paquetes.
3.  **Consistencia de Nomenclatura:** El proyecto de Firebase (`liquidacionapp-62962`) tiene un nombre diferente al del repositorio (`forestech`). Se recomienda alinear estos nombres si es posible.

### Notas Adicionales

- El usuario prefiere que me comunique en español.
- El usuario prefiere que modifique solo la lógica y evite cambios visuales a menos que sean estrictamente necesarios o solicitados.
- Después de cada modificación (arreglo, implementación, etc.), debo realizar un commit inmediatamente. El mensaje del commit debe ser muy detallado y seguir la regla de autoría.
