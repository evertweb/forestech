#!/usr/bin/env node

/**
 * Script para actualizar Firebase Remote Config con las configuraciones SSR
 * Fase 4 completa - 45% cobertura SSR
 */

import admin from 'firebase-admin';
import fs from 'node:fs/promises';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'liquidacionapp-62962'
  });
}

async function updateRemoteConfig() {
  try {
    console.log('🔄 Actualizando Firebase Remote Config...');
    
    // Leer configuración desde archivo
    const configData = await fs.readFile('./remote-config.json', 'utf8');
    const config = JSON.parse(configData);
    
    // Obtener la configuración actual
    const remoteConfig = admin.remoteConfig();
    const template = await remoteConfig.getTemplate();
    
    console.log('📋 Configuración actual encontrada, versión:', template.version);
    
    // Actualizar parámetros
    Object.entries(config.parameters).forEach(([key, paramConfig]) => {
      template.parameters[key] = {
        defaultValue: paramConfig.defaultValue,
        description: paramConfig.description
      };
      console.log(`✅ Parámetro actualizado: ${key}`);
    });
    
    // Actualizar condiciones si existen
    if (config.conditions) {
      Object.entries(config.conditions).forEach(([key, condition]) => {
        template.conditions.push({
          name: key,
          expression: condition.expression,
          tagColor: condition.tagColor || 'BLUE'
        });
        console.log(`✅ Condición actualizada: ${key}`);
      });
    }
    
    // Publicar cambios
    console.log('🚀 Publicando configuración actualizada...');
    const updatedTemplate = await remoteConfig.publishTemplate(template);
    
    console.log('🎉 Remote Config actualizado exitosamente!');
    console.log(`📊 Nueva versión: ${updatedTemplate.version}`);
    console.log('🔗 Console: https://console.firebase.google.com/project/liquidacionapp-62962/config');
    
    // Mostrar resumen de parámetros SSR
    console.log('\n📋 RESUMEN DE CONFIGURACIÓN SSR:');
    console.log('================================');
    
    const ssrParams = Object.keys(config.parameters).filter(key => 
      key.includes('ssr') || key.includes('enable') || key.includes('max_')
    );
    
    ssrParams.forEach(param => {
      const value = config.parameters[param].defaultValue.value;
      console.log(`${param}: ${value}`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error actualizando Remote Config:', error);
    
    if (error.code === 'INVALID_ARGUMENT') {
      console.log('💡 Verificar que el formato de remote-config.json sea válido');
    } else if (error.code === 'PERMISSION_DENIED') {
      console.log('💡 Verificar permisos de Firebase Admin SDK');
    }
    
    return false;
  }
}

// Ejecutar script
updateRemoteConfig()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
