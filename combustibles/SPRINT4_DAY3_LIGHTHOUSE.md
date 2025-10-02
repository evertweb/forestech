# Lighthouse Audit - Día 3 (Post Runtime Optimizations)

**Fecha:** 02/10/2025  
**URL:** http://localhost:4173/

> ⚠️ La ejecución automática con Lighthouse CLI terminó con el error `NO_FCP` (la página no pintó contenido antes del timeout). Se generaron reportes HTML/JSON para depuración, pero no contienen métricas válidas. Se recomienda repetir la auditoría en un entorno con navegador visible (Chrome estable) una vez que el build esté servido manualmente.

## Scores

| Categoría | Score | Comparación Día 1 | Mejora |
|-----------|-------|-------------------|--------|
| Performance | N/A | 65-70 (estimado) | N/A |
| Accessibility | N/A | 85-90 (estimado) | N/A |
| Best Practices | N/A | 80-85 (estimado) | N/A |
| SEO | N/A | 90-95 (estimado) | N/A |

## Core Web Vitals

| Métrica | Valor | Target | Estado |
|---------|-------|--------|--------|
| LCP (Largest Contentful Paint) | N/A | <2.5s | ❌|
| FID (First Input Delay) | N/A | <100ms | ❌|
| CLS (Cumulative Layout Shift) | N/A | <0.1 | ❌|
| FCP (First Contentful Paint) | N/A | <1.8s | ❌|
| TTI (Time to Interactive) | N/A | <3.8s | ❌|

## Oportunidades Principales

1. Auditoría no completada: Lighthouse reportó `NO_FCP`. Verificar que el servidor local responda y que la app pinte contenido inicial sin depender de interacciones.
2. Validar que la build sirva recursos estáticos (`assets/*.js`) sin bloqueos CORS ni errores de inicialización.
3. Repetir la prueba con `npm run preview --workspace=combustibles` (o servidor estático equivalente) y Chrome visible para confirmar que no exista gating por pop-ups o prompts.

## Diagnósticos

1. El runtime error `NO_FCP` indica que la aplicación no generó un primer pintado antes de que Lighthouse expira. Revisar el log `combustibles/lighthouse-day3-desktop.report.json` para más detalles.
2. Posible causa: dependencias a Firebase/Auth que requieren interacción o credenciales antes de renderizar shell inicial.
3. Comprobar en manual que la pantalla de login renderiza correctamente en modo producción (`public/combustibles/index.html`) y que no haya errores JavaScript bloqueantes.

## Comparación con Baseline

No se pudo comparar métricas porque la auditoría no devolvió valores cuantitativos. Mantener como referencia los estimados del Día 1 y repetir la medición cuando se disponga de resultados válidos.

## Próximos Pasos

- Repetir la auditoría en un entorno local con Chrome visible (modo no-headless) para confirmar los puntajes después de las optimizaciones de estado y memoización.
- Si el error persiste, revisar el log de consola del navegador para detectar excepciones que impidan el render inicial (especialmente componentes de autenticación).
- Capturar los resultados válidos y actualizar este reporte, comparando contra el baseline documentado del Sprint 4 Día 1.
