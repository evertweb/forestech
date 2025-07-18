#!/usr/bin/env node

/**
 * 🎯 Hook Manager - Forestech
 * Orquestador principal de todos los hooks y optimizaciones
 * 
 * Características:
 * - Gestión centralizada de todos los hooks
 * - Configuración unificada
 * - Ejecución coordinada
 * - Monitoreo y reportes
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Importar todos los hooks
const { main: userPromptSubmit } = require('./user-prompt-submit.js');
const { ContextSwitcher } = require('./context-switcher.js');
const { ShellOptimizer } = require('./shell-optimizer.js');
const { TaskClassifier } = require('./task-classifier.js');
const { PatternLogger } = require('./pattern-logger.js');
const { DirectoryValidator } = require('./directory-validator.js');

class HookManager {
  constructor() {
    this.hooksDir = __dirname;
    this.config = this.loadConfig();
    this.hooks = this.initializeHooks();
    this.isEnabled = this.config.enabled;
    this.logger = new PatternLogger();
    this.startTime = Date.now();
  }

  loadConfig() {
    const defaultConfig = {
      enabled: true,
      verbose: false,
      timing: true,
      hooks: {
        userPromptSubmit: { enabled: true, priority: 1 },
        contextSwitcher: { enabled: true, priority: 2 },
        taskClassifier: { enabled: true, priority: 3 },
        directoryValidator: { enabled: true, priority: 4 },
        shellOptimizer: { enabled: true, priority: 5 },
        patternLogger: { enabled: true, priority: 6 }
      },
      execution: {
        timeout: 30000, // 30 segundos
        maxRetries: 3,
        parallelExecution: true
      },
      reporting: {
        enabled: true,
        detailedLogs: false,
        performanceMetrics: true
      }
    };

    const configPath = path.join(this.hooksDir, 'hook-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return { ...defaultConfig, ...userConfig };
      } catch (error) {
        console.warn('⚠️  Error loading hook config:', error.message);
      }
    }

    return defaultConfig;
  }

  initializeHooks() {
    return {
      contextSwitcher: new ContextSwitcher(),
      shellOptimizer: new ShellOptimizer(),
      taskClassifier: new TaskClassifier(),
      directoryValidator: new DirectoryValidator(),
      patternLogger: this.logger
    };
  }

  // Ejecutar hook principal UserPromptSubmit
  async executeUserPromptSubmit(userPrompt, context = {}) {
    if (!this.isEnabled || !this.config.hooks.userPromptSubmit.enabled) {
      return { skipped: true, reason: 'Hook disabled' };
    }

    const startTime = Date.now();
    const hookContext = {
      ...context,
      workingDir: process.env.PWD || process.cwd(),
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId()
    };

    try {
      console.log('🎯 Executing UserPromptSubmit Hook Pipeline...');
      
      // 1. Validar directorio y operación
      const validation = await this.executeWithTiming('directoryValidator', () => {
        return this.hooks.directoryValidator.validateDirectory('user-prompt');
      });

      if (!validation.valid && validation.errors.length > 0) {
        console.log('❌ Directory validation failed:', validation.errors);
        return { success: false, errors: validation.errors };
      }

      // 2. Cambiar contexto automáticamente
      const contextSetup = await this.executeWithTiming('contextSwitcher', () => {
        return this.hooks.contextSwitcher.setupEnvironment();
      });

      // 3. Clasificar tarea
      const classification = await this.executeWithTiming('taskClassifier', () => {
        return this.hooks.taskClassifier.classifyTask(userPrompt, hookContext);
      });

      // 4. Optimizar shell si es necesario
      let shellOptimization = null;
      if (this.requiresShellOptimization(classification)) {
        shellOptimization = await this.executeWithTiming('shellOptimizer', () => {
          return this.hooks.shellOptimizer.createSnapshot();
        });
      }

      // 5. Logging de patrones
      await this.executeWithTiming('patternLogger', () => {
        this.hooks.patternLogger.logUsagePattern({
          prompt: userPrompt,
          taskType: classification.taskType,
          app: classification.app,
          complexity: classification.complexity,
          confidence: classification.confidence,
          workingDir: hookContext.workingDir
        });
      });

      const executionTime = Date.now() - startTime;
      const result = {
        success: true,
        executionTime,
        context: contextSetup,
        classification,
        validation,
        shellOptimization,
        recommendations: this.generateRecommendations(classification, contextSetup, validation)
      };

      // Log performance metrics
      this.hooks.patternLogger.logPerformance({
        taskType: classification.taskType,
        app: classification.app,
        executionTime,
        workingDir: hookContext.workingDir,
        fileOperations: 0,
        networkRequests: 0
      });

      if (this.config.verbose) {
        console.log('✅ UserPromptSubmit Hook completed:', result);
      }

      return result;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      // Log error
      this.hooks.patternLogger.logError(error, {
        taskType: 'unknown',
        app: 'general',
        workingDir: hookContext.workingDir,
        operation: 'user-prompt-submit',
        userPrompt: userPrompt
      });

      console.error('❌ UserPromptSubmit Hook failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        executionTime
      };
    }
  }

  // Ejecutar con timing y manejo de errores
  async executeWithTiming(hookName, hookFunction) {
    const startTime = Date.now();
    
    try {
      const result = await hookFunction();
      const executionTime = Date.now() - startTime;
      
      if (this.config.timing) {
        console.log(`⏱️  ${hookName}: ${executionTime}ms`);
      }
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ ${hookName} failed (${executionTime}ms):`, error.message);
      throw error;
    }
  }

  requiresShellOptimization(classification) {
    return classification.taskType === 'feature' || 
           classification.taskType === 'refactor' ||
           classification.complexity === 'complex';
  }

  generateRecommendations(classification, contextSetup, validation) {
    const recommendations = [];
    
    // Recomendaciones basadas en clasificación
    if (classification.taskType === 'bug') {
      recommendations.push('🔧 Ejecutar linting antes de empezar');
      recommendations.push('📋 Revisar logs de errores recientes');
    } else if (classification.taskType === 'feature') {
      recommendations.push('🏗️ Revisar arquitectura existente');
      recommendations.push('📚 Consultar documentación relacionada');
    }

    // Recomendaciones basadas en contexto
    if (contextSetup.context.app === 'combustibles') {
      recommendations.push('⛽ Verificar categorías de vehículos');
      recommendations.push('🔥 Validar integración Firebase');
    } else if (contextSetup.context.app === 'alimentacion') {
      recommendations.push('💰 Verificar cálculos de liquidación');
      recommendations.push('👥 Validar datos de empleados');
    }

    // Recomendaciones basadas en validación
    if (validation.warnings.length > 0) {
      recommendations.push('⚠️ Revisar warnings de validación');
    }

    return recommendations;
  }

  // Generar reportes de uso
  generateUsageReport() {
    const report = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      config: this.config,
      hooks: {
        enabled: Object.keys(this.hooks).length,
        total: Object.keys(this.config.hooks).length
      },
      performance: {
        totalExecutions: this.getTotalExecutions(),
        averageExecutionTime: this.getAverageExecutionTime(),
        successRate: this.getSuccessRate()
      },
      insights: this.hooks.patternLogger.getClassificationSummary()
    };

    return report;
  }

  getTotalExecutions() {
    // Implementar conteo desde logs
    return 0;
  }

  getAverageExecutionTime() {
    // Implementar cálculo desde logs
    return 0;
  }

  getSuccessRate() {
    // Implementar cálculo desde logs
    return 100;
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Configurar hook automáticamente
  async setupHook() {
    console.log('🚀 Setting up Forestech Hook System...');
    
    // Crear directorio de logs
    const logsDir = path.join(this.hooksDir, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Crear configuración por defecto
    const configPath = path.join(this.hooksDir, 'hook-config.json');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      console.log('✅ Default config created');
    }

    // Dar permisos de ejecución
    const hookFiles = fs.readdirSync(this.hooksDir).filter(f => f.endsWith('.js'));
    hookFiles.forEach(file => {
      const filePath = path.join(this.hooksDir, file);
      try {
        fs.chmodSync(filePath, '755');
      } catch (error) {
        console.warn(`⚠️  Could not set permissions for ${file}:`, error.message);
      }
    });

    // Inicializar hooks
    await this.hooks.shellOptimizer.initialize();
    
    console.log('✅ Hook system setup complete');
  }

  // Comando principal de prueba
  async testHooks() {
    console.log('🧪 Testing Forestech Hook System...');
    
    const testPrompt = 'crear una nueva categoría de vehículo llamada "eléctrico"';
    const result = await this.executeUserPromptSubmit(testPrompt);
    
    console.log('📊 Test Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`⏱️  Time: ${result.executionTime}ms`);
    console.log(`🎯 Task Type: ${result.classification?.taskType}`);
    console.log(`🏢 App: ${result.classification?.app}`);
    console.log(`📈 Confidence: ${Math.round((result.classification?.confidence || 0) * 100)}%`);
    
    if (result.recommendations) {
      console.log('💡 Recommendations:');
      result.recommendations.forEach(rec => console.log(`   ${rec}`));
    }
    
    return result;
  }
}

// Main execution
async function main() {
  const manager = new HookManager();
  const command = process.argv[2];
  
  console.log('🎯 Hook Manager - Forestech');
  
  switch (command) {
    case 'setup':
      await manager.setupHook();
      break;
      
    case 'test':
      await manager.testHooks();
      break;
      
    case 'report':
      const report = manager.generateUsageReport();
      console.log('📊 Usage Report:', JSON.stringify(report, null, 2));
      break;
      
    case 'execute':
      const prompt = process.argv[3] || 'test prompt';
      const result = await manager.executeUserPromptSubmit(prompt);
      console.log('🎯 Execution Result:', result);
      break;
      
    default:
      console.log('Available commands:');
      console.log('  setup   - Configure hook system');
      console.log('  test    - Run hook tests');
      console.log('  report  - Generate usage report');
      console.log('  execute - Execute hooks with prompt');
  }
}

// Execute if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { HookManager, main };