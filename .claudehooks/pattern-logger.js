#!/usr/bin/env node

/**
 * 📊 Pattern Logger - Forestech
 * Sistema de logging mejorado para tracking de patrones de uso
 * 
 * Características:
 * - Logging inteligente de patrones de uso
 * - Análisis de tendencias temporales
 * - Métricas de performance y efectividad
 * - Reportes automáticos de insights
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PatternLogger {
  constructor() {
    this.logDir = path.join(__dirname, 'logs');
    this.configFile = path.join(__dirname, 'logger-config.json');
    this.config = this.loadConfig();
    this.sessionId = this.generateSessionId();
    this.initializeLogDir();
  }

  loadConfig() {
    const defaultConfig = {
      enableLogging: true,
      logLevel: 'info',
      retentionDays: 30,
      maxLogSize: 10 * 1024 * 1024, // 10MB
      enableMetrics: true,
      enableTrends: true,
      enableInsights: true,
      logFiles: {
        usage: 'usage-patterns.log',
        performance: 'performance-metrics.log',
        errors: 'error-patterns.log',
        insights: 'insights-reports.log',
        trends: 'trend-analysis.log'
      },
      patterns: {
        trackUserPrompts: true,
        trackContextSwitches: true,
        trackTaskTypes: true,
        trackPerformance: true,
        trackErrors: true,
        trackWorkflows: true
      }
    };

    if (fs.existsSync(this.configFile)) {
      try {
        const userConfig = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        return { ...defaultConfig, ...userConfig };
      } catch (error) {
        console.warn('⚠️  Error loading logger config, using defaults:', error.message);
      }
    }

    return defaultConfig;
  }

  generateSessionId() {
    return crypto.randomBytes(8).toString('hex');
  }

  initializeLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Logging principal de patrones de uso
  logUsagePattern(pattern) {
    if (!this.config.enableLogging || !this.config.patterns.trackUserPrompts) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'usage_pattern',
      pattern: {
        userPrompt: pattern.prompt?.substring(0, 200) + '...',
        promptLength: pattern.prompt?.length || 0,
        taskType: pattern.taskType || 'unknown',
        app: pattern.app || 'general',
        complexity: pattern.complexity || 'medium',
        confidence: pattern.confidence || 0,
        workingDir: pattern.workingDir ? path.basename(pattern.workingDir) : 'unknown'
      },
      metadata: {
        os: process.platform,
        nodeVersion: process.version,
        workingDirectory: process.cwd()
      }
    };

    this.writeLog('usage', logEntry);
  }

  // Logging de cambios de contexto
  logContextSwitch(contextInfo) {
    if (!this.config.enableLogging || !this.config.patterns.trackContextSwitches) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'context_switch',
      context: {
        from: contextInfo.from || 'unknown',
        to: contextInfo.to || 'unknown',
        app: contextInfo.app || 'general',
        workingDir: contextInfo.workingDir ? path.basename(contextInfo.workingDir) : 'unknown',
        features: contextInfo.features || [],
        confidence: contextInfo.confidence || 0
      },
      timing: {
        switchTime: contextInfo.switchTime || 0,
        loadTime: contextInfo.loadTime || 0
      }
    };

    this.writeLog('usage', logEntry);
  }

  // Logging de métricas de performance
  logPerformance(metrics) {
    if (!this.config.enableLogging || !this.config.patterns.trackPerformance) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'performance',
      metrics: {
        taskType: metrics.taskType || 'unknown',
        app: metrics.app || 'general',
        executionTime: metrics.executionTime || 0,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        fileOperations: metrics.fileOperations || 0,
        networkRequests: metrics.networkRequests || 0,
        cacheHits: metrics.cacheHits || 0,
        cacheMisses: metrics.cacheMisses || 0
      },
      context: {
        workingDir: metrics.workingDir ? path.basename(metrics.workingDir) : 'unknown',
        filesModified: metrics.filesModified || 0,
        linesChanged: metrics.linesChanged || 0
      }
    };

    this.writeLog('performance', logEntry);
  }

  // Logging de errores y patrones problemáticos
  logError(error, context = {}) {
    if (!this.config.enableLogging || !this.config.patterns.trackErrors) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'error',
      error: {
        message: error.message || 'Unknown error',
        stack: error.stack ? error.stack.split('\n').slice(0, 5) : [],
        type: error.constructor.name || 'Error',
        code: error.code || 'UNKNOWN'
      },
      context: {
        taskType: context.taskType || 'unknown',
        app: context.app || 'general',
        workingDir: context.workingDir ? path.basename(context.workingDir) : 'unknown',
        operation: context.operation || 'unknown',
        userPrompt: context.userPrompt?.substring(0, 100) + '...' || 'unknown'
      },
      recovery: {
        attempted: context.recoveryAttempted || false,
        successful: context.recoverySuccessful || false,
        method: context.recoveryMethod || 'none'
      }
    };

    this.writeLog('errors', logEntry);
  }

  // Logging de workflows completados
  logWorkflow(workflow) {
    if (!this.config.enableLogging || !this.config.patterns.trackWorkflows) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'workflow',
      workflow: {
        name: workflow.name || 'unknown',
        taskType: workflow.taskType || 'unknown',
        app: workflow.app || 'general',
        steps: workflow.steps || [],
        completedSteps: workflow.completedSteps || 0,
        totalSteps: workflow.totalSteps || 0,
        success: workflow.success || false,
        duration: workflow.duration || 0
      },
      results: {
        filesModified: workflow.filesModified || 0,
        linesAdded: workflow.linesAdded || 0,
        linesDeleted: workflow.linesDeleted || 0,
        testsAdded: workflow.testsAdded || 0,
        bugsFixed: workflow.bugsFixed || 0
      }
    };

    this.writeLog('usage', logEntry);
  }

  // Análisis de tendencias
  analyzeTrends() {
    if (!this.config.enableTrends) return null;

    const usageLog = this.readLog('usage');
    if (!usageLog || usageLog.length === 0) return null;

    const trends = {
      timestamp: new Date().toISOString(),
      period: 'last_24h',
      analysis: {
        totalInteractions: usageLog.length,
        taskTypeDistribution: this.getTaskTypeDistribution(usageLog),
        appUsageDistribution: this.getAppUsageDistribution(usageLog),
        complexityTrends: this.getComplexityTrends(usageLog),
        timePatterns: this.getTimePatterns(usageLog),
        performanceMetrics: this.getPerformanceMetrics(),
        errorPatterns: this.getErrorPatterns()
      },
      insights: this.generateInsights(usageLog)
    };

    this.writeLog('trends', trends);
    return trends;
  }

  getTaskTypeDistribution(logs) {
    const distribution = {};
    logs.forEach(log => {
      if (log.pattern?.taskType) {
        distribution[log.pattern.taskType] = (distribution[log.pattern.taskType] || 0) + 1;
      }
    });
    return distribution;
  }

  getAppUsageDistribution(logs) {
    const distribution = {};
    logs.forEach(log => {
      if (log.pattern?.app) {
        distribution[log.pattern.app] = (distribution[log.pattern.app] || 0) + 1;
      }
    });
    return distribution;
  }

  getComplexityTrends(logs) {
    const trends = {};
    logs.forEach(log => {
      if (log.pattern?.complexity) {
        trends[log.pattern.complexity] = (trends[log.pattern.complexity] || 0) + 1;
      }
    });
    return trends;
  }

  getTimePatterns(logs) {
    const hourlyDistribution = {};
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
    });
    return { hourlyDistribution };
  }

  getPerformanceMetrics() {
    const performanceLog = this.readLog('performance');
    if (!performanceLog || performanceLog.length === 0) return {};

    const metrics = {
      averageExecutionTime: 0,
      averageMemoryUsage: 0,
      totalFileOperations: 0,
      cacheEfficiency: 0
    };

    const totalEntries = performanceLog.length;
    performanceLog.forEach(entry => {
      metrics.averageExecutionTime += entry.metrics.executionTime || 0;
      metrics.averageMemoryUsage += entry.metrics.memoryUsage?.heapUsed || 0;
      metrics.totalFileOperations += entry.metrics.fileOperations || 0;
      
      const cacheHits = entry.metrics.cacheHits || 0;
      const cacheMisses = entry.metrics.cacheMisses || 0;
      if (cacheHits + cacheMisses > 0) {
        metrics.cacheEfficiency += cacheHits / (cacheHits + cacheMisses);
      }
    });

    metrics.averageExecutionTime /= totalEntries;
    metrics.averageMemoryUsage /= totalEntries;
    metrics.cacheEfficiency = (metrics.cacheEfficiency / totalEntries) * 100;

    return metrics;
  }

  getErrorPatterns() {
    const errorLog = this.readLog('errors');
    if (!errorLog || errorLog.length === 0) return {};

    const patterns = {
      totalErrors: errorLog.length,
      errorTypes: {},
      frequentErrors: {},
      recoverySuccess: 0
    };

    errorLog.forEach(entry => {
      // Contar tipos de error
      patterns.errorTypes[entry.error.type] = (patterns.errorTypes[entry.error.type] || 0) + 1;
      
      // Contar errores frecuentes
      patterns.frequentErrors[entry.error.message] = (patterns.frequentErrors[entry.error.message] || 0) + 1;
      
      // Contar recoveries exitosos
      if (entry.recovery.successful) {
        patterns.recoverySuccess++;
      }
    });

    patterns.recoverySuccessRate = (patterns.recoverySuccess / patterns.totalErrors) * 100;

    return patterns;
  }

  generateInsights(logs) {
    const insights = [];
    
    // Insight sobre productividad
    const taskTypes = this.getTaskTypeDistribution(logs);
    const mostCommonTask = Object.keys(taskTypes).reduce((a, b) => taskTypes[a] > taskTypes[b] ? a : b);
    insights.push({
      type: 'productivity',
      message: `Tipo de tarea más común: ${mostCommonTask} (${taskTypes[mostCommonTask]} veces)`,
      suggestion: 'Considera crear templates para este tipo de tarea'
    });

    // Insight sobre apps más usadas
    const appUsage = this.getAppUsageDistribution(logs);
    const mostUsedApp = Object.keys(appUsage).reduce((a, b) => appUsage[a] > appUsage[b] ? a : b);
    insights.push({
      type: 'app_usage',
      message: `App más utilizada: ${mostUsedApp} (${appUsage[mostUsedApp]} veces)`,
      suggestion: 'Considera optimizar workflows específicos para esta app'
    });

    // Insight sobre errores
    const errorPatterns = this.getErrorPatterns();
    if (errorPatterns.totalErrors > 0) {
      insights.push({
        type: 'error_analysis',
        message: `${errorPatterns.totalErrors} errores detectados, ${errorPatterns.recoverySuccessRate.toFixed(1)}% de recovery exitoso`,
        suggestion: 'Revisa los errores más frecuentes para mejorar la robustez'
      });
    }

    return insights;
  }

  // Generar reporte de insights
  generateInsightsReport() {
    if (!this.config.enableInsights) return null;

    const trends = this.analyzeTrends();
    if (!trends) return null;

    const report = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      type: 'insights_report',
      summary: {
        totalInteractions: trends.analysis.totalInteractions,
        timeframe: trends.period,
        topTaskType: this.getTopEntry(trends.analysis.taskTypeDistribution),
        topApp: this.getTopEntry(trends.analysis.appUsageDistribution),
        averageComplexity: this.getAverageComplexity(trends.analysis.complexityTrends)
      },
      recommendations: this.generateRecommendations(trends),
      actionItems: this.generateActionItems(trends)
    };

    this.writeLog('insights', report);
    return report;
  }

  getTopEntry(distribution) {
    if (!distribution || Object.keys(distribution).length === 0) return 'unknown';
    return Object.keys(distribution).reduce((a, b) => distribution[a] > distribution[b] ? a : b);
  }

  getAverageComplexity(complexityTrends) {
    const complexityWeights = { simple: 1, medium: 2, complex: 3 };
    let totalWeight = 0;
    let totalTasks = 0;

    Object.entries(complexityTrends).forEach(([complexity, count]) => {
      const weight = complexityWeights[complexity] || 2;
      totalWeight += weight * count;
      totalTasks += count;
    });

    return totalTasks > 0 ? totalWeight / totalTasks : 2;
  }

  generateRecommendations(trends) {
    const recommendations = [];
    
    // Recomendaciones basadas en el análisis
    if (trends.analysis.totalInteractions > 50) {
      recommendations.push('Considera crear shortcuts para las tareas más frecuentes');
    }

    if (trends.analysis.performanceMetrics.averageExecutionTime > 5000) {
      recommendations.push('Optimiza los workflows más lentos para mejorar productividad');
    }

    if (trends.analysis.errorPatterns.totalErrors > 10) {
      recommendations.push('Implementa mejor manejo de errores para reducir interrupciones');
    }

    return recommendations;
  }

  generateActionItems(trends) {
    const actionItems = [];
    
    // Items de acción específicos
    const topApp = this.getTopEntry(trends.analysis.appUsageDistribution);
    if (topApp !== 'unknown') {
      actionItems.push(`Crear templates específicos para ${topApp}`);
    }

    const topTaskType = this.getTopEntry(trends.analysis.taskTypeDistribution);
    if (topTaskType !== 'unknown') {
      actionItems.push(`Optimizar workflow para tareas tipo ${topTaskType}`);
    }

    return actionItems;
  }

  // Utilidades para escritura y lectura de logs
  writeLog(logType, entry) {
    if (!this.config.enableLogging) return;

    const logFile = path.join(this.logDir, this.config.logFiles[logType]);
    const logLine = JSON.stringify(entry) + '\n';
    
    try {
      fs.appendFileSync(logFile, logLine);
      this.rotateLogIfNeeded(logFile);
    } catch (error) {
      console.error(`Error writing to ${logType} log:`, error.message);
    }
  }

  readLog(logType) {
    const logFile = path.join(this.logDir, this.config.logFiles[logType]);
    
    if (!fs.existsSync(logFile)) return [];
    
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      return content.trim().split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
    } catch (error) {
      console.error(`Error reading ${logType} log:`, error.message);
      return [];
    }
  }

  rotateLogIfNeeded(logFile) {
    try {
      const stats = fs.statSync(logFile);
      if (stats.size > this.config.maxLogSize) {
        const rotatedFile = logFile + '.old';
        fs.renameSync(logFile, rotatedFile);
        console.log(`📋 Log rotated: ${path.basename(logFile)}`);
      }
    } catch (error) {
      console.error('Error rotating log:', error.message);
    }
  }

  // Cleanup de logs antiguos
  cleanupOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    Object.values(this.config.logFiles).forEach(logFile => {
      const fullPath = path.join(this.logDir, logFile);
      const oldPath = fullPath + '.old';
      
      [fullPath, oldPath].forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          if (stats.mtime < cutoffDate) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Cleaned up old log: ${path.basename(filePath)}`);
          }
        }
      });
    });
  }
}

// Main execution
function main() {
  const logger = new PatternLogger();
  
  console.log('📊 Pattern Logger - Forestech');
  console.log(`📁 Log directory: ${logger.logDir}`);
  console.log(`🔧 Session ID: ${logger.sessionId}`);
  
  // Ejemplo de uso
  if (process.argv.includes('--analyze')) {
    const trends = logger.analyzeTrends();
    console.log('📈 Trends analysis:', trends);
  }
  
  if (process.argv.includes('--report')) {
    const report = logger.generateInsightsReport();
    console.log('📊 Insights report:', report);
  }
  
  if (process.argv.includes('--cleanup')) {
    logger.cleanupOldLogs();
    console.log('🗑️ Old logs cleaned up');
  }
  
  return logger;
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { PatternLogger, main };