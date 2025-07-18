#!/usr/bin/env node

/**
 * 🔄 Context Switcher - Forestech
 * Auto-context switching basado en Working Directory
 * 
 * Características:
 * - Detección automática de directorio de trabajo
 * - Configuración específica por app (combustibles/alimentacion)
 * - Validaciones contextuales
 * - Setup automático de entorno
 */

const fs = require('fs');
const path = require('path');

class ContextSwitcher {
  constructor() {
    this.workingDir = process.env.PWD || process.cwd();
    this.currentContext = this.detectContext();
    this.contextConfig = this.loadContextConfig();
  }

  detectContext() {
    const dirPath = this.workingDir;
    
    if (dirPath.includes('combustibles')) {
      return {
        app: 'combustibles',
        displayName: '⛽ Combustibles',
        port: 5174,
        features: ['vehiculos', 'categorias', 'reportes', 'firebase'],
        lintCommand: 'npm run lint:combustibles',
        devCommand: 'npm run dev:combustibles',
        testCommand: 'npm run test:combustibles'
      };
    } else if (dirPath.includes('alimentacion')) {
      return {
        app: 'alimentacion',
        displayName: '🍽️ Alimentación',
        port: 5173,
        features: ['liquidaciones', 'empleados', 'pagos', 'reportes'],
        lintCommand: 'npm run lint:alimentacion',
        devCommand: 'npm run dev:alimentacion',
        testCommand: 'npm run test:alimentacion'
      };
    } else if (dirPath.includes('shared')) {
      return {
        app: 'shared',
        displayName: '🔧 Shared',
        port: null,
        features: ['components', 'utils', 'styles', 'hooks'],
        lintCommand: 'npm run lint:shared',
        devCommand: null,
        testCommand: 'npm run test:shared'
      };
    } else {
      return {
        app: 'general',
        displayName: '📋 General',
        port: null,
        features: ['monorepo', 'firebase', 'ci-cd', 'docs'],
        lintCommand: 'npm run lint',
        devCommand: 'npm run dev',
        testCommand: 'npm run test'
      };
    }
  }

  loadContextConfig() {
    const configPath = path.join(__dirname, 'context-config.json');
    
    if (fs.existsSync(configPath)) {
      try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.warn('⚠️  Error loading context config:', error.message);
      }
    }
    
    return this.getDefaultConfig();
  }

  getDefaultConfig() {
    return {
      combustibles: {
        requiredFiles: [
          'src/components/Vehicles/VehiclesMain.jsx',
          'src/services/vehiclesService.js',
          'src/data/vehicleCategories.js'
        ],
        commonPatterns: [
          'VehicleCategory',
          'FuelType',
          'VehicleWizard',
          'InventoryCard'
        ],
        validations: {
          maxCategories: 50,
          requiredFields: ['name', 'fuelType', 'icon'],
          forbiddenOperations: []
        }
      },
      alimentacion: {
        requiredFiles: [
          'src/components/Liquidaciones/LiquidacionesMain.jsx',
          'src/services/liquidacionesService.js',
          'src/data/empleados.js'
        ],
        commonPatterns: [
          'Liquidacion',
          'Empleado',
          'Pago',
          'Concepto'
        ],
        validations: {
          maxEmpleados: 1000,
          requiredFields: ['cedula', 'nombre', 'cargo'],
          forbiddenOperations: ['deleteAllEmpleados']
        }
      },
      shared: {
        requiredFiles: [
          'src/components/Shared/ForestechFormWizard.jsx',
          'src/hooks/useFirebase.js',
          'src/utils/formatters.js'
        ],
        commonPatterns: [
          'ForestechForm',
          'useFirebase',
          'formatCurrency'
        ],
        validations: {
          breakingChanges: true,
          versionCheck: true,
          dependencyCheck: true
        }
      }
    };
  }

  validateContext() {
    const config = this.contextConfig[this.currentContext.app];
    if (!config) return { valid: true, warnings: [] };

    const warnings = [];
    
    // Check required files
    if (config.requiredFiles) {
      for (const file of config.requiredFiles) {
        const filePath = path.join(this.workingDir, file);
        if (!fs.existsSync(filePath)) {
          warnings.push(`Required file missing: ${file}`);
        }
      }
    }
    
    return {
      valid: warnings.length === 0,
      warnings: warnings
    };
  }

  getContextualSuggestions(taskType = 'general') {
    const suggestions = [];
    const context = this.currentContext;
    
    // App-specific suggestions
    if (context.app === 'combustibles') {
      suggestions.push('🔍 Verificar categorías de vehículos actuales');
      suggestions.push('⛽ Revisar tipos de combustible configurados');
      suggestions.push('📊 Consultar reportes de inventario');
    } else if (context.app === 'alimentacion') {
      suggestions.push('👥 Revisar empleados registrados');
      suggestions.push('💰 Verificar liquidaciones pendientes');
      suggestions.push('📈 Consultar reportes de pagos');
    }
    
    // Task-specific suggestions
    if (taskType === 'bug') {
      suggestions.push(`🔧 Ejecutar: ${context.lintCommand}`);
      suggestions.push('📋 Revisar logs de errores');
    } else if (taskType === 'feature') {
      suggestions.push('🏗️ Revisar arquitectura existente');
      suggestions.push('🧪 Verificar tests relacionados');
    }
    
    return suggestions;
  }

  setupEnvironment() {
    const setup = {
      workingDirectory: this.workingDir,
      context: this.currentContext,
      validation: this.validateContext(),
      suggestions: this.getContextualSuggestions(),
      commands: {
        dev: this.currentContext.devCommand,
        lint: this.currentContext.lintCommand,
        test: this.currentContext.testCommand
      }
    };
    
    return setup;
  }

  logContextSwitch() {
    const logEntry = {
      timestamp: new Date().toISOString(),
      workingDirectory: this.workingDir,
      context: this.currentContext.app,
      displayName: this.currentContext.displayName,
      features: this.currentContext.features
    };
    
    const logFile = path.join(__dirname, 'context-switches.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }
}

// Main execution
function main() {
  const switcher = new ContextSwitcher();
  const setup = switcher.setupEnvironment();
  
  console.log(`🔄 Context Switcher - ${setup.context.displayName}`);
  console.log(`📁 Working Directory: ${setup.workingDirectory}`);
  console.log(`🎯 Features: ${setup.context.features.join(', ')}`);
  
  if (!setup.validation.valid) {
    console.log('⚠️  Validation warnings:', setup.validation.warnings);
  }
  
  console.log('💡 Suggestions:', setup.suggestions);
  
  switcher.logContextSwitch();
  
  return setup;
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { ContextSwitcher, main };