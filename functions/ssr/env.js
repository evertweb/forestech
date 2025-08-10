export function ensureEnv() {
  const required = ['FIREBASE_PROJECT_ID'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    // Loguea advertencia, no falla en Fase 0
    console.warn(`[SSR] Variables faltantes: ${missing.join(', ')}`);
  }
}
