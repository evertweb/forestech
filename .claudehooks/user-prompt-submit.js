#!/usr/bin/env node

/**
 * 🎯 UserPromptSubmit Hook - Forestech
 * Validación automática y context loading basado en prompt del usuario
 * 
 * Características:
 * - Auto-detection de contexto (combustibles/alimentacion)
 * - Validación de sintaxis y patrones
 * - Filtros inteligentes por tipo de tarea
 * - Logging de patrones de uso
 */

const fs = require('fs');
const path = require('path');

// Configuración del hook
const HOOK_CONFIG = {
  enabled: true,
  logLevel: 'info',
  contextSwitching: true,
  validationRules: true,
  patternLogging: true
};

// Patrones de detección
const PATTERNS = {
  combustibles: /combustibles?|fuel|gasolina|vehiculo|categoria|reporte/i,
  alimentacion: /alimentacion|comida|liquidacion|empleado|pago/i,
  taskTypes: {
    bug: /bug|error|fix|problema|arreglar|corregir/i,
    feature: /feature|nueva|implementar|agregar|añadir/i,
    refactor: /refactor|limpiar|optimizar|mejorar|reorganizar/i,
    test: /test|testing|prueba|verificar/i,
    docs: /documentacion|doc|readme|manual/i
  }
};

function main() {
  const workingDir = process.env.PWD || process.cwd();
  const userPrompt = process.argv[2] || '';
  
  console.log('🎯 UserPromptSubmit Hook - Forestech');
  
  // 1. Auto-context detection
  const context = detectContext(workingDir, userPrompt);
  console.log(`📍 Context detected: ${context.app} (${context.confidence}% confidence)`);
  
  // 2. Task type detection
  const taskType = detectTaskType(userPrompt);
  console.log(`🔍 Task type: ${taskType}`);
  
  // 3. Validation rules
  const validationResults = validatePrompt(userPrompt, context);
  if (validationResults.warnings.length > 0) {
    console.log('⚠️  Warnings:', validationResults.warnings);
  }
  
  // 4. Context loading suggestions
  const contextSuggestions = generateContextSuggestions(context, taskType);
  console.log('💡 Context suggestions:', contextSuggestions);
  
  // 5. Pattern logging
  logPatterns(userPrompt, context, taskType, workingDir);
  
  // Return enriched context
  return {
    originalPrompt: userPrompt,
    context: context,
    taskType: taskType,
    suggestions: contextSuggestions,
    workingDirectory: workingDir
  };
}

function detectContext(workingDir, prompt) {
  let app = 'general';
  let confidence = 0;
  
  // Directory-based detection
  if (workingDir.includes('combustibles')) {
    app = 'combustibles';
    confidence += 50;
  } else if (workingDir.includes('alimentacion')) {
    app = 'alimentacion';
    confidence += 50;
  }
  
  // Prompt-based detection
  if (PATTERNS.combustibles.test(prompt)) {
    if (app === 'combustibles') confidence += 30;
    else if (app === 'general') { app = 'combustibles'; confidence = 30; }
  }
  
  if (PATTERNS.alimentacion.test(prompt)) {
    if (app === 'alimentacion') confidence += 30;
    else if (app === 'general') { app = 'alimentacion'; confidence = 30; }
  }
  
  return { app, confidence: Math.min(confidence, 100) };
}

function detectTaskType(prompt) {
  for (const [type, pattern] of Object.entries(PATTERNS.taskTypes)) {
    if (pattern.test(prompt)) {
      return type;
    }
  }
  return 'general';
}

function validatePrompt(prompt, context) {
  const warnings = [];
  
  // Validation rules
  if (prompt.length < 10) {
    warnings.push('Prompt muy corto - considera agregar más detalles');
  }
  
  if (context.confidence < 30) {
    warnings.push('Contexto incierto - especifica si es combustibles o alimentación');
  }
  
  // Check for dangerous patterns
  if (/rm -rf|delete|drop|truncate/i.test(prompt)) {
    warnings.push('Operación potencialmente peligrosa detectada');
  }
  
  return { warnings };
}

function generateContextSuggestions(context, taskType) {
  const suggestions = [];
  
  if (context.app === 'combustibles') {
    suggestions.push('Cargar contexto de combustibles');
    suggestions.push('Verificar categorías de vehículos');
    suggestions.push('Revisar servicios de Firebase');
  } else if (context.app === 'alimentacion') {
    suggestions.push('Cargar contexto de alimentación');
    suggestions.push('Verificar sistema de liquidaciones');
    suggestions.push('Revisar empleados y pagos');
  }
  
  // Task-specific suggestions
  if (taskType === 'bug') {
    suggestions.push('Ejecutar linting automático');
    suggestions.push('Verificar logs de errores');
  } else if (taskType === 'feature') {
    suggestions.push('Revisar arquitectura existente');
    suggestions.push('Verificar tests relacionados');
  }
  
  return suggestions;
}

function logPatterns(prompt, context, taskType, workingDir) {
  if (!HOOK_CONFIG.patternLogging) return;
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    prompt: prompt.substring(0, 100) + '...',
    context: context.app,
    taskType: taskType,
    workingDir: path.basename(workingDir),
    confidence: context.confidence
  };
  
  const logFile = path.join(__dirname, 'usage-patterns.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { main, detectContext, detectTaskType };