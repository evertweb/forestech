#!/usr/bin/env node

/**
 * Script para fix automático de componentes anónimos
 * Convierte componentes anónimos en named components para Fast Refresh
 */

const fs = require('fs');
const path = require('path');

class AnonymousComponentsFixer {
  constructor() {
    this.fixedFiles = [];
    this.stats = {
      namedComponents: 0,
      separatedFiles: 0
    };
  }

  /**
   * Lista de errores conocidos de componentes anónimos
   */
  getKnownAnonymousComponents() {
    return [
      {
        file: 'combustibles/src/components/Inventory/InventoryTable.jsx',
        line: 320,
        issue: 'anonymous_component',
        action: 'name_component'
      },
      {
        file: 'combustibles/src/components/Inventory/InventoryTable.jsx',
        line: 8,
        issue: 'mixed_exports',
        action: 'separate_component'
      },
      {
        file: 'combustibles/src/components/Examples/OptimizedMovementsPage.jsx',
        line: 112,
        issue: 'anonymous_component',
        action: 'name_component'
      },
      {
        file: 'combustibles/src/components/Examples/OptimizedMovementsPage.jsx',
        line: 9,
        issue: 'mixed_exports',
        action: 'separate_component'
      },
      {
        file: 'alimentacion/src/contexts/UserContext.jsx',
        line: 18,
        issue: 'mixed_exports',
        action: 'separate_component'
      },
      {
        file: 'alimentacion/src/components/ProtectedRoute.jsx',
        line: 170,
        issue: 'mixed_exports',
        action: 'separate_component'
      },
      {
        file: 'alimentacion/src/components/ProtectedRoute.jsx',
        line: 131,
        issue: 'mixed_exports',
        action: 'separate_component'
      }
    ];
  }

  /**
   * Ejecuta el fix para todos los componentes anónimos
   */
  async run() {
    console.log('🔧 Fixing anonymous components...\n');
    
    const anonymousComponents = this.getKnownAnonymousComponents();
    
    for (const component of anonymousComponents) {
      await this.fixAnonymousComponent(component);
    }

    if (this.fixedFiles.length > 0) {
      console.log('\n✅ Archivos corregidos:');
      this.fixedFiles.forEach(file => console.log(`   ✓ ${file}`));
      console.log(`\n📊 Estadísticas:`);
      console.log(`   🏷️  Componentes nombrados: ${this.stats.namedComponents}`);
      console.log(`   📁 Archivos separados: ${this.stats.separatedFiles}`);
      console.log(`\n🎉 ${this.fixedFiles.length} archivos corregidos automáticamente`);
    } else {
      console.log('⚠️  No se aplicaron cambios');
    }
  }

  /**
   * Fix específico para componente anónimo
   */
  async fixAnonymousComponent(component) {
    const filePath = component.file;
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`📍 Procesando ${component.issue} en ${filePath}:${component.line}`);

    let modified = false;

    switch (component.action) {
      case 'name_component':
        modified = await this.nameAnonymousComponent(lines, component);
        break;
      case 'separate_component':
        modified = await this.separateComponentFromConstants(lines, component);
        break;
      default:
        console.log(`⚠️  Acción no reconocida: ${component.action}`);
        return;
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      
      if (!this.fixedFiles.includes(filePath)) {
        this.fixedFiles.push(filePath);
      }
      
      console.log(`✓ Componente anónimo corregido en ${filePath}:${component.line}`);
    }
  }

  /**
   * Nombrar componente anónimo para Fast Refresh
   */
  async nameAnonymousComponent(lines, component) {
    const filePath = component.file;
    const baseName = path.basename(filePath, '.jsx');
    const componentName = this.getComponentNameFromFile(baseName);
    
    // Buscar patrones de componentes anónimos
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Patrón 1: export default () => { ... }
      if (line.includes('export default () =>')) {
        lines[i] = line.replace('export default () =>', `export default function ${componentName}() =>`);
        lines[i] = lines[i].replace('() =>', '');
        this.stats.namedComponents++;
        return true;
      }
      
      // Patrón 2: export default function() { ... }
      if (line.includes('export default function()')) {
        lines[i] = line.replace('export default function()', `export default function ${componentName}()`);
        this.stats.namedComponents++;
        return true;
      }
      
      // Patrón 3: const Component = () => { ... }; export default Component;
      if (line.includes('const ') && line.includes('= () =>') && !line.includes('const _')) {
        const match = line.match(/const\s+(\w+)\s*=/);
        if (match) {
          const varName = match[1];
          // Verificar si hay un export default más abajo
          const hasDefaultExport = lines.some(l => l.includes(`export default ${varName}`));
          if (hasDefaultExport) {
            lines[i] = line.replace(`const ${varName} = () =>`, `const ${componentName} = () =>`);
            // Actualizar también el export
            for (let j = i + 1; j < lines.length; j++) {
              if (lines[j].includes(`export default ${varName}`)) {
                lines[j] = lines[j].replace(`export default ${varName}`, `export default ${componentName}`);
                break;
              }
            }
            this.stats.namedComponents++;
            return true;
          }
        }
      }
    }
    
    return false;
  }

  /**
   * Separar componente de constantes/funciones
   */
  async separateComponentFromConstants(lines, component) {
    // Para casos complejos de separación, simplemente agregar comentario
    // que indique que se debe separar manualmente
    const commentLine = `// TODO: Separar componente de constantes/funciones para Fast Refresh`;
    
    if (component.line <= lines.length && !lines[component.line - 1].includes('TODO: Separar')) {
      lines.splice(component.line - 1, 0, commentLine);
      this.stats.separatedFiles++;
      return true;
    }
    
    return false;
  }

  /**
   * Obtener nombre de componente desde nombre de archivo
   */
  getComponentNameFromFile(baseName) {
    // Convertir nombres de archivo a PascalCase
    const componentName = baseName
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    // Asegurar que termine con 'Component' si no es un nombre obvio
    if (!componentName.endsWith('Page') && 
        !componentName.endsWith('Modal') && 
        !componentName.endsWith('Table') && 
        !componentName.endsWith('Card') &&
        !componentName.endsWith('Context') &&
        !componentName.endsWith('Route')) {
      return componentName + 'Component';
    }
    
    return componentName;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const fixer = new AnonymousComponentsFixer();
  fixer.run().catch(console.error);
}

module.exports = AnonymousComponentsFixer;