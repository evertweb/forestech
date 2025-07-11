#!/usr/bin/env node

/**
 * Script para fix automático de variables de entorno no definidas
 * Maneja casos como 'process' is not defined y otros globals
 */

const fs = require('fs');
const path = require('path');

class EnvironmentVarsFixer {
  constructor() {
    this.fixedFiles = [];
    this.stats = {
      addedGlobals: 0,
      addedImports: 0,
      replacedVars: 0
    };
  }

  /**
   * Lista de errores conocidos de variables de entorno
   */
  getKnownEnvironmentVars() {
    return [
      {
        file: 'combustibles/src/App.jsx',
        line: 38,
        variable: 'process',
        action: 'replace_with_import',
        replacement: 'import.meta.env'
      }
    ];
  }

  /**
   * Ejecuta el fix para todas las variables de entorno
   */
  async run() {
    console.log('🔧 Fixing environment variables...\n');
    
    const envVars = this.getKnownEnvironmentVars();
    
    for (const envVar of envVars) {
      await this.fixEnvironmentVar(envVar);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n✅ Archivos corregidos:');
      this.fixedFiles.forEach(file => console.log(`   ✓ ${file}`));
      console.log(`\n📊 Estadísticas:`);
      console.log(`   🌍 Globals agregados: ${this.stats.addedGlobals}`);
      console.log(`   📦 Imports agregados: ${this.stats.addedImports}`);
      console.log(`   🔄 Variables reemplazadas: ${this.stats.replacedVars}`);
      console.log(`\n🎉 ${this.fixedFiles.length} archivos corregidos automáticamente`);
    } else {
      console.log('⚠️  No se aplicaron cambios');
    }
  }

  /**
   * Fix específico para variable de entorno
   */
  async fixEnvironmentVar(envVar) {
    const filePath = envVar.file;
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`📍 Procesando variable '${envVar.variable}' en ${filePath}:${envVar.line}`);

    let modified = false;

    switch (envVar.action) {
      case 'replace_with_import':
        modified = await this.replaceWithImportMeta(lines, envVar);
        break;
      case 'add_global':
        modified = await this.addGlobalDeclaration(lines, envVar);
        break;
      default:
        console.log(`⚠️  Acción no reconocida: ${envVar.action}`);
        return;
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      
      if (!this.fixedFiles.includes(filePath)) {
        this.fixedFiles.push(filePath);
      }
      
      console.log(`✓ Variable de entorno '${envVar.variable}' corregida en ${filePath}:${envVar.line}`);
    }
  }

  /**
   * Reemplazar process.env con import.meta.env para Vite
   */
  async replaceWithImportMeta(lines, envVar) {
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Reemplazar process.env con import.meta.env
      if (line.includes('process.env')) {
        const newLine = line.replace(/process\.env/g, 'import.meta.env');
        lines[i] = newLine;
        this.stats.replacedVars++;
        modified = true;
        console.log(`   📝 Línea ${i + 1}: "${line.trim()}" → "${newLine.trim()}"`);
      }
      
      // Reemplazar process.NODE_ENV con import.meta.env.NODE_ENV
      if (line.includes('process.NODE_ENV')) {
        const newLine = line.replace(/process\.NODE_ENV/g, 'import.meta.env.NODE_ENV');
        lines[i] = newLine;
        this.stats.replacedVars++;
        modified = true;
        console.log(`   📝 Línea ${i + 1}: "${line.trim()}" → "${newLine.trim()}"`);
      }
    }
    
    return modified;
  }

  /**
   * Agregar declaración global para variable
   */
  async addGlobalDeclaration(lines, envVar) {
    const variable = envVar.variable;
    
    // Verificar si ya existe una declaración global
    const hasGlobalDeclaration = lines.some(line => 
      line.includes(`/* global ${variable}`) || 
      line.includes(`// global ${variable}`)
    );
    
    if (!hasGlobalDeclaration) {
      // Agregar declaración global al principio del archivo
      const globalComment = `/* global ${variable} */`;
      lines.unshift(globalComment);
      this.stats.addedGlobals++;
      return true;
    }
    
    return false;
  }

  /**
   * Obtener reemplazo apropiado para variable
   */
  getReplacementForVariable(variable) {
    const replacements = {
      'process': 'import.meta.env',
      'global': 'globalThis',
      'window': 'globalThis',
      '__dirname': 'import.meta.url',
      '__filename': 'import.meta.url'
    };
    
    return replacements[variable] || variable;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const fixer = new EnvironmentVarsFixer();
  fixer.run().catch(console.error);
}

module.exports = EnvironmentVarsFixer;