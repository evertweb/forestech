#!/usr/bin/env node
/**
 * Ejecuta Lighthouse para rutas críticas y guarda salida HTML/JSON en logs/
 * Requisitos: tener el servidor local corriendo en 5174 (combustibles)
 */
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = join(process.cwd(), 'logs');
try { mkdirSync(OUT_DIR, { recursive: true }); } catch {}

const routes = [
  { name: 'login', url: 'http://localhost:5174/combustibles/login' },
  { name: 'movements', url: 'http://localhost:5174/combustibles/movements' },
];

for (const r of routes) {
  const outPath = join(OUT_DIR, `lighthouse-${r.name}-${Date.now()}`);
  const cmd = `npx --yes lighthouse ${r.url} --output html json --output-path ${outPath}`;
  console.log(`[Lighthouse] Ejecutando: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error(`[Lighthouse] Error en ${r.name}:`, e.message);
  }
}

console.log('Listo. Revisa la carpeta logs/.');
