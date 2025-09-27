#!/usr/bin/env node
// load-env.js - Script para cargar variables de entorno en cualquier entorno

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para cargar archivo .env
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const envVars = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        envVars[key.trim()] = value.replace(/^["'](.*)["']$/, '$1');
      }
    }
  });
  
  return envVars;
}

// Intentar cargar desde diferentes archivos de entorno
const envFiles = [
  path.join(__dirname, '.env.local'),
  path.join(__dirname, '.env.development'),
  path.join(__dirname, '.env'),
];

let loadedVars = {};

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    console.log(`📁 Cargando variables desde: ${envFile}`);
    const vars = loadEnvFile(envFile);
    loadedVars = { ...loadedVars, ...vars };
    break;
  }
}

// Aplicar variables al proceso actual
Object.keys(loadedVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = loadedVars[key];
  }
});

// Verificar variables críticas de Firebase
const criticalVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_APP_ID'];
let allPresent = true;

criticalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Cargado correctamente`);
  } else {
    console.log(`❌ ${varName}: FALTANTE`);
    allPresent = false;
  }
});

if (allPresent) {
  console.log('🚀 Todas las variables de Firebase están configuradas correctamente');
} else {
  console.log('⚠️  Faltan variables de Firebase. Revisa tu archivo .env');
}

export default loadedVars;