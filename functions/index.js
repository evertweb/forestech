import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ssrHandler, healthHandler } from './ssr/server.js';
import { ensureEnv } from './ssr/env.js';

ensureEnv();

const app = express();

// Health endpoint para validar emulador/deploy
app.get('/combustibles/ssr-health', healthHandler);
app.get('/combustibles/*', ssrHandler);

export const ssrCombustibles = onRequest(
  {
    region: process.env.FIREBASE_DEFAULT_REGION || 'us-central1',
    timeoutSeconds: 60,
    memory: '512MiB',
  },
  app
);
