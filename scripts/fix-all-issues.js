#!/usr/bin/env node

/**
 * Script maestro para ejecutar todos los fixes automáticos
 * Ejecuta múltiples fixers en orden secuencial para máxima efectividad
 */

const UnusedVarsFixer = require('./fix-unused-vars');
const AnonymousComponentsFixer = require('./fix-anonymous-components');
const EnvironmentVarsFixer = require('./fix-environment-vars');
const ReactHooksFixer = require('./fix-react-hooks');
const MetricsCollector = require('./metrics-collector');

class MasterFixer {
  constructor() {
    this.totalFixedFiles = new Set();
    this.totalStats = {
      startTime: Date.now(),
      fixersExecuted: 0,
      totalIssuesFixed: 0,
      categories: {
        unusedVars: 0,
        anonymousComponents: 0,
        environmentVars: 0,
        reactHooks: 0
      }
    };
    this.metricsCollector = new MetricsCollector();
  }

  /**
   * Ejecuta todos los fixers en orden óptimo
   */
  async run() {
    console.log('🚀 Ejecutando suite completa de auto-fixes...\n');
    console.log('📋 Orden de ejecución:');
    console.log('   1. Variables de entorno no definidas');
    console.log('   2. Variables no utilizadas');
    console.log('   3. Componentes anónimos');
    console.log('   4. Dependencies de React Hooks');
    console.log('');

    try {
      // 1. Fix environment variables primero (pueden afectar imports)
      await this.executeFixerStep('Environment Variables', EnvironmentVarsFixer, 'environmentVars');
      
      // 2. Fix unused variables (limpieza de código)
      await this.executeFixerStep('Unused Variables', UnusedVarsFixer, 'unusedVars');
      
      // 3. Fix anonymous components (estructura de componentes)
      await this.executeFixerStep('Anonymous Components', AnonymousComponentsFixer, 'anonymousComponents');
      
      // 4. Fix React Hooks al final (dependencies más estables)
      await this.executeFixerStep('React Hooks', ReactHooksFixer, 'reactHooks');

      this.printFinalSummary();
      
    } catch (error) {
      console.error('❌ Error ejecutando master fixer:', error);
      process.exit(1);
    }
  }

  /**
   * Ejecuta un fixer específico y recolecta estadísticas
   */
  async executeFixerStep(name, FixerClass, category) {
    console.log(`\n🔧 === ${name} ===`);
    
    const fixer = new FixerClass();
    const startTime = Date.now();
    
    try {
      await fixer.run();
      
      // Recolectar estadísticas
      if (fixer.fixedFiles) {
        fixer.fixedFiles.forEach(file => this.totalFixedFiles.add(file));
        this.totalStats.categories[category] = fixer.fixedFiles.length;
      }
      
      if (fixer.stats) {
        const fixCount = Object.values(fixer.stats)
          .filter(val => typeof val === 'number')
          .reduce((sum, val) => sum + val, 0);
        this.totalStats.totalIssuesFixed += fixCount;
      }
      
      const duration = Date.now() - startTime;
      console.log(`   ⏱️  Completado en ${duration}ms`);
      
      // Registrar métricas para este fixer
      const fixerStats = fixer.stats || {};
      const fixedFiles = fixer.fixedFiles || [];
      this.metricsCollector.recordAutoFixRun(category, fixerStats, fixedFiles);
      
      this.totalStats.fixersExecuted++;
      
    } catch (error) {
      console.error(`❌ Error en ${name}:`, error);
      throw error;
    }
  }

  /**
   * Imprime resumen final completo
   */
  printFinalSummary() {
    const totalDuration = Date.now() - this.totalStats.startTime;
    
    console.log('\n🎉 === RESUMEN FINAL ===');
    console.log(`⏱️  Tiempo total: ${totalDuration}ms`);
    console.log(`🔧 Fixers ejecutados: ${this.totalStats.fixersExecuted}/4`);
    console.log(`📁 Archivos únicos modificados: ${this.totalFixedFiles.size}`);
    console.log(`🔨 Total de issues corregidos: ${this.totalStats.totalIssuesFixed}`);
    
    console.log('\n📊 Breakdown por categoría:');
    Object.entries(this.totalStats.categories).forEach(([category, count]) => {
      const emoji = this.getCategoryEmoji(category);
      console.log(`   ${emoji} ${this.formatCategoryName(category)}: ${count} archivos`);
    });

    if (this.totalFixedFiles.size > 0) {
      console.log('\n✅ Archivos modificados:');
      Array.from(this.totalFixedFiles).sort().forEach(file => {
        console.log(`   ✓ ${file}`);
      });
    }

    console.log('\n🎯 Resultado:');
    if (this.totalStats.totalIssuesFixed > 0) {
      console.log(`   ✅ ${this.totalStats.totalIssuesFixed} issues corregidos automáticamente`);
      console.log(`   🚀 Proyecto listo para build sin errores de linting`);
    } else {
      console.log('   ℹ️  No se encontraron issues para corregir');
    }
    
    console.log('\n📋 Siguientes pasos:');
    console.log('   1. Revisar los cambios: git diff');
    console.log('   2. Ejecutar tests: npm test');
    console.log('   3. Ejecutar build: npm run build');
    console.log('   4. Commit cambios: git add . && git commit');
    
    // Generar reporte de métricas si hay actividad significativa
    if (this.totalStats.totalIssuesFixed > 0) {
      console.log('\n📊 Generando reporte de métricas...');
      try {
        this.metricsCollector.run().then(result => {
          console.log(`   📈 Métricas actualizadas en: ${result.reportPath}`);
        }).catch(err => {
          console.log(`   ⚠️  Error generando métricas: ${err.message}`);
        });
      } catch (error) {
        console.log(`   ⚠️  Error iniciando métricas: ${error.message}`);
      }
    }
  }

  /**
   * Obtiene emoji para categoría
   */
  getCategoryEmoji(category) {
    const emojis = {
      unusedVars: '🗑️',
      anonymousComponents: '🏷️',
      environmentVars: '🌍',
      reactHooks: '🪝'
    };
    return emojis[category] || '🔧';
  }

  /**
   * Formatea nombre de categoría
   */
  formatCategoryName(category) {
    const names = {
      unusedVars: 'Variables no utilizadas',
      anonymousComponents: 'Componentes anónimos',
      environmentVars: 'Variables de entorno',
      reactHooks: 'React Hooks'
    };
    return names[category] || category;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const masterFixer = new MasterFixer();
  masterFixer.run().catch(console.error);
}

module.exports = MasterFixer;