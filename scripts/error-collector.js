#!/usr/bin/env node

/**
 * Error Collector - Puente simple hacia GitHub Copilot Agent
 * 
 * NO intenta arreglar errores - solo los recolecta y estructura
 * para pasárselos a GitHub Copilot Agent quien decide cómo proceder
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ErrorCollector {
  constructor() {
    this.errors = [];
    this.context = {
      project: 'Forestech Colombia',
      framework: 'React + Vite',
      database: 'Firebase',
      type: 'Monorepo (alimentacion + combustibles)',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Ejecuta comando y captura errores
   */
  async runCommand(command, workdir = '.') {
    return new Promise((resolve) => {
      exec(command, { cwd: workdir }, (error, stdout, stderr) => {
        resolve({
          success: error === null,
          exitCode: error?.code || 0,
          stdout: stdout || '',
          stderr: stderr || '',
          command,
          workdir
        });
      });
    });
  }

  /**
   * Ejecuta linting y recolecta errores
   */
  async collectLintErrors() {
    console.log('🔍 Recolectando errores de linting...');
    
    const commands = [
      { cmd: 'npm run lint --workspace=alimentacion', name: 'Alimentacion Lint' },
      { cmd: 'npm run lint --workspace=combustibles', name: 'Combustibles Lint' }
    ];

    for (const { cmd, name } of commands) {
      const result = await this.runCommand(cmd);
      
      if (!result.success) {
        const lintErrors = this.parseLintOutput(result.stderr, name, result.stdout);
        this.errors.push(...lintErrors);
      }
    }
  }

  /**
   * Ejecuta build y recolecta errores
   */
  async collectBuildErrors() {
    console.log('🏗️ Recolectando errores de build...');
    
    const commands = [
      { cmd: 'npm run build --workspace=alimentacion', name: 'Alimentacion Build' },
      { cmd: 'npm run build --workspace=combustibles', name: 'Combustibles Build' }
    ];

    for (const { cmd, name } of commands) {
      const result = await this.runCommand(cmd);
      
      if (!result.success) {
        const buildErrors = this.parseBuildOutput(result.stderr, name);
        this.errors.push(...buildErrors);
      }
    }
  }

  /**
   * Parsea output de ESLint
   */
  parseLintOutput(output, source, stdout = '') {
    const errors = [];
    const allOutput = output + '\n' + stdout; // Combinar stderr y stdout
    const lines = allOutput.split('\n');
    
    let currentFile = null;
    
    for (const line of lines) {
      // Detectar archivo: /path/to/file.jsx (línea que empieza con / y termina en .jsx/.js/.ts/.tsx)
      if (line.match(/^\/.*\.(jsx?|tsx?)$/)) {
        currentFile = line.trim();
        continue;
      }
      
      // Detectar error: "   10:7   error  mensaje  regla"
      const errorMatch = line.match(/^\s*(\d+):(\d+)\s+(error|warning)\s+(.+?)\s+([a-z0-9-_/]+)$/);
      if (errorMatch && currentFile) {
        const [_, lineNum, colNum, severity, message, rule] = errorMatch;
        
        errors.push({
          type: 'lint',
          source,
          severity,
          file: currentFile,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          message: message.trim(),
          rule: rule.trim(),
          context: this.getFileContext(currentFile, parseInt(lineNum))
        });
      }
    }
    
    return errors;
  }

  /**
   * Parsea output de build (Vite/TypeScript)
   */
  parseBuildOutput(output, source) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Detectar errores de TypeScript: src/file.tsx(10,5): error TS...
      const tsMatch = line.match(/^(.+\.tsx?)\((\d+),(\d+)\):\s*(error|warning)\s+(\w+):\s*(.+)$/);
      if (tsMatch) {
        const [_, file, lineNum, colNum, severity, code, message] = tsMatch;
        
        errors.push({
          type: 'typescript',
          source,
          severity,
          file: file,
          line: parseInt(lineNum),
          column: parseInt(colNum),
          message: message.trim(),
          code: code.trim(),
          context: this.getFileContext(file, parseInt(lineNum))
        });
        continue;
      }
      
      // Detectar errores generales de build
      if (line.includes('error') || line.includes('Error')) {
        errors.push({
          type: 'build',
          source,
          severity: 'error',
          message: line.trim(),
          context: null
        });
      }
    }
    
    return errors;
  }

  /**
   * Obtiene contexto de líneas alrededor del error
   */
  getFileContext(filePath, lineNumber, contextLines = 3) {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      const start = Math.max(0, lineNumber - contextLines - 1);
      const end = Math.min(lines.length, lineNumber + contextLines);
      
      const contextContent = lines.slice(start, end).map((line, index) => ({
        lineNumber: start + index + 1,
        content: line,
        isErrorLine: start + index + 1 === lineNumber
      }));
      
      return {
        totalLines: lines.length,
        contextStart: start + 1,
        contextEnd: end,
        lines: contextContent
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Genera contexto estructurado para GitHub Copilot Agent
   */
  generateCopilotContext() {
    if (this.errors.length === 0) {
      return {
        status: 'success',
        message: 'No errors detected',
        context: this.context
      };
    }

    // Agrupar errores por tipo y archivo
    const errorsByType = this.groupErrorsByType();
    const errorsByFile = this.groupErrorsByFile();
    const summary = this.generateErrorSummary();

    return {
      status: 'errors_detected',
      summary,
      context: this.context,
      errors: {
        total: this.errors.length,
        byType: errorsByType,
        byFile: errorsByFile,
        detailed: this.errors
      },
      copilotPrompt: this.generateCopilotPrompt(summary, errorsByType)
    };
  }

  /**
   * Agrupa errores por tipo
   */
  groupErrorsByType() {
    const grouped = {};
    
    this.errors.forEach(error => {
      const key = error.type;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(error);
    });
    
    return grouped;
  }

  /**
   * Agrupa errores por archivo
   */
  groupErrorsByFile() {
    const grouped = {};
    
    this.errors.forEach(error => {
      if (error.file) {
        const key = error.file;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(error);
      }
    });
    
    return grouped;
  }

  /**
   * Genera resumen de errores
   */
  generateErrorSummary() {
    const typeCount = {};
    const severityCount = {};
    
    this.errors.forEach(error => {
      typeCount[error.type] = (typeCount[error.type] || 0) + 1;
      severityCount[error.severity] = (severityCount[error.severity] || 0) + 1;
    });
    
    return {
      totalErrors: this.errors.length,
      byType: typeCount,
      bySeverity: severityCount,
      uniqueFiles: new Set(this.errors.map(e => e.file).filter(Boolean)).size
    };
  }

  /**
   * Genera prompt específico para GitHub Copilot Agent
   */
  generateCopilotPrompt(summary, errorsByType) {
    return `## 🚨 Forestech Build Errors - GitHub Copilot Agent Request

### Project Context
- **Project**: ${this.context.project}
- **Framework**: ${this.context.framework}
- **Database**: ${this.context.database}
- **Type**: ${this.context.type}
- **Timestamp**: ${this.context.timestamp}

### Error Summary
- **Total Errors**: ${summary.totalErrors}
- **Unique Files**: ${summary.uniqueFiles}
- **Error Types**: ${Object.entries(summary.byType).map(([type, count]) => `${type} (${count})`).join(', ')}
- **Severity**: ${Object.entries(summary.bySeverity).map(([sev, count]) => `${sev} (${count})`).join(', ')}

### Error Breakdown by Type
${Object.entries(errorsByType).map(([type, errors]) => `
#### ${type.toUpperCase()} Errors (${errors.length})
${errors.slice(0, 5).map(error => `
- **File**: \`${error.file || 'unknown'}\`${error.line ? `:${error.line}` : ''}
- **Message**: ${error.message}
- **Rule/Code**: ${error.rule || error.code || 'N/A'}
${error.context ? `- **Context**: Lines ${error.context.contextStart}-${error.context.contextEnd}` : ''}
`).join('\n')}
${errors.length > 5 ? `... and ${errors.length - 5} more ${type} errors` : ''}
`).join('\n')}

### Request to GitHub Copilot Agent
Please analyze these Forestech build errors and provide specific fixes. Focus on:

1. **Root Cause Analysis**: What's causing these specific error patterns?
2. **Targeted Fixes**: Specific code changes for each error type
3. **Prevent Recurrence**: Recommendations to avoid similar issues
4. **Testing Strategy**: How to verify fixes work correctly

**Important**: This is a production React + Vite + Firebase application. Ensure fixes maintain:
- Code quality and consistency
- React best practices
- Firebase integration
- Monorepo structure integrity

Please provide actionable fixes for these specific errors.`;
  }

  /**
   * Guarda contexto en archivo para GitHub Actions
   */
  saveContextForGitHub(outputPath = './error-context.json') {
    const context = this.generateCopilotContext();
    fs.writeFileSync(outputPath, JSON.stringify(context, null, 2));
    console.log(`📄 Contexto guardado en: ${outputPath}`);
    return outputPath;
  }

  /**
   * Ejecuta recolección completa
   */
  async run() {
    console.log('🔍 Error Collector - Iniciando recolección...\n');
    
    // Recolectar errores de lint
    await this.collectLintErrors();
    
    // Recolectar errores de build
    await this.collectBuildErrors();
    
    // Generar contexto
    const context = this.generateCopilotContext();
    
    // Mostrar resumen
    console.log('\n📊 Resumen de recolección:');
    if (context.status === 'success') {
      console.log('   ✅ No se detectaron errores');
    } else {
      console.log(`   🚨 ${context.summary.totalErrors} errores detectados`);
      console.log(`   📁 ${context.summary.uniqueFiles} archivos afectados`);
      console.log(`   🔧 Tipos: ${Object.keys(context.errors.byType).join(', ')}`);
    }
    
    // Guardar para GitHub Actions
    this.saveContextForGitHub();
    
    return context;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const collector = new ErrorCollector();
  collector.run().catch(console.error);
}

module.exports = ErrorCollector;