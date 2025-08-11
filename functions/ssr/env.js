export function ensureEnv() {
  // En producción, usar variables del proyecto Firebase automáticamente
  if (!process.env.FIREBASE_PROJECT_ID && process.env.GCLOUD_PROJECT) {
    process.env.FIREBASE_PROJECT_ID = process.env.GCLOUD_PROJECT;
  }
  
  if (!process.env.FIREBASE_DEFAULT_REGION) {
    process.env.FIREBASE_DEFAULT_REGION = 'us-central1';
  }
  
  const required = ['FIREBASE_PROJECT_ID'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    // Loguea advertencia, no falla en Fase 0
    console.warn(`[SSR] Variables faltantes: ${missing.join(', ')}`);
  }
}
