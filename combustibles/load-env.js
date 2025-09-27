#!/usr/bin/env node
// load-env.js - Script para cargar variables de entorno en cualquier entorno

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variables críticas de Firebase
const criticalVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_APP_ID'];

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

console.log(`🔍 Buscando archivos .env en: ${__dirname}`);
let loadedVars = {};

for (const envFile of envFiles) {
  console.log(`🔍 Verificando: ${envFile} - ${fs.existsSync(envFile) ? 'EXISTE' : 'NO EXISTE'}`);
  if (fs.existsSync(envFile)) {
    console.log(`📁 Cargando variables desde: ${envFile}`);
    const vars = loadEnvFile(envFile);
    loadedVars = { ...loadedVars, ...vars };
    break;
  }
}

if (Object.keys(loadedVars).length === 0) {
  console.log('⚠️  No se encontró ningún archivo .env en los paths buscados');
  console.log('🔄 Intentando usar variables de entorno del sistema...');

  // Fallback a variables de entorno del sistema (útil para Codespaces)
  const systemVars = {};
  criticalVars.forEach(varName => {
    if (process.env[varName]) {
      systemVars[varName] = process.env[varName];
    }
  });

  if (Object.keys(systemVars).length > 0) {
    loadedVars = systemVars;
    console.log('✅ Variables cargadas desde el sistema');
  } else {
    console.log('❌ No se encontraron variables en el sistema tampoco');
  }
}

// Aplicar variables al proceso actual
Object.keys(loadedVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = loadedVars[key];
  }
});

// Verificar variables críticas de Firebase
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