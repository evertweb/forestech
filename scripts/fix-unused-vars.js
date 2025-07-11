#!/usr/bin/env node

/**
 * Script para fix automático de variables no utilizadas
 * Basado en los errores específicos del proyecto Forestech
 */

const fs = require('fs');
const path = require('path');

class UnusedVarsFixer {
  constructor() {
    this.fixedFiles = [];
    this.stats = {
      removedImports: 0,
      removedVariables: 0,
      renamedVariables: 0
    };
  }

  /**
   * Lista de errores conocidos de variables no utilizadas
   */
  getKnownUnusedVars() {
    return [
      {
        file: 'combustibles/src/components/Migration/PostMigrationAnalysis.jsx',
        line: 14,
        variable: 'selectedProduct',
        action: 'rename' // Renombrar a _selectedProduct
      },
      {
        file: 'combustibles/src/components/Migration/PostMigrationAnalysis.jsx',
        line: 6,
        variable: 'useEffect',
        action: 'remove' // Eliminar import
      },
      {
        file: 'combustibles/src/components/Migration/HistoricalDataMigration.jsx',
        line: 9,
        variable: 'parseHistoricalDate',
        action: 'rename' // Renombrar a _parseHistoricalDate
      },
      {
        file: 'combustibles/src/components/Migration/HistoricalDataMigration.jsx',
        line: 220,
        variable: 'e',
        action: 'rename' // Renombrar a _e
      },
      {
        file: 'combustibles/src/components/Inventory/InventoryCards.jsx',
        line: 31,
        variable: 'error',
        action: 'rename' // Renombrar a _error
      }
    ];
  }

  /**
   * Ejecuta el fix para todas las variables no utilizadas
   */
  async run() {
    console.log('🔧 Fixing unused variables...\n');
    
    const unusedVars = this.getKnownUnusedVars();
    
    for (const unusedVar of unusedVars) {
      await this.fixUnusedVariable(unusedVar);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n✅ Archivos corregidos:');
      this.fixedFiles.forEach(file => console.log(`   ✓ ${file}`));
      console.log(`\n📊 Estadísticas:`);
      console.log(`   🗑️  Imports removidos: ${this.stats.removedImports}`);
      console.log(`   🗑️  Variables removidas: ${this.stats.removedVariables}`);
      console.log(`   🔄 Variables renombradas: ${this.stats.renamedVariables}`);
      console.log(`\n🎉 ${this.fixedFiles.length} archivos corregidos automáticamente`);
    } else {
      console.log('⚠️  No se aplicaron cambios');
    }
  }

  /**
   * Fix específico para variable no utilizada
   */
  async fixUnusedVariable(unusedVar) {
    const filePath = unusedVar.file;
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    if (unusedVar.line > lines.length) {
      console.log(`⚠️  Línea ${unusedVar.line} no existe en ${filePath}`);
      return;
    }

    const targetLine = lines[unusedVar.line - 1];
    console.log(`📍 Procesando línea ${unusedVar.line}: "${targetLine.trim()}"`);

    let modified = false;

    switch (unusedVar.action) {
      case 'remove':
        modified = await this.removeUnusedImport(lines, unusedVar, targetLine);
        break;
      case 'rename':
        modified = await this.renameUnusedVariable(lines, unusedVar, targetLine);
        break;
      default:
        console.log(`⚠️  Acción no reconocida: ${unusedVar.action}`);
        return;
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      
      if (!this.fixedFiles.includes(filePath)) {
        this.fixedFiles.push(filePath);
      }
      
      console.log(`✓ Variable '${unusedVar.variable}' corregida en ${filePath}:${unusedVar.line}`);
    }
  }

  /**
   * Remover import no utilizado
   */
  async removeUnusedImport(lines, unusedVar, targetLine) {
    const variable = unusedVar.variable;
    
    // Detectar si es import individual o parte de destructuring
    if (targetLine.includes(`import React, { useState, ${variable} }`)) {
      // Remover de destructuring
      const newLine = targetLine.replace(new RegExp(`,\\s*${variable}`), '');
      lines[unusedVar.line - 1] = newLine;
      this.stats.removedImports++;
      return true;
    } else if (targetLine.includes(`import { ${variable} }`)) {
      // Remover import completo si es el único
      lines[unusedVar.line - 1] = '';
      this.stats.removedImports++;
      return true;
    }
    
    return false;
  }

  /**
   * Renombrar variable no utilizada con prefijo _
   */
  async renameUnusedVariable(lines, unusedVar, targetLine) {
    const variable = unusedVar.variable;
    const newVariableName = `_${variable}`;
    
    // Patrones comunes para renombrar
    const patterns = [
      // const [variable, setVariable] = useState();
      new RegExp(`const \\[${variable},`, 'g'),
      // const variable = something;
      new RegExp(`const ${variable}\\s*=`, 'g'),
      // let variable = something;
      new RegExp(`let ${variable}\\s*=`, 'g'),
      // function(variable) {}
      new RegExp(`\\(${variable}\\)`, 'g'),
      // catch(variable) {}
      new RegExp(`catch\\s*\\(${variable}\\)`, 'g'),
      // import destructuring
      new RegExp(`\\b${variable}\\b`, 'g')
    ];

    let modified = false;
    for (const pattern of patterns) {
      if (pattern.test(targetLine)) {
        const newLine = targetLine.replace(pattern, (match) => {
          return match.replace(variable, newVariableName);
        });
        
        if (newLine !== targetLine) {
          lines[unusedVar.line - 1] = newLine;
          this.stats.renamedVariables++;
          modified = true;
          break;
        }
      }
    }

    return modified;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const fixer = new UnusedVarsFixer();
  fixer.run().catch(console.error);
}

module.exports = UnusedVarsFixer;