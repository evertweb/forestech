#!/usr/bin/env node

/**
 * Script específico para fix de React Hooks dependencies
 * Basado en los warnings actuales del proyecto
 */

const fs = require('fs');
const path = require('path');

class ReactHooksFixer {
  constructor() {
    this.fixedFiles = [];
  }

  /**
   * Lista de warnings conocidos que podemos fix
   */
  getKnownWarnings() {
    return [
      {
        file: 'combustibles/src/components/Vehicles/VehicleModalNew.jsx',
        line: 90,
        missingDep: 'getInitialFormData'
      },
      {
        file: 'combustibles/src/components/Vehicles/VehicleModalNew.jsx', 
        line: 82,
        missingDep: 'loadCategories'
      },
      {
        file: 'combustibles/src/components/Vehicles/VehicleModal.jsx',
        line: 61,
        missingDep: 'getInitialFormData'
      },
      {
        file: 'combustibles/src/components/Vehicles/MaintenanceModal.jsx',
        line: 82,
        missingDep: 'getInitialFormData'
      },
      {
        file: 'combustibles/src/components/Movements/MovementWizard.jsx',
        line: 241,
        missingDep: 'validateCurrentStep'
      },
      {
        file: 'combustibles/src/components/Maintenance/MaintenanceModal.jsx',
        line: 85,
        missingDep: 'getInitialFormData'
      },
      {
        file: 'combustibles/src/components/Inventory/InventoryModal.jsx',
        line: 54,
        missingDep: 'formData.minThreshold'
      },
      {
        file: 'combustibles/src/components/Admin/AdminMain.jsx',
        line: 29,
        missingDep: 'loadInvitations'
      }
    ];
  }

  /**
   * Ejecuta el fix para todos los warnings conocidos
   */
  async run() {
    console.log('🔧 Fixing React Hooks dependencies...\n');
    
    const warnings = this.getKnownWarnings();
    
    for (const warning of warnings) {
      await this.fixMissingDependency(warning);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n✅ Archivos corregidos:');
      this.fixedFiles.forEach(file => console.log(`   ✓ ${file}`));
      console.log(`\n🎉 ${this.fixedFiles.length} archivos corregidos automáticamente`);
    } else {
      console.log('⚠️  No se aplicaron cambios');
    }
  }

  /**
   * Fix específico para dependencia faltante
   */
  async fixMissingDependency(warning) {
    const filePath = warning.file;
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Buscar el array de dependencias cerca de la línea indicada
    let depArrayLineIndex = -1;
    
    // Buscar hacia abajo desde la línea del warning (formato: }, [deps]);)
    for (let i = warning.line - 1; i < Math.min(lines.length, warning.line + 5); i++) {
      const line = lines[i].trim();
      if (line.includes('], [') || line.match(/},\s*\[.*\]\s*\)/)) {
        depArrayLineIndex = i;
        break;
      }
    }

    if (depArrayLineIndex === -1) {
      console.log(`⚠️  No se encontró array de dependencias en ${filePath}:${warning.line}`);
      console.log(`    Línea actual: "${lines[warning.line - 1]}"`);
      
      // Mostrar líneas alrededor para debug
      for (let i = Math.max(0, warning.line - 3); i < Math.min(lines.length, warning.line + 3); i++) {
        console.log(`    ${i + 1}: ${lines[i]}`);
      }
      return;
    }

    const depLine = lines[depArrayLineIndex];
    console.log(`📍 Encontrada línea de dependencias: "${depLine.trim()}"`);
    
    // Extraer dependencias actuales (formato: }, [dep1, dep2]);)
    const depsMatch = depLine.match(/\[([^\]]*)\]/);
    if (!depsMatch) {
      console.log(`⚠️  Formato de dependencias no reconocido en ${filePath}:${depArrayLineIndex + 1}`);
      return;
    }

    const currentDepsStr = depsMatch[1];
    const currentDeps = currentDepsStr
      .split(',')
      .map(dep => dep.trim().replace(/['"]/g, ''))
      .filter(dep => dep.length > 0);

    console.log(`📋 Dependencias actuales: [${currentDeps.join(', ')}]`);

    // Verificar si la dependencia ya existe
    if (currentDeps.some(dep => dep === warning.missingDep || dep.includes(warning.missingDep))) {
      console.log(`✓ Dependencia '${warning.missingDep}' ya existe en ${filePath}`);
      return;
    }

    // Agregar la dependencia faltante
    currentDeps.push(warning.missingDep);
    
    // Reconstruir la línea con formato limpio
    const newDepsStr = currentDeps.join(', ');
    const newLine = depLine.replace(/\[([^\]]*)\]/, `[${newDepsStr}]`);
    
    lines[depArrayLineIndex] = newLine;
    
    // Guardar el archivo
    fs.writeFileSync(filePath, lines.join('\n'));
    
    if (!this.fixedFiles.includes(filePath)) {
      this.fixedFiles.push(filePath);
    }
    
    console.log(`✓ Agregada dependencia '${warning.missingDep}' en ${filePath}:${warning.line}`);
    console.log(`  Nueva línea: "${newLine.trim()}"`);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const fixer = new ReactHooksFixer();
  fixer.run().catch(console.error);
}

module.exports = ReactHooksFixer;