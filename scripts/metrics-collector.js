#!/usr/bin/env node

/**
 * Sistema de métricas y feedback inteligente para auto-fixes
 * Recolecta, analiza y reporta estadísticas de correcciones automáticas
 */

const fs = require('fs');
const path = require('path');

class MetricsCollector {
  constructor() {
    this.metricsFile = path.join(__dirname, '../.metrics/auto-fix-metrics.json');
    this.reportsDir = path.join(__dirname, '../.metrics/reports');
    this.ensureDirectories();
  }

  /**
   * Crear directorios necesarios
   */
  ensureDirectories() {
    const metricsDir = path.dirname(this.metricsFile);
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true });
    }
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  /**
   * Registrar métricas de ejecución de auto-fix
   */
  recordAutoFixRun(fixerName, stats, fixedFiles) {
    const timestamp = new Date().toISOString();
    const runId = `${Date.now()}_${fixerName}`;
    
    const runMetrics = {
      runId,
      timestamp,
      fixer: fixerName,
      stats: stats || {},
      fixedFiles: fixedFiles || [],
      fileCount: (fixedFiles || []).length,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        isCI: !!process.env.CI,
        branch: process.env.GITHUB_REF_NAME || 'unknown',
        commit: process.env.GITHUB_SHA || 'unknown'
      }
    };

    // Cargar métricas existentes
    let allMetrics = this.loadMetrics();
    
    // Agregar nueva ejecución
    allMetrics.runs.push(runMetrics);
    allMetrics.lastUpdated = timestamp;
    allMetrics.totalRuns++;

    // Guardar métricas actualizadas
    this.saveMetrics(allMetrics);
    
    console.log(`📊 Métricas registradas para ${fixerName} (Run ID: ${runId})`);
    
    return runId;
  }

  /**
   * Cargar métricas existentes
   */
  loadMetrics() {
    if (!fs.existsSync(this.metricsFile)) {
      return {
        version: '1.0',
        created: new Date().toISOString(),
        lastUpdated: null,
        totalRuns: 0,
        runs: [],
        statistics: {}
      };
    }

    try {
      const content = fs.readFileSync(this.metricsFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('❌ Error cargando métricas:', error);
      return this.loadMetrics(); // Retornar métricas vacías
    }
  }

  /**
   * Guardar métricas
   */
  saveMetrics(metrics) {
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error('❌ Error guardando métricas:', error);
    }
  }

  /**
   * Generar análisis de tendencias
   */
  analyzeTrends() {
    const metrics = this.loadMetrics();
    const runs = metrics.runs;
    
    if (runs.length === 0) {
      return {
        message: 'No hay datos suficientes para análisis de tendencias'
      };
    }

    // Análisis por fixer
    const byFixer = {};
    runs.forEach(run => {
      if (!byFixer[run.fixer]) {
        byFixer[run.fixer] = {
          totalRuns: 0,
          totalFiles: 0,
          avgFilesPerRun: 0,
          lastRun: null,
          trends: []
        };
      }
      
      const stats = byFixer[run.fixer];
      stats.totalRuns++;
      stats.totalFiles += run.fileCount;
      stats.lastRun = run.timestamp;
      stats.trends.push({
        timestamp: run.timestamp,
        fileCount: run.fileCount
      });
    });

    // Calcular promedios
    Object.keys(byFixer).forEach(fixer => {
      const stats = byFixer[fixer];
      stats.avgFilesPerRun = (stats.totalFiles / stats.totalRuns).toFixed(2);
    });

    // Análisis temporal (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRuns = runs.filter(run => 
      new Date(run.timestamp) > thirtyDaysAgo
    );

    // Detección de patrones
    const patterns = this.detectPatterns(runs);
    
    return {
      summary: {
        totalRuns: runs.length,
        uniqueFixers: Object.keys(byFixer).length,
        recentRuns: recentRuns.length,
        avgFilesPerRun: (runs.reduce((sum, run) => sum + run.fileCount, 0) / runs.length).toFixed(2)
      },
      byFixer,
      patterns,
      recommendations: this.generateRecommendations(byFixer, patterns)
    };
  }

  /**
   * Detectar patrones en las ejecuciones
   */
  detectPatterns(runs) {
    const patterns = {
      recurringFiles: {},
      peakTimes: {},
      errorPatterns: []
    };

    // Archivos que aparecen frecuentemente
    runs.forEach(run => {
      run.fixedFiles.forEach(file => {
        if (!patterns.recurringFiles[file]) {
          patterns.recurringFiles[file] = 0;
        }
        patterns.recurringFiles[file]++;
      });
    });

    // Filtrar archivos con más de 2 ocurrencias
    patterns.recurringFiles = Object.fromEntries(
      Object.entries(patterns.recurringFiles).filter(([_, count]) => count > 2)
    );

    // Horarios pico (análisis por hora)
    runs.forEach(run => {
      const hour = new Date(run.timestamp).getHours();
      if (!patterns.peakTimes[hour]) {
        patterns.peakTimes[hour] = 0;
      }
      patterns.peakTimes[hour]++;
    });

    return patterns;
  }

  /**
   * Generar recomendaciones basadas en análisis
   */
  generateRecommendations(byFixer, patterns) {
    const recommendations = [];

    // Recomendaciones basadas en archivos recurrentes
    const recurringCount = Object.keys(patterns.recurringFiles).length;
    if (recurringCount > 5) {
      recommendations.push({
        type: 'code_quality',
        priority: 'high',
        title: 'Archivos con errores recurrentes detectados',
        description: `${recurringCount} archivos requieren fixes repetitivos. Considera refactoring.`,
        action: 'review_recurring_files',
        files: Object.keys(patterns.recurringFiles)
      });
    }

    // Recomendaciones basadas en frecuencia de ejecución
    Object.entries(byFixer).forEach(([fixer, stats]) => {
      if (stats.avgFilesPerRun > 5) {
        recommendations.push({
          type: 'automation',
          priority: 'medium',
          title: `Fixer ${fixer} procesa muchos archivos`,
          description: `Promedio de ${stats.avgFilesPerRun} archivos por ejecución. Considera mejoras preventivas.`,
          action: 'improve_prevention',
          fixer
        });
      }
    });

    // Recomendación de optimización
    if (Object.keys(byFixer).length > 3) {
      recommendations.push({
        type: 'optimization',
        priority: 'low',
        title: 'Múltiples fixers activos',
        description: 'Considera consolidar fixers relacionados para mejor performance.',
        action: 'consolidate_fixers'
      });
    }

    return recommendations;
  }

  /**
   * Generar reporte detallado
   */
  generateReport() {
    const analysis = this.analyzeTrends();
    const timestamp = new Date().toISOString();
    const reportPath = path.join(this.reportsDir, `report-${timestamp.split('T')[0]}.md`);
    
    const report = `# 📊 Reporte de Auto-Fix Metrics

**Generado:** ${timestamp}
**Período:** Todos los registros disponibles

## 📋 Resumen Ejecutivo

- **Total de ejecuciones:** ${analysis.summary?.totalRuns || 0}
- **Fixers únicos:** ${analysis.summary?.uniqueFixers || 0}
- **Ejecuciones recientes (30 días):** ${analysis.summary?.recentRuns || 0}
- **Promedio archivos por ejecución:** ${analysis.summary?.avgFilesPerRun || 0}

## 🔧 Análisis por Fixer

${Object.entries(analysis.byFixer || {}).map(([fixer, stats]) => `
### ${fixer}
- **Ejecuciones:** ${stats.totalRuns}
- **Archivos procesados:** ${stats.totalFiles}
- **Promedio por ejecución:** ${stats.avgFilesPerRun}
- **Última ejecución:** ${stats.lastRun}
`).join('')}

## 🎯 Patrones Detectados

### Archivos Recurrentes
${Object.entries(analysis.patterns?.recurringFiles || {}).map(([file, count]) => 
  `- \`${file}\`: ${count} veces`
).join('\n')}

## 💡 Recomendaciones

${(analysis.recommendations || []).map((rec, index) => `
### ${index + 1}. ${rec.title} (${rec.priority})
**Tipo:** ${rec.type}
**Descripción:** ${rec.description}
**Acción:** ${rec.action}
${rec.files ? `**Archivos:** ${rec.files.slice(0, 5).join(', ')}${rec.files.length > 5 ? '...' : ''}` : ''}
`).join('')}

## 📈 Conclusiones

${this.generateConclusions(analysis)}

---
*Generado automáticamente por MetricsCollector v1.0*
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📊 Reporte generado: ${reportPath}`);
    
    return reportPath;
  }

  /**
   * Generar conclusiones del análisis
   */
  generateConclusions(analysis) {
    const conclusions = [];
    
    if ((analysis.summary?.totalRuns || 0) > 10) {
      conclusions.push('El sistema de auto-fix está siendo utilizado activamente.');
    }
    
    if (Object.keys(analysis.patterns?.recurringFiles || {}).length > 0) {
      conclusions.push('Se detectaron archivos con errores recurrentes que requieren atención.');
    }
    
    if ((analysis.recommendations || []).some(r => r.priority === 'high')) {
      conclusions.push('Hay recomendaciones de alta prioridad que deberían implementarse pronto.');
    }
    
    if (conclusions.length === 0) {
      conclusions.push('El sistema está funcionando correctamente sin problemas significativos.');
    }
    
    return conclusions.join('\n\n');
  }

  /**
   * Ejecutar análisis completo y generar reporte
   */
  async run() {
    console.log('📊 Ejecutando análisis de métricas...\n');
    
    const analysis = this.analyzeTrends();
    const reportPath = this.generateReport();
    
    console.log('\n✅ Análisis completado:');
    console.log(`   📈 ${analysis.summary?.totalRuns || 0} ejecuciones analizadas`);
    console.log(`   🔧 ${analysis.summary?.uniqueFixers || 0} fixers únicos`);
    console.log(`   💡 ${(analysis.recommendations || []).length} recomendaciones generadas`);
    console.log(`   📄 Reporte: ${reportPath}`);
    
    return {
      analysis,
      reportPath
    };
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const collector = new MetricsCollector();
  collector.run().catch(console.error);
}

module.exports = MetricsCollector;