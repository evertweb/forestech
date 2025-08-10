# Popups de Movement Wizard

Este directorio contiene el gestor de ventanas emergentes para abrir el formulario `MovementWizard` en una pestaña/ventana externa con comunicación bidireccional.

Componentes/servicios:

- PopupManager.js: abre y administra la vida del popup (centrado, fullscreen móvil, cierre inesperado, focus, envío INIT cuando el popup avisa READY).
- MovementWizardPopup.jsx: wrapper de la ruta `/movement-wizard-popup` que espera el INIT desde el parent y luego monta el wizard.

Protocolo de mensajería (`window.postMessage`):

- Parent → Popup: `INIT_WIZARD` con payload `{user, inventory, vehicles, suppliers, theme}`.
- Popup → Parent: `WIZARD_SUCCESS | WIZARD_CANCEL | WIZARD_ERROR`.

Seguridad:

- Validación de `origin` (mismo dominio).
- Sanitización básica de payload de INIT.

UX:

- Fallback automático al wizard integrado si el popup está bloqueado.
- Estado "Abriendo formulario..." y botón "Reintentar popup".
- Atajo Ctrl+Shift+N para abrir.
