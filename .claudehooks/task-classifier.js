#!/usr/bin/env node

/**
 * 🔍 Task Classifier - Forestech
 * Sistema de filtros inteligentes para detectar tipos de tarea
 * 
 * Características:
 * - Clasificación automática de tareas
 * - Filtros contextuales por app
 * - Priorización inteligente
 * - Sugerencias de workflow
 */

const fs = require('fs');
const path = require('path');

class TaskClassifier {
  constructor() {
    this.workingDir = process.env.PWD || process.cwd();
    this.patterns = this.loadPatterns();
    this.contextWeights = this.loadContextWeights();
    this.classificationHistory = [];
  }

  loadPatterns() {
    return {
      // Tipos de tarea principales
      taskTypes: {
        bug: {
          keywords: ['bug', 'error', 'fix', 'problema', 'arreglar', 'corregir', 'reparar', 'solucionar'],
          patterns: [
            /no funciona/i,
            /da error/i,
            /está roto/i,
            /falla/i,
            /excepción/i,
            /crash/i,
            /undefined/i,
            /null reference/i
          ],
          priority: 'high',
          urgency: 'immediate'
        },
        
        feature: {
          keywords: ['feature', 'nueva', 'implementar', 'agregar', 'añadir', 'crear', 'desarrollar'],
          patterns: [
            /quiero que/i,
            /necesito/i,
            /agregar.*función/i,
            /implementar.*sistema/i,
            /nueva.*característica/i,
            /crear.*componente/i
          ],
          priority: 'medium',
          urgency: 'planned'
        },
        
        refactor: {
          keywords: ['refactor', 'limpiar', 'optimizar', 'mejorar', 'reorganizar', 'reestructurar'],
          patterns: [
            /código.*sucio/i,
            /mejorar.*performance/i,
            /optimizar/i,
            /limpiar.*código/i,
            /reestructurar/i,
            /reorganizar/i
          ],
          priority: 'low',
          urgency: 'maintenance'
        },
        
        test: {
          keywords: ['test', 'testing', 'prueba', 'verificar', 'validar', 'comprobar'],
          patterns: [
            /escribir.*test/i,
            /agregar.*prueba/i,
            /verificar.*funciona/i,
            /comprobar.*que/i,
            /validar.*que/i
          ],
          priority: 'medium',
          urgency: 'quality'
        },
        
        docs: {
          keywords: ['documentacion', 'doc', 'readme', 'manual', 'guia', 'explicar'],
          patterns: [
            /documentar/i,
            /escribir.*manual/i,
            /crear.*readme/i,
            /explicar.*cómo/i,
            /guía.*de/i
          ],
          priority: 'low',
          urgency: 'documentation'
        },
        
        security: {
          keywords: ['seguridad', 'security', 'auth', 'permission', 'vulnerabilidad', 'exploit'],
          patterns: [
            /falla.*seguridad/i,
            /vulnerabilidad/i,
            /exploit/i,
            /autenticación/i,
            /permisos/i,
            /autorización/i
          ],
          priority: 'critical',
          urgency: 'immediate'
        },
        
        performance: {
          keywords: ['performance', 'lento', 'optimizar', 'velocidad', 'memoria', 'cpu'],
          patterns: [
            /muy.*lento/i,
            /tarda.*mucho/i,
            /memoria.*alta/i,
            /cpu.*alto/i,
            /optimizar.*velocidad/i,
            /mejorar.*rendimiento/i
          ],
          priority: 'high',
          urgency: 'performance'
        }
      },
      
      // Patrones específicos por app
      appPatterns: {
        combustibles: {
          keywords: ['vehiculo', 'categoria', 'combustible', 'gasolina', 'diesel', 'reporte', 'inventario'],
          entities: ['VehicleCategory', 'FuelType', 'InventoryCard', 'VehicleWizard'],
          workflows: ['crear-categoria', 'gestionar-vehiculos', 'generar-reportes']
        },
        
        alimentacion: {
          keywords: ['liquidacion', 'empleado', 'pago', 'concepto', 'nomina', 'salario'],
          entities: ['Liquidacion', 'Empleado', 'Concepto', 'Pago'],
          workflows: ['crear-liquidacion', 'gestionar-empleados', 'procesar-pagos']
        },
        
        shared: {
          keywords: ['componente', 'hook', 'util', 'shared', 'compartido', 'común'],
          entities: ['ForestechForm', 'useFirebase', 'formatCurrency'],
          workflows: ['crear-componente', 'actualizar-hook', 'utility-function']
        }
      },
      
      // Patrones de complejidad
      complexity: {
        simple: {
          patterns: [
            /cambiar.*color/i,
            /agregar.*texto/i,
            /corregir.*typo/i,
            /actualizar.*version/i
          ],
          estimatedTime: '15-30 min',
          requiredSkills: ['basic']
        },
        
        medium: {
          patterns: [
            /crear.*componente/i,
            /agregar.*funcionalidad/i,
            /integrar.*api/i,
            /implementar.*validación/i
          ],
          estimatedTime: '1-3 horas',
          requiredSkills: ['intermediate', 'react', 'javascript']
        },
        
        complex: {
          patterns: [
            /rediseñar.*sistema/i,
            /migrar.*arquitectura/i,
            /implementar.*workflow/i,
            /crear.*módulo/i
          ],
          estimatedTime: '1-3 días',
          requiredSkills: ['advanced', 'architecture', 'system-design']
        }
      }
    };
  }

  loadContextWeights() {
    return {
      directoryContext: 0.4,
      keywordMatch: 0.3,
      patternMatch: 0.2,
      historicalContext: 0.1
    };
  }

  classifyTask(prompt, context = {}) {
    const classification = {
      taskType: 'general',
      app: 'general',
      priority: 'medium',
      urgency: 'planned',
      complexity: 'medium',
      confidence: 0,
      suggestedWorkflow: [],
      estimatedTime: 'unknown',
      requiredSkills: ['basic'],
      relatedEntities: [],
      preprocessingSteps: [],
      postprocessingSteps: []
    };

    // 1. Detectar tipo de tarea
    const taskTypeResult = this.detectTaskType(prompt);
    classification.taskType = taskTypeResult.type;
    classification.priority = taskTypeResult.priority;
    classification.urgency = taskTypeResult.urgency;
    classification.confidence += taskTypeResult.confidence * this.contextWeights.keywordMatch;

    // 2. Detectar app específica
    const appResult = this.detectApp(prompt, context);
    classification.app = appResult.app;
    classification.relatedEntities = appResult.entities;
    classification.confidence += appResult.confidence * this.contextWeights.directoryContext;

    // 3. Detectar complejidad
    const complexityResult = this.detectComplexity(prompt);
    classification.complexity = complexityResult.level;
    classification.estimatedTime = complexityResult.estimatedTime;
    classification.requiredSkills = complexityResult.requiredSkills;

    // 4. Generar workflow sugerido
    classification.suggestedWorkflow = this.generateWorkflow(classification);

    // 5. Generar pasos de procesamiento
    classification.preprocessingSteps = this.generatePreprocessingSteps(classification);
    classification.postprocessingSteps = this.generatePostprocessingSteps(classification);

    // 6. Registrar en historial
    this.classificationHistory.push({
      timestamp: new Date().toISOString(),
      prompt: prompt.substring(0, 100) + '...',
      classification: classification
    });

    return classification;
  }

  detectTaskType(prompt) {
    let bestMatch = { type: 'general', confidence: 0, priority: 'medium', urgency: 'planned' };
    
    Object.entries(this.patterns.taskTypes).forEach(([type, config]) => {
      let confidence = 0;
      
      // Verificar keywords
      const keywordMatches = config.keywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );
      confidence += keywordMatches.length * 0.3;
      
      // Verificar patterns
      const patternMatches = config.patterns.filter(pattern => pattern.test(prompt));
      confidence += patternMatches.length * 0.4;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type,
          confidence,
          priority: config.priority,
          urgency: config.urgency
        };
      }
    });
    
    return bestMatch;
  }

  detectApp(prompt, context = {}) {
    let bestMatch = { app: 'general', confidence: 0, entities: [] };
    
    // Context desde directorio
    if (context.workingDir) {
      if (context.workingDir.includes('combustibles')) {
        bestMatch = { app: 'combustibles', confidence: 0.5, entities: [] };
      } else if (context.workingDir.includes('alimentacion')) {
        bestMatch = { app: 'alimentacion', confidence: 0.5, entities: [] };
      } else if (context.workingDir.includes('shared')) {
        bestMatch = { app: 'shared', confidence: 0.5, entities: [] };
      }
    }
    
    // Verificar patrones específicos por app
    Object.entries(this.patterns.appPatterns).forEach(([app, config]) => {
      let confidence = bestMatch.app === app ? bestMatch.confidence : 0;
      
      // Keywords match
      const keywordMatches = config.keywords.filter(keyword => 
        prompt.toLowerCase().includes(keyword.toLowerCase())
      );
      confidence += keywordMatches.length * 0.2;
      
      // Entity match
      const entityMatches = config.entities.filter(entity => 
        prompt.includes(entity)
      );
      confidence += entityMatches.length * 0.3;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          app,
          confidence,
          entities: entityMatches
        };
      }
    });
    
    return bestMatch;
  }

  detectComplexity(prompt) {
    let bestMatch = { level: 'medium', confidence: 0, estimatedTime: '1-3 horas', requiredSkills: ['intermediate'] };
    
    Object.entries(this.patterns.complexity).forEach(([level, config]) => {
      let confidence = 0;
      
      const patternMatches = config.patterns.filter(pattern => pattern.test(prompt));
      confidence += patternMatches.length * 0.5;
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          level,
          confidence,
          estimatedTime: config.estimatedTime,
          requiredSkills: config.requiredSkills
        };
      }
    });
    
    return bestMatch;
  }

  generateWorkflow(classification) {
    const workflow = [];
    
    // Pasos comunes según tipo de tarea
    if (classification.taskType === 'bug') {
      workflow.push('🔍 Reproducir el error');
      workflow.push('📋 Analizar logs y stack trace');
      workflow.push('🔧 Identificar causa raíz');
      workflow.push('✅ Implementar fix');
      workflow.push('🧪 Verificar solución');
    } else if (classification.taskType === 'feature') {
      workflow.push('📋 Definir requerimientos');
      workflow.push('🏗️ Diseñar arquitectura');
      workflow.push('⚡ Implementar funcionalidad');
      workflow.push('🧪 Escribir tests');
      workflow.push('📚 Documentar cambios');
    }
    
    // Pasos específicos por app
    if (classification.app === 'combustibles') {
      workflow.push('⛽ Verificar categorías de vehículos');
      workflow.push('🔥 Validar integración Firebase');
    } else if (classification.app === 'alimentacion') {
      workflow.push('💰 Verificar cálculos de liquidación');
      workflow.push('👥 Validar datos de empleados');
    }
    
    return workflow;
  }

  generatePreprocessingSteps(classification) {
    const steps = [];
    
    // Pasos generales
    steps.push('📸 Crear snapshot del estado actual');
    steps.push('🔍 Cargar contexto relevante');
    
    // Pasos específicos por tipo
    if (classification.taskType === 'bug') {
      steps.push('🔧 Ejecutar linting automático');
      steps.push('📋 Verificar logs de errores');
    } else if (classification.taskType === 'feature') {
      steps.push('🏗️ Revisar arquitectura existente');
      steps.push('📚 Consultar documentación');
    }
    
    return steps;
  }

  generatePostprocessingSteps(classification) {
    const steps = [];
    
    // Pasos generales
    if (classification.app === 'combustibles') {
      steps.push('🔧 Ejecutar npm run lint:combustibles');
    } else if (classification.app === 'alimentacion') {
      steps.push('🔧 Ejecutar npm run lint:alimentacion');
    }
    
    steps.push('🧪 Verificar tests relacionados');
    steps.push('📝 Actualizar documentación si es necesario');
    steps.push('💾 Crear commit con mensaje descriptivo');
    
    return steps;
  }

  getClassificationSummary() {
    return {
      totalClassifications: this.classificationHistory.length,
      taskTypeDistribution: this.getTaskTypeDistribution(),
      appDistribution: this.getAppDistribution(),
      complexityDistribution: this.getComplexityDistribution(),
      averageConfidence: this.getAverageConfidence()
    };
  }

  getTaskTypeDistribution() {
    const distribution = {};
    this.classificationHistory.forEach(entry => {
      const type = entry.classification.taskType;
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  }

  getAppDistribution() {
    const distribution = {};
    this.classificationHistory.forEach(entry => {
      const app = entry.classification.app;
      distribution[app] = (distribution[app] || 0) + 1;
    });
    return distribution;
  }

  getComplexityDistribution() {
    const distribution = {};
    this.classificationHistory.forEach(entry => {
      const complexity = entry.classification.complexity;
      distribution[complexity] = (distribution[complexity] || 0) + 1;
    });
    return distribution;
  }

  getAverageConfidence() {
    if (this.classificationHistory.length === 0) return 0;
    
    const totalConfidence = this.classificationHistory.reduce((sum, entry) => 
      sum + entry.classification.confidence, 0
    );
    
    return totalConfidence / this.classificationHistory.length;
  }
}

// Main execution
function main() {
  const classifier = new TaskClassifier();
  const prompt = process.argv[2] || 'ejemplo de prompt';
  const context = {
    workingDir: process.env.PWD || process.cwd()
  };
  
  console.log('🔍 Task Classifier - Forestech');
  console.log(`📝 Prompt: ${prompt}`);
  
  const classification = classifier.classifyTask(prompt, context);
  
  console.log('\n📊 Classification Results:');
  console.log(`🎯 Task Type: ${classification.taskType} (${classification.urgency})`);
  console.log(`🏢 App: ${classification.app}`);
  console.log(`⚖️ Priority: ${classification.priority}`);
  console.log(`🧮 Complexity: ${classification.complexity}`);
  console.log(`📈 Confidence: ${Math.round(classification.confidence * 100)}%`);
  console.log(`⏱️ Estimated Time: ${classification.estimatedTime}`);
  console.log(`🛠️ Required Skills: ${classification.requiredSkills.join(', ')}`);
  
  if (classification.relatedEntities.length > 0) {
    console.log(`🔗 Related Entities: ${classification.relatedEntities.join(', ')}`);
  }
  
  console.log('\n🚀 Suggested Workflow:');
  classification.suggestedWorkflow.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
  
  return classification;
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { TaskClassifier, main };