#!/usr/bin/env node

/**
 * Auto-fix script para warnings comunes de ESLint en React
 * Soluciona automáticamente:
 * - Missing dependencies en useEffect/useMemo
 * - Fast refresh warnings por exports mixtos
 */

const fs = require('fs');
const path = require('path');

class ReactLintAutoFixer {
  constructor() {
    this.fixedFiles = [];
    this.warnings = [];
  }

  /**
   * Ejecuta el proceso completo de auto-fix
   */
  async run() {
    console.log('🔧 Iniciando auto-fix de React lints...\n');
    
    // Ejecutar lint y capturar warnings
    await this.getLintWarnings();
    
    if (this.warnings.length === 0) {
      console.log('✅ No hay warnings de lint para corregir');
      return;
    }

    console.log(`📋 Encontrados ${this.warnings.length} warnings para corregir:`);
    this.warnings.forEach(w => console.log(`   - ${w.file}:${w.line} - ${w.rule}`));
    console.log();

    // Aplicar fixes
    for (const warning of this.warnings) {
      await this.fixWarning(warning);
    }

    // Resumen
    if (this.fixedFiles.length > 0) {
      console.log('✅ Auto-fix completado:');
      this.fixedFiles.forEach(file => console.log(`   ✓ ${file}`));
      console.log(`\n🎉 ${this.fixedFiles.length} archivos corregidos automáticamente`);
    } else {
      console.log('⚠️  No se pudieron aplicar fixes automáticos');
    }
  }

  /**
   * Obtiene warnings de lint ejecutando eslint
   */
  async getLintWarnings() {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    try {
      // Ejecutar lint en ambas apps
      const apps = ['alimentacion', 'combustibles'];
      
      for (const app of apps) {
        try {
          await execAsync(`cd ${app} && npm run lint`);
        } catch (error) {
          // ESLint retorna exit code 1 cuando hay warnings, parseamos la salida
          this.parseLintOutput(error.stdout || error.stderr || '', app);
        }
      }
    } catch (error) {
      console.error('Error ejecutando lint:', error.message);
    }
  }

  /**
   * Parsea la salida de ESLint para extraer warnings
   */
  parseLintOutput(output, app) {
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Patrón: archivo:línea:columna mensaje [regla]
      const match = line.match(/(.+):(\d+):(\d+):\s+(.+?)\s+([a-z-]+\/[a-z-]+)/);
      if (match) {
        const [, file, lineNum, , message, rule] = match;
        
        // Solo procesar rules que podemos fix automáticamente
        if (this.canAutoFix(rule)) {
          this.warnings.push({
            app,
            file: path.join(app, file),
            line: parseInt(lineNum),
            message,
            rule
          });
        }
      }
    }
  }

  /**
   * Determina si una regla se puede fix automáticamente
   */
  canAutoFix(rule) {
    const autoFixableRules = [
      'react-hooks/exhaustive-deps',
      'react-refresh/only-export-components'
    ];
    return autoFixableRules.includes(rule);
  }

  /**
   * Aplica fix para un warning específico
   */
  async fixWarning(warning) {
    try {
      switch (warning.rule) {
        case 'react-hooks/exhaustive-deps':
          await this.fixMissingDependencies(warning);
          break;
        case 'react-refresh/only-export-components':
          await this.fixFastRefresh(warning);
          break;
        default:
          console.log(`⚠️  No hay auto-fix para regla: ${warning.rule}`);
      }
    } catch (error) {
      console.error(`❌ Error aplicando fix en ${warning.file}:`, error.message);
    }
  }

  /**
   * Fix para dependencias faltantes en useEffect/useMemo
   */
  async fixMissingDependencies(warning) {
    const filePath = warning.file;
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const targetLine = lines[warning.line - 1];

    // Buscar el hook correspondiente (useEffect, useMemo, etc.)
    const hookMatch = warning.message.match(/React Hook (\w+) has a missing dependency: '([^']+)'/);
    if (!hookMatch) return;

    const [, hookName, missingDep] = hookMatch;
    
    // Buscar el array de dependencias en las líneas siguientes
    let depArrayLineIndex = -1;
    let depArrayLine = '';
    
    for (let i = warning.line - 1; i < Math.min(lines.length, warning.line + 10); i++) {
      if (lines[i].includes('], [')) {
        depArrayLineIndex = i;
        depArrayLine = lines[i];
        break;
      }
    }

    if (depArrayLineIndex === -1) return;

    // Extraer dependencias actuales
    const depsMatch = depArrayLine.match(/\[([^\]]*)\]/);
    if (!depsMatch) return;

    const currentDeps = depsMatch[1]
      .split(',')
      .map(dep => dep.trim().replace(/['"]/g, ''))
      .filter(dep => dep.length > 0);

    // Agregar la dependencia faltante si no existe
    if (!currentDeps.includes(missingDep)) {
      currentDeps.push(missingDep);
      
      // Reconstruir la línea
      const newDepsStr = currentDeps.map(dep => `'${dep}'`).join(', ');
      const newLine = depArrayLine.replace(/\[([^\]]*)\]/, `[${newDepsStr}]`);
      
      lines[depArrayLineIndex] = newLine;
      
      // Guardar el archivo
      fs.writeFileSync(filePath, lines.join('\n'));
      
      if (!this.fixedFiles.includes(filePath)) {
        this.fixedFiles.push(filePath);
      }
      
      console.log(`✓ Agregada dependencia '${missingDep}' en ${filePath}:${warning.line}`);
    }
  }

  /**
   * Fix para Fast Refresh warnings
   */
  async fixFastRefresh(warning) {
    // Para Fast Refresh, generalmente necesitamos reestructurar exports
    // Por ahora solo reportamos, ya que requiere análisis más complejo
    console.log(`⚠️  Fast Refresh fix requerido en ${warning.file} - requiere revisión manual`);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const fixer = new ReactLintAutoFixer();
  fixer.run().catch(console.error);
}

module.exports = ReactLintAutoFixer;